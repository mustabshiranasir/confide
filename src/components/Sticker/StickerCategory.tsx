import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface StickerCategoryProps {
  /**
   * Category key (e.g. 'flowers', 'travel', 'vintage').
   */
  name: string;
}

export default function StickerCategory({ name }: StickerCategoryProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
