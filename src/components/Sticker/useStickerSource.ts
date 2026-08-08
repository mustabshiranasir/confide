import { useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { getStickerSourcePair } from '../../data/stickers';

export interface StickerSourceResult {
  source: ImageSourcePropType | undefined;
  onError: (() => void) | undefined;
}

export function useStickerSource(stickerId: string): StickerSourceResult {
  const [fallback, setFallback] = useState(false);

  const pair = getStickerSourcePair(stickerId);
  if (fallback) {
    return { source: pair.original, onError: undefined };
  }
  return {
    source: pair.web,
    onError: pair.web === pair.original ? undefined : () => setFallback(true),
  };
}
