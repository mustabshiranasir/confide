import stickerCatalogJson from './stickers.json';
import { Sticker, StickerCatalog, StickerCategory } from '../types/sticker';
import { resolveSticker } from './stickerAssets';
import { ImageSourcePropType, Platform } from 'react-native';

const catalog = stickerCatalogJson as StickerCatalog;

let byIdMap: Map<string, Sticker> | null = null;
const sourceCache = new Map<string, { web?: ImageSourcePropType; original?: ImageSourcePropType }>();

export const WEB_OPTIMIZER_BASE = '/_vercel/image';
export const WEB_OPTIMIZER_WIDTH = 320;
export const WEB_OPTIMIZER_QUALITY = 80;

function buildByIdMap(): Map<string, Sticker> {
  if (!byIdMap) {
    const map = new Map<string, Sticker>();
    for (const category of catalog.categories) {
      for (const sticker of category.stickers) {
        map.set(sticker.id, sticker);
      }
    }
    byIdMap = map;
  }
  return byIdMap;
}

function getSourceUri(source: ImageSourcePropType): string | null {
  if (typeof source === 'string') return source;
  if (typeof source === 'object' && source !== null) {
    const uri = (source as { uri?: unknown }).uri;
    if (typeof uri === 'string') return uri;
  }
  return null;
}

function toOptimizedWebSource(source: ImageSourcePropType): ImageSourcePropType {
  const uri = getSourceUri(source);
  if (!uri) return source;
  const params = `url=${encodeURIComponent(uri)}&w=${WEB_OPTIMIZER_WIDTH}&q=${WEB_OPTIMIZER_QUALITY}`;
  return `${WEB_OPTIMIZER_BASE}?${params}` as unknown as ImageSourcePropType;
}

export function getCategories(): StickerCategory[] {
  return catalog.categories.filter((c) => c.stickers.length > 0);
}

export function getStickers(categoryName: string): Sticker[] {
  const category = catalog.categories.find((c) => c.name === categoryName);
  return category ? category.stickers : [];
}

export function getStickerById(stickerId: string): Sticker | undefined {
  return buildByIdMap().get(stickerId);
}

export function getStickerSource(stickerId: string): ImageSourcePropType | undefined {
  return getStickerSourcePair(stickerId).web;
}

export function getStickerSourcePair(
  stickerId: string,
): { web?: ImageSourcePropType; original?: ImageSourcePropType } {
  const cached = sourceCache.get(stickerId);
  if (cached) return cached;
  const sticker = getStickerById(stickerId);
  const original = sticker ? resolveSticker(sticker.file) : undefined;
  let web: ImageSourcePropType | undefined = original;
  if (web && Platform.OS === 'web') {
    web = toOptimizedWebSource(web);
  }
  const pair = { web, original };
  sourceCache.set(stickerId, pair);
  return pair;
}

export { catalog };
