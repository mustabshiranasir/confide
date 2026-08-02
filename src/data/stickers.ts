import stickerCatalogJson from './stickers.json';
import { Sticker, StickerCatalog, StickerCategory } from '../types/sticker';
import { resolveSticker } from './stickerAssets';
import { ImageSourcePropType } from 'react-native';

const catalog = stickerCatalogJson as StickerCatalog;

let byIdMap: Map<string, Sticker> | null = null;
let sourceCache: Map<string, ImageSourcePropType | undefined> | null = null;

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
  if (!sourceCache) {
    sourceCache = new Map();
    for (const category of catalog.categories) {
      for (const sticker of category.stickers) {
        sourceCache.set(sticker.id, resolveSticker(sticker.file));
      }
    }
  }
  return sourceCache.get(stickerId);
}

export { catalog };
