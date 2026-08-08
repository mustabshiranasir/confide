import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { getCategories, getStickerById } from '../../data/stickers';
import { useStickerSource } from './useStickerSource';
import {
  getFavoriteIds,
  toggleFavorite,
  getRecentIds,
  recordStickerUse,
} from '../../data/stickerPrefs';
import { Sticker } from '../../types/sticker';

export interface StickerPickerProps {
  onSelect?: (sticker: Sticker) => void;
  onClose?: () => void;
}

const PANEL_HEIGHT = 300;
const NUM_COLUMNS = 5;

type TabKey = 'recents' | 'favorites' | string;

function PickerCell({
  item,
  cellSize,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: {
  item: Sticker;
  cellSize: number;
  isFavorite: boolean;
  onSelect: (sticker: Sticker) => void;
  onToggleFavorite: (stickerId: string) => void;
}) {
  const { source, onError } = useStickerSource(item.id);
  if (!source) return null;
  return (
    <TouchableOpacity
      style={[styles.cell, { width: cellSize, height: cellSize }]}
      activeOpacity={0.6}
      onPress={() => onSelect(item)}
    >
      <Image source={source} style={styles.cellImage} resizeMode="contain" onError={onError} />
      <TouchableOpacity
        style={styles.heartButton}
        activeOpacity={0.7}
        onPress={() => onToggleFavorite(item.id)}
        hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
      >
        <Text style={[styles.heart, isFavorite && styles.heartActive]}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function StickerPicker({ onSelect, onClose }: StickerPickerProps) {
  const { width } = useWindowDimensions();
  const categories = useMemo(() => getCategories(), []);
  const [activeCategory, setActiveCategory] = useState<TabKey>(categories[0]?.name ?? '');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    getFavoriteIds().then((ids) => { if (mounted) setFavoriteIds(ids); });
    getRecentIds().then((ids) => { if (mounted) setRecentIds(ids); });
    return () => { mounted = false; };
  }, []);

  const recents = useMemo(
    () => recentIds.map(getStickerById).filter((s): s is Sticker => Boolean(s)),
    [recentIds],
  );

  const favorites = useMemo(
    () => favoriteIds.map(getStickerById).filter((s): s is Sticker => Boolean(s)),
    [favoriteIds],
  );

  const activeStickers = useMemo(() => {
    if (activeCategory === '__recents__') return recents;
    if (activeCategory === '__favorites__') return favorites;
    const category = categories.find((c) => c.name === activeCategory);
    return category ? category.stickers : [];
  }, [activeCategory, categories, recents, favorites]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(0, { damping: 20, stiffness: 140 }) }],
    opacity: withSpring(1, { damping: 20, stiffness: 140 }),
  }));

  const cellSize = (width - 32 - (NUM_COLUMNS - 1) * 8) / NUM_COLUMNS;

  const handleToggleFavorite = (stickerId: string) => {
    toggleFavorite(stickerId).then((ids) => setFavoriteIds(ids));
  };

  const handleSelect = (item: Sticker) => {
    recordStickerUse(item.id).then((ids) => setRecentIds(ids));
    onSelect?.(item);
  };

  const renderItem = ({ item }: { item: Sticker }) => {
    return (
      <PickerCell
        item={item}
        cellSize={cellSize}
        isFavorite={favoriteIds.includes(item.id)}
        onSelect={handleSelect}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>Stickers</Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryWrap}>
        {recents.length > 0 && (
          <TouchableOpacity
            style={[styles.chip, activeCategory === '__recents__' && styles.chipActive]}
            activeOpacity={0.6}
            onPress={() => setActiveCategory('__recents__')}
          >
            <Text style={[styles.chipLabel, activeCategory === '__recents__' && styles.chipLabelActive]}>
              Recents
            </Text>
            <Text style={[styles.chipCount, activeCategory === '__recents__' && styles.chipCountActive]}>
              {recents.length}
            </Text>
          </TouchableOpacity>
        )}

        {favorites.length > 0 && (
          <TouchableOpacity
            style={[styles.chip, activeCategory === '__favorites__' && styles.chipActive]}
            activeOpacity={0.6}
            onPress={() => setActiveCategory('__favorites__')}
          >
            <Text style={[styles.chipLabel, activeCategory === '__favorites__' && styles.chipLabelActive]}>
              Favorites
            </Text>
            <Text style={[styles.chipCount, activeCategory === '__favorites__' && styles.chipCountActive]}>
              {favorites.length}
            </Text>
          </TouchableOpacity>
        )}

        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[styles.chip, activeCategory === category.name && styles.chipActive]}
            activeOpacity={0.6}
            onPress={() => setActiveCategory(category.name)}
          >
            <Text style={[styles.chipLabel, activeCategory === category.name && styles.chipLabelActive]}>
              {category.label}
            </Text>
            <Text style={[styles.chipCount, activeCategory === category.name && styles.chipCountActive]}>
              {category.stickers.length}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeStickers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No stickers here yet.</Text>
        </View>
      ) : (
        <FlatList
          data={activeStickers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: PANEL_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 16, zIndex: 999,
    paddingHorizontal: 16,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  title: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.text },
  doneText: { fontFamily: fonts.ui, fontSize: 13, color: colors.accent },
  categoryWrap: {
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
    rowGap: 6, marginBottom: 8,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 5, paddingHorizontal: 9, borderRadius: 13,
    backgroundColor: colors.base, marginRight: 6,
  },
  chipActive: { backgroundColor: colors.sage },
  chipLabel: { fontFamily: fonts.uiSemiBold, fontSize: 11, color: colors.text },
  chipLabelActive: { color: colors.white },
  chipCount: { fontFamily: fonts.ui, fontSize: 9, color: colors.textLight },
  chipCountActive: { color: 'rgba(255,255,255,0.85)' },
  gridContent: { paddingBottom: 16 },
  row: { marginBottom: 8 },
  cell: {
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: colors.base,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'visible',
  },
  cellImage: { width: '78%', height: '78%' },
  heartButton: {
    position: 'absolute', top: 2, right: 2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  heart: { fontFamily: fonts.ui, fontSize: 14, color: colors.textLight, lineHeight: 16 },
  heartActive: { color: '#E0574F' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fonts.ui, fontSize: 13, color: colors.textLight },
});
