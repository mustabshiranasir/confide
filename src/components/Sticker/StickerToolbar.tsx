import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface StickerToolbarProps {
  /**
   * Currently selected sticker id, if any.
   */
  activeStickerId?: string | null;
}

export default function StickerToolbar({ activeStickerId }: StickerToolbarProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
