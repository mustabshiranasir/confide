import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import JournalPage, { getPaperInk, PaperStyle } from '../components/JournalPage';
import { PlacedSticker } from '../types/sticker';
import { getStickerSource } from '../data/stickers';
import { getAllEntries, deleteEntry } from '../storage/journalStorage';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: { page: number; newEntry?: { id: string; text: string; date: string; stickers?: PlacedSticker[]; decorations?: PlacedSticker[]; background?: PaperStyle } };
  NewEntry: undefined;
};

interface JournalEntry {
  id: string;
  date: string;
  text: string;
  stickers?: PlacedSticker[];
  decorations?: PlacedSticker[];
  background?: PaperStyle;
}

const { width: SCREEN_W } = Dimensions.get('window');
const PAGE_W = SCREEN_W - 40;
const PAGE_H = Math.round((PAGE_W - 16) * (4 / 3));
const LIST_H = PAGE_H + 28;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<JournalEntry>);

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: 'July 27, 2026',
    text: 'Today was a beautiful day. I sat by the window and watched the rain, and it felt like the world was whispering secrets just for me...',
  },
  {
    id: '2',
    date: 'July 26, 2026',
    text: 'I started a new project today. The blank canvas excites me more than it should. There is something magical about beginnings.',
  },
  {
    id: '3',
    date: 'July 25, 2026',
    text: 'Spent the evening rearranging my bookshelf. Each book is a memory, a phase of life. I kept running into old friends on the shelves.',
  },
  {
    id: '4',
    date: 'July 24, 2026',
    text: 'Made lemon tea and watched the sunset through the kitchen window. Sometimes the simplest moments hold the most warmth.',
  },
  {
    id: '5',
    date: 'July 23, 2026',
    text: 'Found an old photograph tucked inside a book today. It was from a trip I had almost forgotten. Memories have a way of finding us when we need them.',
  },
];

