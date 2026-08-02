import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface StickerItemProps {
  /**
   * Unique id of the placed sticker instance.
   */
  id: string;
  /**
   * Id of the sticker definition used for this item.
   */
  stickerId: string;
}

export default function StickerItem({ id, stickerId }: StickerItemProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
