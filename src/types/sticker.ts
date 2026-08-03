export interface Sticker {
  id: string;
  name: string;
  category: string;
  file: string;
  tags: string[];
}

export interface StickerCategory {
  name: string;
  label: string;
  stickers: Sticker[];
}

export interface StickerCatalog {
  categories: StickerCategory[];
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  widthScale?: number;
  heightScale?: number;
}
