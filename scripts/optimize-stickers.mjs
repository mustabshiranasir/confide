/**
 * Sticker optimizer.
 *
 * Post-processes every sliced sticker in assets/stickers/<category>/*.png:
 *   1. Trims transparent padding down to a small border so each sticker
 *      fills more of its preview cell and looks larger / cleaner.
 *   2. Removes the faint semi-transparent halo left over from the original
 *      sheets (alpha < ALPHA_MIN is dropped), giving crisper edges and
 *      much better PNG compression.
 *   3. Downscales stickers that are significantly larger than what the app
 *      actually renders (stickers display at ~80px and rarely beyond ~2x,
 *      so MAX_DIM is plenty). This is the main fix for slow sticker loading
 *      on the web build.
 *
 * Output overwrites the input files. Names are unchanged, so the sticker
 * catalog (stickers.json / stickerAssets.ts) does not need to change.
 *
 * Run: node scripts/optimize-stickers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS_DIR = path.join(ROOT, 'assets', 'stickers');

const MAX_DIM = 256;
// Only downscale when the sticker is at least this many times MAX_DIM,
// otherwise the resample just softens edges and bloats the PNG.
const DOWNSCALE_MIN = MAX_DIM * 1.4;
const ALPHA_MIN = 32;
const CONTENT_ALPHA = 32;
const PAD = 2;

const SHEET_RE = /^pack\d+\.png$/i;
const WASHI_SHEET_RE = /^newpack\d*\.png$/i;

function contentBounds(png) {
  const { width, height, data } = png;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    const base = y * width;
    for (let x = 0; x < width; x++) {
      if (data[(base + x) * 4 + 3] >= CONTENT_ALPHA) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX >= 0 ? { minX, minY, maxX, maxY } : null;
}

function crop(png, b) {
  const w = Math.min(png.width, b.maxX - b.minX + 1 + PAD * 2);
  const h = Math.min(png.height, b.maxY - b.minY + 1 + PAD * 2);
  const x = Math.max(0, b.minX - PAD);
  const y = Math.max(0, b.minY - PAD);
  const out = new PNG({ width: w, height: h });
  for (let yy = 0; yy < h; yy++) {
    const si = (y + yy) * png.width + x;
    const di = yy * w;
    for (let xx = 0; xx < w; xx++) {
      const s = (si + xx) * 4;
      const d = (di + xx) * 4;
      out.data[d] = png.data[s];
      out.data[d + 1] = png.data[s + 1];
      out.data[d + 2] = png.data[s + 2];
      out.data[d + 3] = png.data[s + 3];
    }
  }
  return out;
}

// Faint fringe -> fully transparent (RGB zeroed so deflate runs compress well).
function cleanAlpha(png) {
  const { data } = png;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < ALPHA_MIN) {
      data[i + 3] = 0;
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }
}

// Area-average (box) downscale with premultiplied alpha to avoid dark halos.
function downscale(png, maxDim) {
  const { width, height, data } = png;
  const scale = Math.max(width, height) / maxDim;
  const outW = Math.max(1, Math.round(width / scale));
  const outH = Math.max(1, Math.round(height / scale));

  const out = new PNG({ width: outW, height: outH });
  const ksx = width / outW;
  const ksy = height / outH;

  for (let oy = 0; oy < outH; oy++) {
    const y0 = oy * ksy;
    const y1 = (oy + 1) * ksy;
    const sy0 = Math.floor(y0);
    const sy1 = Math.min(height - 1, Math.ceil(y1));
    for (let ox = 0; ox < outW; ox++) {
      const x0 = ox * ksx;
      const x1 = (ox + 1) * ksx;
      const sx0 = Math.floor(x0);
      const sx1 = Math.min(width - 1, Math.ceil(x1));
      let aR = 0, aG = 0, aB = 0, aA = 0;
      for (let syy = sy0; syy <= sy1; syy++) {
        const wy = Math.min(syy + 1, y1) - Math.max(syy, y0);
        if (wy <= 0) continue;
        const base = syy * width;
        for (let sxx = sx0; sxx <= sx1; sxx++) {
          const wx = Math.min(sxx + 1, x1) - Math.max(sxx, x0);
          if (wx <= 0) continue;
          const w = wx * wy;
          const s = (base + sxx) * 4;
          const a = data[s + 3];
          aR += data[s] * a * w;
          aG += data[s + 1] * a * w;
          aB += data[s + 2] * a * w;
          aA += a * w;
        }
      }
      const area = ksx * ksy;
      const d = (oy * outW + ox) * 4;
      if (aA <= 0) {
        out.data[d + 3] = 0;
      } else {
        const inv = 255 / aA;
        out.data[d] = Math.round(aR / area * inv);
        out.data[d + 1] = Math.round(aG / area * inv);
        out.data[d + 2] = Math.round(aB / area * inv);
        out.data[d + 3] = Math.round(aA / area);
      }
    }
  }
  return out;
}

function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('missing directory: ' + ASSETS_DIR);
    process.exit(1);
  }

  const categories = fs
    .readdirSync(ASSETS_DIR)
    .filter((name) => fs.statSync(path.join(ASSETS_DIR, name)).isDirectory())
    .sort();

  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;

  for (const category of categories) {
    const dir = path.join(ASSETS_DIR, category);
    const files = fs
      .readdirSync(dir)
      .filter(
        (f) =>
          f.toLowerCase().endsWith('.png') &&
          !SHEET_RE.test(f) &&
          !WASHI_SHEET_RE.test(f),
      )
      .sort();

    let catBefore = 0;
    let catAfter = 0;
    for (const file of files) {
      const src = path.join(dir, file);
      const before = fs.statSync(src).size;
      totalBefore += before;
      catBefore += before;

      const png = PNG.sync.read(fs.readFileSync(src));
      const bounds = contentBounds(png);
      if (!bounds) {
        totalAfter += before;
        catAfter += before;
        continue;
      }

      let img = crop(png, bounds);
      cleanAlpha(img);

      const maxDim = Math.max(img.width, img.height);
      if (maxDim > DOWNSCALE_MIN) {
        img = downscale(img, MAX_DIM);
        cleanAlpha(img); // remove fringe reintroduced by the resample
      }

      const after = PNG.sync.write(img).length;
      totalAfter += after;
      catAfter += after;
      if (after !== before) {
        changed++;
        fs.writeFileSync(src, PNG.sync.write(img));
      }
    }
    console.log(
      `${category.padEnd(10)} ${String(files.length).padStart(3)} files  ${(catBefore / 1024).toFixed(0)}KB -> ${(catAfter / 1024).toFixed(0)}KB  (${((catAfter / Math.max(1, catBefore)) * 100).toFixed(0)}%)`,
    );
  }

  console.log(`\ntotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB (${((totalAfter / Math.max(1, totalBefore)) * 100).toFixed(0)}%)  changed=${changed}`);
}

main();
