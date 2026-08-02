import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlacedSticker } from '../../types/sticker';
import StickerItem from './StickerItem';

export interface StickerCanvasProps {
  stickers: PlacedSticker[];
  activeStickerId: string | null;
  onActivate: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PlacedSticker>) => void;
  onDelete: (id: string) => void;
}

export default function StickerCanvas({
  stickers,
  activeStickerId,
  onActivate,
  onUpdate,
  onDelete,
}: StickerCanvasProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {stickers.map((sticker, index) => (
        <StickerItem
          key={sticker.id}
          sticker={sticker}
          isActive={activeStickerId === sticker.id}
          zIndex={index + 1}
          onActivate={onActivate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
