/**
 * Washi tape pack slicer.
 *
 * The uploaded washi packs are transparent PNG sheets. Each sheet contains
 * several long tape strips (one design per strip). This script segments each
 * sheet into individual trimmed stickers so they can be used like any other
 * sticker in the catalog.
 *
 * The segmentation is automatic: content rows are grouped into horizontal
 * bands, then each band is split into column runs. Every run that is large
 * enough becomes a sticker. Tiny specks / stray pixels are dropped.
 *
 * Output: assets/stickers/washi/washi_<pack>_<idx>.png
 * These files are picked up automatically by scripts/sync-stickers.mjs.
 *
 * Already-sliced packs are skipped, so re-running is safe.
 *
 * Run: node scripts/slice-washi.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WASHI_DIR = path.join(ROOT, 'assets', 'stickers', 'washi');

const SHEET_RE = /^newpack\d*\.png$/i;
const SLICED_RE = /^washi_\d{3}_\d{3}\.png$/;

const OPAQUE_ALPHA = 32;
const GAP_RATIO = 0.03;
const MIN_W = 16;
const MIN_H = 16;
const MIN_AREA = 200;
const PAD = 2;

function groupRuns(items) {
  const runs = [];
  let start = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i] && start < 0) start = i;
    if ((!items[i] || i === items.length - 1) && start >= 0) {
      runs.push([start, items[i] ? i : i - 1]);
      start = -1;
    }
  }
  return runs;
}

function contentRows(png) {
  const { width, height, data } = png;
  const threshold = Math.max(2, Math.floor(width * GAP_RATIO));
  const rows = new Array(height);
  for (let y = 0; y < height; y++) {
    let n = 0;
    const base = y * width;
    for (let x = 0; x < width; x++) {
      if (data[(base + x) * 4 + 3] >= OPAQUE_ALPHA) n++;
    }
    rows[y] = n >= threshold;
  }
  return rows;
}

function cropPng(png, x, y, w, h) {
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

function segmentSheet(png) {
  const { width, height, data } = png;
  const bands = groupRuns(contentRows(png));
  const stickers = [];

  for (const [y0, y1] of bands) {
    const cols = new Array(width);
    for (let x = 0; x < width; x++) {
      let has = false;
      for (let y = y0; y <= y1; y++) {
        if (data[(y * width + x) * 4 + 3] > 0) {
          has = true;
          break;
        }
      }
      cols[x] = has;
    }

    for (const [x0, x1] of groupRuns(cols)) {
      let minX = x1;
      let maxX = x0;
      let minY = y1;
      let maxY = y0;
      let area = 0;
      for (let y = y0; y <= y1; y++) {
        const base = y * width;
        for (let x = x0; x <= x1; x++) {
          if (data[(base + x) * 4 + 3] > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            area++;
          }
        }
      }

      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      if (w < MIN_W || h < MIN_H || area < MIN_AREA) continue;

      const px = Math.max(0, minX - PAD);
      const py = Math.max(0, minY - PAD);
      const pw = Math.min(width - px, w + PAD * 2);
      const ph = Math.min(height - py, h + PAD * 2);
      stickers.push({ x: px, y: py, w: pw, h: ph });
    }
  }

  return stickers;
}

function main() {
  if (!fs.existsSync(WASHI_DIR)) {
    console.error('missing directory: ' + WASHI_DIR);
    process.exit(1);
  }

  const sheets = fs.readdirSync(WASHI_DIR)
    .filter((f) => SHEET_RE.test(f))
    .sort();

  if (sheets.length === 0) {
    console.log('no washi sheets found');
    return;
  }

  const already = fs.readdirSync(WASHI_DIR).filter((f) => SLICED_RE.test(f));
  let total = 0;

  for (const [sheetIdx, sheet] of sheets.entries()) {
    const packNo = String(sheetIdx + 1).padStart(3, '0');

    if (already.some((f) => f.startsWith(`washi_${packNo}_`))) {
      console.log(`skip ${sheet} (pack ${packNo} already sliced)`);
      continue;
    }

    const png = PNG.sync.read(fs.readFileSync(path.join(WASHI_DIR, sheet)));
    const stickers = segmentSheet(png);

    stickers.forEach((s, i) => {
      const file = `washi_${packNo}_${String(i + 1).padStart(3, '0')}.png`;
      const cropped = cropPng(png, s.x, s.y, s.w, s.h);
      fs.writeFileSync(path.join(WASHI_DIR, file), PNG.sync.write(cropped));
    });

    total += stickers.length;
    console.log(`${sheet} -> ${stickers.length} stickers`);
  }

  console.log(`total sliced: ${total}`);
}

main();
