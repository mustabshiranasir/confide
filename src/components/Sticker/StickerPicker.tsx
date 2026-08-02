import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface StickerPickerProps {
  /**
   * Callback fired when a sticker is selected from the picker.
   */
  onSelect?: (stickerId: string) => void;
}

export default function StickerPicker({ onSelect }: StickerPickerProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280,
  },
});
