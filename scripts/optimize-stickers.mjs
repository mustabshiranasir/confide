/**
 * Sticker optimizer (non-destructive).
 *
 * Post-processes every sliced sticker in assets/stickers/<category>/*.png:
 *   1. Trims transparent padding down to a small border so each sticker
 *      fills more of its preview cell and looks larger / cleaner.
 *   2. Removes the faint semi-transparent halo left over from the original
 *      sheets (alpha < ALPHA_MIN is dropped), giving crisper edges and
 *      better PNG compression.
 *
 * Note: pixel dimensions are never resized, so stickers keep their exact
 * original appearance and quality.
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

      const img = crop(png, bounds);
      cleanAlpha(img);

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
