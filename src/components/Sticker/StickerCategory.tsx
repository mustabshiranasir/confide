import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { useStickerSource } from './useStickerSource';
import { Sticker, StickerCategory as StickerCategoryType } from '../../types/sticker';

export interface StickerCategoryProps {
  category: StickerCategoryType;
  onSelect?: (sticker: Sticker) => void;
}

const NUM_COLUMNS = 5;

function StickerCell({
  item,
  isSelected,
  onSelect,
}: {
  item: Sticker;
  isSelected: boolean;
  onSelect: (sticker: Sticker) => void;
}) {
  const { source, onError } = useStickerSource(item.id);
  if (!source) return null;
  return (
    <TouchableOpacity
      style={[styles.cell, isSelected && styles.cellActive]}
      activeOpacity={0.6}
      onPress={() => onSelect(item)}
    >
      <Image source={source} style={styles.cellImage} resizeMode="contain" onError={onError} />
    </TouchableOpacity>
  );
}

export default function StickerCategory({ category, onSelect }: StickerCategoryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: Sticker }) => (
    <StickerCell
      item={item}
      isSelected={selectedId === item.id}
      onSelect={(sticker) => {
        setSelectedId(sticker.id);
        onSelect?.(sticker);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.label}</Text>
      <FlatList
        data={category.stickers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  title: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 13,
    color: colors.text,
    marginBottom: 10,
  },
  row: {
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    marginHorizontal: 4,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: colors.base,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cellActive: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  cellImage: {
    width: '80%',
    height: '80%',
  },
});
