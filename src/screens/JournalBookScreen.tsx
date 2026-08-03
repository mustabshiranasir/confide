import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
import { loadEntries, StoredEntry } from '../data/journalStore';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: { page: number; newEntry?: { id: string; text: string; date: string; stickers?: PlacedSticker[]; background?: PaperStyle } };
  NewEntry: undefined;
};

interface Entry {
  id: string;
  date: string;
  text: string;
  stickers?: PlacedSticker[];
  background?: PaperStyle;
}

const { width: SCREEN_W } = Dimensions.get('window');
const PAGE_W = SCREEN_W - 40;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Entry>);

const SAMPLE_ENTRIES: Entry[] = [
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
}: {
  item: Entry;
  index: number;
  scrollX: SharedValue<number>;
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

  return (
    <View style={styles.pageWrapper}>
      <Animated.View style={[styles.pageContainer, animatedStyle]}>
        <JournalPage background={item.background ?? 'custom'} style={styles.diaryPage}>
          <View style={styles.tapeStrip} />
          <Text style={styles.dateText}>{item.date}</Text>
          <View style={styles.dateUnderline} />
          <Text style={[styles.entryText, { color: getPaperInk(item.background ?? 'custom') }]}>{item.text}</Text>

          {item.stickers?.map((sticker) => {
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
    </View>
  );
}

export default function JournalBookScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'JournalBook'>>();
  const newEntryParam = route.params?.newEntry;
  const startPage = route.params?.page ?? 0;

  const [persisted, setPersisted] = useState<StoredEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadEntries().then((entries) => {
      if (mounted) {
        setPersisted(entries);
        setLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  const entries: Entry[] = React.useMemo(() => {
    const base = loaded ? persisted : [];
    const mapEntry = (e: StoredEntry): Entry => ({
      id: e.id,
      date: e.date,
      text: e.text,
      stickers: e.stickers,
      background: e.background,
    });
    const all = newEntryParam ? [mapEntry(newEntryParam), ...base] : [...base];
    const seen = new Set<string>();
    const deduped = all.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    return [...deduped, ...SAMPLE_ENTRIES];
  }, [loaded, persisted, newEntryParam]);

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

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Entry>) => (
      <PageFlipItem item={item} index={index} scrollX={scrollX} />
    ),
    [scrollX],
  );

  const keyExtractor = useCallback((item: Entry) => item.id, []);

  return (
    <View style={styles.container}>
      <AnimatedFlatList
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

      <View style={styles.folioBar}>
        <View style={styles.folioDivider} />
        <Text style={styles.folioText}>
          {currentPage + 1} {'\u2014'} {entries.length}
        </Text>
        <View style={styles.folioDivider} />
      </View>

      <TouchableOpacity
        style={styles.newEntryPill}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('NewEntry')}
      >
        <Text style={styles.newEntryPillText}>+ New Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  listContent: { paddingTop: 20, paddingBottom: 8, paddingHorizontal: 20 },
  pageWrapper: { width: PAGE_W, height: '100%', justifyContent: 'center', alignItems: 'center' },
  pageContainer: {
    width: PAGE_W - 16, height: '92%',
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
  folioText: { fontFamily: fonts.ui, fontSize: 12, color: colors.textLight, letterSpacing: 2 },
  newEntryPill: {
    alignSelf: 'center', marginBottom: 20, paddingVertical: 10, paddingHorizontal: 24,
    borderRadius: 20, backgroundColor: colors.accent,
  },
  newEntryPillText: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.white },
});
