/**
 * Sticker catalog sync script.
 *
 * Scans assets/stickers/<category>/*.png, then:
 *   1. Updates src/data/stickers.json
 *        - existing stickers are kept (names/tags survive)
 *        - new image files are appended to their category
 *        - entries whose file no longer exists are removed
 *        - new category folders are added automatically
 *   2. Regenerates src/data/stickerAssets.ts with static Metro requires
 *
 * Run: node scripts/sync-stickers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS_DIR = path.join(ROOT, 'assets', 'stickers');
const CATALOG_PATH = path.join(ROOT, 'src', 'data', 'stickers.json');
const ASSETS_TS_PATH = path.join(ROOT, 'src', 'data', 'stickerAssets.ts');

const SHEET_RE = /^pack\d+\.png$/i;
const WASHI_SHEET_RE = /^newpack\d*\.png$/i;
const STICKER_RE = /^(.+?)_(\d{3})_(\d{3})\.png$/;

function listStickerFiles(categoryDir) {
  if (!fs.existsSync(categoryDir)) return [];
  return fs
    .readdirSync(categoryDir)
    .filter(
      (f) =>
        f.toLowerCase().endsWith('.png') &&
        !SHEET_RE.test(f) &&
        !WASHI_SHEET_RE.test(f),
    )
    .sort();
}

function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function humanizeName(category, file) {
  const m = file.match(STICKER_RE);
  if (m) {
    return `${titleCase(category)} ${Number(m[2])}-${String(Number(m[3])).padStart(2, '0')}`;
  }
  const base = file.replace(/\.png$/i, '');
  return titleCase(
    base
      .split(/[_-]+/)
      .map((w) => titleCase(w))
      .join(' '),
  );
}

function buildTags(category, file) {
  const tags = [category];
  const m = file.match(STICKER_RE);
  if (m) tags.push(`pack${Number(m[2])}`);
  return tags;
}

function toId(file) {
  return file.replace(/\.png$/i, '');
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const folders = fs
    .readdirSync(ASSETS_DIR)
    .filter((name) => fs.statSync(path.join(ASSETS_DIR, name)).isDirectory())
    .sort();

  let added = 0;
  let removed = 0;
  let removedCategories = 0;

  for (const folder of folders) {
    const files = listStickerFiles(path.join(ASSETS_DIR, folder));
    let category = catalog.categories.find((c) => c.name === folder);

    if (!category) {
      category = { name: folder, label: titleCase(folder), stickers: [] };
      catalog.categories.push(category);
    }

    const existing = new Map(category.stickers.map((s) => [s.file, s]));

    // Drop entries whose file is gone.
    const retained = [];
    for (const s of category.stickers) {
      if (files.includes(s.file)) {
        retained.push(s);
      } else {
        removed += 1;
      }
    }

    // Append new files.
    for (const file of files) {
      if (!existing.has(file)) {
        retained.push({
          id: toId(file),
          name: humanizeName(folder, file),
          category: folder,
          file,
          tags: buildTags(folder, file),
        });
        added += 1;
      }
    }

    category.stickers = retained;
  }

  // Drop categories that have no folder on disk anymore (removes dead entries).
  const before = catalog.categories.length;
  catalog.categories = catalog.categories.filter((c) =>
    folders.includes(c.name),
  );
  removedCategories = before - catalog.categories.length;

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n');

  // ---- Regenerate stickerAssets.ts ----
  const lines = [];
  lines.push("import { ImageSourcePropType } from 'react-native';");
  lines.push('');
  lines.push('/**');
  lines.push(' * Maps sticker file names to their bundled asset modules.');
  lines.push(' * Metro requires static require() calls, so this file is generated');
  lines.push(' * by scripts/sync-stickers.mjs. Do not edit by hand.');
  lines.push(' */');
  lines.push('export const stickerAssets: Record<string, ImageSourcePropType> = {');
  for (const category of catalog.categories) {
    for (const sticker of category.stickers) {
      const rel = path.posix.join('../../assets/stickers', category.name, sticker.file);
      lines.push(`  '${sticker.file}': require('${rel}'),`);
    }
  }
  lines.push('};');
  lines.push('');
  lines.push('export function resolveSticker(file: string): ImageSourcePropType | undefined {');
  lines.push('  return stickerAssets[file];');
  lines.push('}');
  lines.push('');
  fs.writeFileSync(ASSETS_TS_PATH, lines.join('\n'));

  const total = catalog.categories.reduce((n, c) => n + c.stickers.length, 0);
  console.log(`stickerAssets: ${total} stickers across ${catalog.categories.length} categories`);
  console.log(`added: ${added}, removed: ${removed}, removedCategories: ${removedCategories}`);
  for (const c of catalog.categories) {
    if (c.stickers.length > 0) {
      console.log(`  ${c.name.padEnd(12)} ${c.stickers.length}`);
    }
  }
}

main();
