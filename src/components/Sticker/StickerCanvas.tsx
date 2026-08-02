import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface StickerCanvasProps {
  /**
   * Absolute container that hosts all placed stickers.
   */
  children?: React.ReactNode;
}

export default function StickerCanvas({ children }: StickerCanvasProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
});
