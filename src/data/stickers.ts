export type StickerCategory = 'Botanicals' | 'Hearts' | 'Washi Tape' | 'Vintage Ephemera' | 'Daily Life';

export interface StickerDef {
  id: string;
  category: StickerCategory;
  width: number;
  height: number;
}

export const STICKER_CATEGORIES: { title: StickerCategory; items: StickerDef[] }[] = [
  {
    title: 'Botanicals',
    items: [
      { id: 'vintage-rose', category: 'Botanicals', width: 80, height: 90 },
      { id: 'lavender-sprig', category: 'Botanicals', width: 40, height: 100 },
      { id: 'pressed-fern', category: 'Botanicals', width: 70, height: 100 },
      { id: 'daisy', category: 'Botanicals', width: 70, height: 70 },
      { id: 'sunflower', category: 'Botanicals', width: 70, height: 70 },
      { id: 'botanical-leaf', category: 'Botanicals', width: 60, height: 90 },
    ],
  },
  {
    title: 'Hearts',
    items: [
      { id: 'lace-heart', category: 'Hearts', width: 80, height: 80 },
      { id: 'stitched-heart', category: 'Hearts', width: 80, height: 76 },
      { id: 'painted-heart', category: 'Hearts', width: 76, height: 72 },
      { id: 'double-heart', category: 'Hearts', width: 90, height: 70 },
    ],
  },
  {
    title: 'Washi Tape',
    items: [
      { id: 'gingham-tape', category: 'Washi Tape', width: 140, height: 44 },
      { id: 'floral-tape', category: 'Washi Tape', width: 140, height: 44 },
      { id: 'stripe-tape', category: 'Washi Tape', width: 140, height: 44 },
      { id: 'polka-tape', category: 'Washi Tape', width: 140, height: 44 },
      { id: 'lace-tape', category: 'Washi Tape', width: 140, height: 44 },
    ],
  },
  {
    title: 'Vintage Ephemera',
    items: [
      { id: 'postage-stamp', category: 'Vintage Ephemera', width: 72, height: 88 },
      { id: 'wax-seal', category: 'Vintage Ephemera', width: 68, height: 68 },
      { id: 'postmark', category: 'Vintage Ephemera', width: 72, height: 72 },
      { id: 'kraft-label', category: 'Vintage Ephemera', width: 90, height: 50 },
    ],
  },
  {
    title: 'Daily Life',
    items: [
      { id: 'coffee-cup', category: 'Daily Life', width: 64, height: 72 },
      { id: 'fountain-pen', category: 'Daily Life', width: 36, height: 96 },
      { id: 'camera', category: 'Daily Life', width: 80, height: 60 },
    ],
  },
];

export function getStickerDef(id: string): StickerDef | undefined {
  for (const cat of STICKER_CATEGORIES) {
    const found = cat.items.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
}