function PageFlipItem({
  item,
  index,
  scrollX,
  onLongPress,
}: {
  item: JournalEntry;
  index: number;
  scrollX: SharedValue<number>;
  onLongPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const pageOffset = index * PAGE_W;
    const diff = scrollX.value - pageOffset;
    const normalized = diff / PAGE_W;

    const rotateY = interpolate(
      normalized,
      [-1, 0, 1],
      [40, 0, -40],
      Extrapolation.CLAMP,
    );

    const absNormalized = Math.abs(normalized);
    const shadowOp = interpolate(absNormalized, [0, 0.5, 1], [0.08, 0.18, 0.04], Extrapolation.CLAMP);
    const shadowRad = interpolate(absNormalized, [0, 0.5, 1], [10, 18, 6], Extrapolation.CLAMP);
    const zIndex = Math.round(
      interpolate(absNormalized, [0, 1], [10, 0], Extrapolation.CLAMP),
    );

    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotateY}deg` }],
      shadowOpacity: shadowOp,
      shadowRadius: shadowRad,
      zIndex,
    };
  });

  const placedStickers = item.decorations ?? item.stickers;

  return (
    <View style={styles.pageWrapper}>
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={450}
        onLongPress={onLongPress}
        style={styles.pageTouchable}
      >
        <Animated.View style={[styles.pageContainer, animatedStyle]}>
          <JournalPage background={item.background ?? 'custom'} style={styles.diaryPage}>
            <View style={styles.tapeStrip} />
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={styles.dateUnderline} />
            <Text style={[styles.entryText, { color: getPaperInk(item.background ?? 'custom') }]}>{item.text}</Text>

            {placedStickers?.map((sticker) => {
            const source = getStickerSource(sticker.stickerId);
            if (!source) return null;
            return (
              <View
                key={sticker.id}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 80,
                  height: 80,
                  opacity: sticker.opacity,
                  transform: [
                    { translateX: sticker.x },
                    { translateY: sticker.y },
                    { scaleX: sticker.scale * (sticker.widthScale ?? 1) },
                    { scaleY: sticker.scale * (sticker.heightScale ?? 1) },
                    { rotateZ: `${sticker.rotation}rad` },
                  ],
                }}
              >
                <Image source={source} style={{ width: 80, height: 80 }} resizeMode="contain" />
              </View>
            );
          })}
        </JournalPage>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export default function JournalBookScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'JournalBook'>>();
  const newEntryParam = route.params?.newEntry;
  const startPage = route.params?.page ?? 0;

  const [persisted, setPersisted] = useState<JournalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [removedSampleIds, setRemovedSampleIds] = useState<string[]>([]);

  const loadEntries = useCallback(async () => {
    const entries = await getAllEntries();
    setPersisted(entries);
    setLoaded(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  const entries: JournalEntry[] = React.useMemo(() => {
    const base = loaded ? persisted : [];
    const all = newEntryParam ? [newEntryParam, ...base] : [...base];
    const seen = new Set<string>();
    const deduped = all.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    const samples = SAMPLE_ENTRIES.filter((s) => !removedSampleIds.includes(s.id));
    return deduped.length > 0 ? deduped : samples;
  }, [loaded, persisted, newEntryParam, removedSampleIds]);

  const [currentPage, setCurrentPage] = useState(startPage);
  const scrollX = useSharedValue(startPage * PAGE_W);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => { scrollX.value = e.contentOffset.x; },
  });

  const onMomentumEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / PAGE_W);
      setCurrentPage(page);
    },
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    await deleteEntry(pendingDeleteId);
    setPersisted((prev) => prev.filter((e) => e.id !== pendingDeleteId));
    setRemovedSampleIds((prev) => (prev.includes(pendingDeleteId) ? prev : [...prev, pendingDeleteId]));
    setPendingDeleteId(null);
  }, [pendingDeleteId]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<JournalEntry>) => (
      <PageFlipItem
        item={item}
        index={index}
        scrollX={scrollX}
        onLongPress={() => setPendingDeleteId(item.id)}
      />
    ),
    [scrollX],
  );

  const keyExtractor = useCallback((item: JournalEntry) => item.id, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <AnimatedFlatList
          style={styles.list}
          data={entries}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumEnd}
          initialScrollIndex={startPage}
          getItemLayout={(_, index) => ({
            length: PAGE_W,
            offset: PAGE_W * index,
            index: index as number,
          })}
          contentContainerStyle={styles.listContent}
        />

        {pendingDeleteId && (
          <View style={styles.deleteBanner}>
            <Text style={styles.deleteBannerText}>Delete this page?</Text>
            <View style={styles.deleteBannerActions}>
              <TouchableOpacity
                style={styles.deleteCancelButton}
                activeOpacity={0.7}
                onPress={() => setPendingDeleteId(null)}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                activeOpacity={0.7}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.folioBar}>
          <TouchableOpacity
            style={styles.folioDeleteButton}
            activeOpacity={0.7}
            onPress={() => {
              const page = Math.min(currentPage, entries.length - 1);
              const current = entries[page];
              if (current) setPendingDeleteId(current.id);
            }}
          >
            <Text style={styles.folioDeleteText}>Delete page</Text>
          </TouchableOpacity>
          <View style={styles.folioDivider} />
          <Text style={styles.folioText}>
            {Math.min(currentPage, Math.max(entries.length - 1, 0)) + 1} {'\u2014'} {entries.length}
          </Text>
          <View style={styles.folioDivider} />
          <View style={styles.folioSpacer} />
        </View>

        <TouchableOpacity
          style={styles.newEntryPill}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('NewEntry')}
        >
          <Text style={styles.newEntryPillText}>+ New Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
  list: { height: LIST_H },
  listContent: { paddingTop: 20, paddingBottom: 8, paddingHorizontal: 20 },
  pageWrapper: { width: PAGE_W, height: PAGE_H, justifyContent: 'center', alignItems: 'center' },
  pageTouchable: { width: PAGE_W - 16, height: '100%' },
  pageContainer: {
    flex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  diaryPage: { flex: 1 },
  tapeStrip: {
    position: 'absolute', top: 8, right: 16, width: 56, height: 16,
    backgroundColor: 'rgba(183,196,168,0.4)', borderRadius: 2, transform: [{ rotate: '12deg' }],
  },
  dateText: { fontFamily: fonts.handwritten, fontSize: 22, color: colors.sage, marginBottom: 4 },
  dateUnderline: { width: 80, height: 1, backgroundColor: colors.accent, marginBottom: 16 },
  entryText: { fontFamily: fonts.handwritten, fontSize: 24, color: colors.text, lineHeight: 36 },
  folioBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 16 },
  folioDivider: { width: 32, height: 1, backgroundColor: 'rgba(74,74,74,0.15)' },
  folioSpacer: { width: 88 },
  folioText: { fontFamily: fonts.ui, fontSize: 12, color: colors.textLight, letterSpacing: 2 },
  folioDeleteButton: {
    width: 88, paddingVertical: 6, borderRadius: 12,
    backgroundColor: 'rgba(224,93,93,0.1)', borderWidth: 1, borderColor: 'rgba(224,93,93,0.3)',
  },
  folioDeleteText: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: '#E05D5D', textAlign: 'center' },
  deleteBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 8, paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(224,93,93,0.35)',
  },
  deleteBannerText: { fontFamily: fonts.uiSemiBold, fontSize: 13, color: colors.text },
  deleteBannerActions: { flexDirection: 'row', gap: 10 },
  deleteCancelButton: {
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14,
    backgroundColor: colors.overlay,
  },
  deleteCancelText: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: colors.textLight },
  deleteConfirmButton: {
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14,
    backgroundColor: '#E05D5D',
  },
  deleteConfirmText: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: colors.white },
  newEntryPill: {
    alignSelf: 'center', marginBottom: 20, paddingVertical: 10, paddingHorizontal: 24,
    borderRadius: 20, backgroundColor: colors.accent,
  },
  newEntryPillText: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.white },
});
