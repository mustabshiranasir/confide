import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ListRenderItemInfo,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import JournalPage, { getPaperInk, PaperStyle } from '../components/JournalPage';
import GradientPageText from '../components/GradientPageText';
import { useStickerSource } from '../components/Sticker/useStickerSource';
import { deleteEntry, getAllEntries } from '../storage/journalStorage';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { resolveTextStyle } from '../theme/fontStyles';
import { PlacedSticker } from '../types/sticker';
import { DEFAULT_TEXT_STYLE, isGradientColor, TextStyle } from '../types/textStyle';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: { page: number; newEntry?: { id: string; text: string; date: string; stickers?: PlacedSticker[]; decorations?: PlacedSticker[]; background?: PaperStyle; textStyle?: TextStyle } };
  NewEntry: undefined;
};

interface JournalEntry {
  id: string;
  date: string;
  text: string;
  stickers?: PlacedSticker[];
  decorations?: PlacedSticker[];
  background?: PaperStyle;
  textStyle?: TextStyle;
}

const { width: SCREEN_W } = Dimensions.get('window');
const ITEM_W = SCREEN_W;
const MAX_PAGE_W = 460;
const pageWidth = Math.min(SCREEN_W - 24, MAX_PAGE_W);
const PAGE_H = Math.round(pageWidth * (4 / 3));
const LIST_H = PAGE_H + 28;
const CONTENT_W = pageWidth - 64;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<JournalEntry>);

const EMPTY_PAGES: JournalEntry[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `blank-${i}`,
  date: '',
  text: '',
  background: 'white',
}));

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
    const pageOffset = index * ITEM_W;
    const diff = scrollX.value - pageOffset;
    const normalized = diff / ITEM_W;

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
  const textStyle = item.textStyle ?? DEFAULT_TEXT_STYLE;
  const resolvedTextStyle = resolveTextStyle(textStyle, getPaperInk(item.background ?? 'custom'));
  const isGradient = isGradientColor(textStyle.color);

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
            {item.text ? (
              <>
                <View style={styles.tapeStrip} />
                <Text style={styles.dateText}>{item.date}</Text>
                <View style={styles.dateUnderline} />
                {isGradient ? (
                  <GradientPageText text={item.text} style={textStyle} width={CONTENT_W} />
                ) : (
                  <Text style={[styles.entryText, resolvedTextStyle]}>{item.text}</Text>
                )}
              </>
            ) : null}

            {placedStickers?.map((sticker) => (
              <PlacedStickerView key={sticker.id} sticker={sticker} />
            ))}
          </JournalPage>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

function PlacedStickerView({ sticker }: { sticker: PlacedSticker }) {
  const { source, onError } = useStickerSource(sticker.stickerId);
  if (!source) return null;
  return (
    <View
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
      <Image source={source} style={{ width: 80, height: 80 }} resizeMode="contain" onError={onError} />
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
    const samples = EMPTY_PAGES.filter((s) => !removedSampleIds.includes(s.id));
    return deduped.length > 0 ? deduped : samples;
  }, [loaded, persisted, newEntryParam, removedSampleIds]);

  const [currentPage, setCurrentPage] = useState(startPage);
  const scrollX = useSharedValue(startPage * ITEM_W);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => { scrollX.value = e.contentOffset.x; },
  });

  const onMomentumEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / ITEM_W);
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
            length: ITEM_W,
            offset: ITEM_W * index,
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
  listContent: { paddingTop: 20, paddingBottom: 8 },
  pageWrapper: { width: ITEM_W, height: '100%', justifyContent: 'center', alignItems: 'center' },
  pageTouchable: { width: '100%', height: '100%' },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  diaryPage: { width: '100%', maxWidth: MAX_PAGE_W, aspectRatio: 3 / 4 },
  tapeStrip: {
    position: 'absolute', top: 8, right: 16, width: 56, height: 16,
    backgroundColor: 'rgba(183,196,168,0.4)', borderRadius: 2, transform: [{ rotate: '12deg' }],
  },
  dateText: { fontFamily: fonts.handwritten, fontSize: 22, color: colors.sage, marginBottom: 4 },
  dateUnderline: { width: 80, height: 1, backgroundColor: colors.accent, marginBottom: 16 },
  entryText: {},
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