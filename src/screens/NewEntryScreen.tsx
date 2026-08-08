import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import JournalPage, { PaperStyle, getPaperInk } from '../components/JournalPage';
import BackgroundPicker from '../components/BackgroundPicker';
import FontPanel from '../components/FontPanel';
import StickerPicker from '../components/Sticker/StickerPicker';
import StickerCanvas from '../components/Sticker/StickerCanvas';
import StickerToolbar from '../components/Sticker/StickerToolbar';
import { PlacedSticker, Sticker } from '../types/sticker';
import { DEFAULT_TEXT_STYLE, DEFAULT_TITLE_STYLE, TextStyle, TextStyleRange, applyStyleToSelection, rebaseRanges } from '../types/textStyle';
import { resolveTextStyle } from '../theme/fontStyles';
import { useStickerHistory } from '../hooks/useStickerHistory';
import { saveEntry } from '../storage/journalStorage';
import StyledEntryText from '../components/StyledEntryText';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: { page: number; newEntry?: { id: string; text: string; title?: string; titleStyle?: TextStyle; date: string; stickers?: PlacedSticker[]; decorations?: PlacedSticker[]; background?: PaperStyle; textStyle?: TextStyle; ranges?: TextStyleRange[] } };
  NewEntry: undefined;
};

const INITIAL_HEIGHT = 280;
const OPACITY_STEP = 0.2;
const WIDTH_HEIGHT_STEP = 0.2;

const STICKER_PETALS = [
  [12, 8.9],
  [9.05, 11.04],
  [10.18, 14.51],
  [13.82, 14.51],
  [14.95, 11.04],
];

function StickerIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <G transform="rotate(-8 12 12)">
        <Rect x="4" y="4" width="16" height="16" rx="3.5" fill={colors.sage} />
        <Path d="M16.4,4 L20,4 L20,7.6 Z" fill="#A3B495" />
        <Path d="M16.4,4 L20,7.6" stroke={colors.base} strokeWidth="1" />
        {STICKER_PETALS.map(([x, y]) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={colors.accent} />
        ))}
        <Circle cx="12" cy="12" r="2.4" fill={colors.white} />
        <Circle cx="11.3" cy="11.3" r="0.5" fill={colors.text} />
        <Circle cx="12.7" cy="11.3" r="0.5" fill={colors.text} />
        <Path
          d="M10.8,13.2 Q12,14.4 13.2,13.2"
          stroke={colors.text}
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}

function PaletteIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c0.83,0,1.5-0.67,1.5-1.5 0-0.39-0.15-0.74-0.39-1.01C12.87,18.22,12.73,17.87,12.73,17.49c0-0.83,0.67-1.5,1.5-1.5h2.76c1.66,0,3.01-1.34,3.01-3.01C20,7.03,16.42,3,12,3z"
        fill={colors.text}
      />
      <Circle cx="6.5" cy="13.5" r="1.4" fill="#E05D5D" />
      <Circle cx="10.5" cy="10.5" r="1.4" fill="#E8B44A" />
      <Circle cx="15.5" cy="10.5" r="1.4" fill="#5B8DB8" />
      <Circle cx="6.5" cy="8.5" r="1.4" fill="#8FAE7B" />
    </Svg>
  );
}

function TextIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M10.6,4.5 L13.4,4.5 L19,20 L16.4,20 L15,15.4 L9,15.4 L7.6,20 L5,20 Z M9.9,13.2 L14.1,13.2 L12,6.9 Z"
        fill={colors.text}
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <View style={iconStyles.checkOuter}>
      <View style={iconStyles.checkStroke} />
    </View>
  );
}

function UndoIcon({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" opacity={dimmed ? 0.35 : 1}>
      <Circle cx="12" cy="12" r="11" fill={colors.overlay} />
      <Path
        d="M12.5,8c-2.65,0-5.05,0.99-6.9,2.6L2,7v9h9l-3.62-3.62c1.39-1.16,3.16-1.88,5.12-1.88 3.54,0,6.55,2.31,7.6,5.5l2.37-0.78C21.08,11.03,17.15,8,12.5,8z"
        fill={colors.text}
      />
    </Svg>
  );
}

function RedoIcon({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" opacity={dimmed ? 0.35 : 1}>
      <Circle cx="12" cy="12" r="11" fill={colors.overlay} />
      <Path
        d="M18.4,10.6C16.55,8.99,14.15,8,11.5,8c-4.65,0-8.58,3.03-9.96,7.22L3.9,16c1.05-3.19,4.05-5.5,7.6-5.5,1.95,0,3.73,0.72,5.12,1.88L13,16h9V7L18.4,10.6z"
        fill={colors.text}
      />
    </Svg>
  );
}

export default function NewEntryScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [contentHeight, setContentHeight] = useState(INITIAL_HEIGHT);
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isFontPanelOpen, setIsFontPanelOpen] = useState(false);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('white');
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
  const [titleStyle, setTitleStyle] = useState<TextStyle>(DEFAULT_TITLE_STYLE);
  const [activeField, setActiveField] = useState<'title' | 'body'>('title');
  const [ranges, setRanges] = useState<TextStyleRange[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const textRef = useRef<TextInput>(null);

  const {
    stickers: placedStickers,
    setStickers,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useStickerHistory([]);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const ink = getPaperInk(paperStyle);
  const placeholderInk = ink === colors.text ? 'rgba(74, 74, 74, 0.25)' : `${ink}66`;
  const resolvedTextStyle = resolveTextStyle(textStyle, ink);
  const resolvedTitleStyle = resolveTextStyle(titleStyle, ink);
  const selectionActive = selection.end > selection.start;
  const panelStyle = activeField === 'title' ? titleStyle : textStyle;

  const activeSticker = placedStickers.find((s) => s.id === activeStickerId) ?? null;
  const activeIndex = activeSticker ? placedStickers.indexOf(activeSticker) : -1;

  const handleContentSizeChange = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      setContentHeight(Math.max(INITIAL_HEIGHT, e.nativeEvent.layout.height));
    },
    [],
  );

  const handleSelectionChange = useCallback(
    (e: { nativeEvent: { selection: { start: number; end: number } } }) => {
      setSelection(e.nativeEvent.selection);
    },
    [],
  );

  const handleChangeText = useCallback(
    (newText: string) => {
      setRanges((prev) => rebaseRanges(prev, text, newText));
      setText(newText);
    },
    [text],
  );

  const handleStyleChange = useCallback(
    (updates: Partial<TextStyle>) => {
      if (activeField === 'title') {
        setTitleStyle((prev) => ({ ...prev, ...updates }));
        return;
      }
      const start = Math.min(selection.start, selection.end);
      const end = Math.max(selection.start, selection.end);
      if (end > start) {
        setRanges((prev) => applyStyleToSelection(prev, start, end - start, updates));
      } else {
        setTextStyle((prev) => ({ ...prev, ...updates }));
      }
    },
    [activeField, selection],
  );

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed && placedStickers.length === 0) return;
    const id = `entry-${Date.now()}`;
    const entry = {
      id,
      text: trimmed,
      title: title.trim() || undefined,
      titleStyle,
      date: today,
      background: paperStyle,
      textStyle,
      ranges,
      decorations: placedStickers,
    };
    await saveEntry(entry);
    navigation.navigate('JournalBook', {
      page: 0,
      newEntry: entry,
    });
  };

  const handleSelectSticker = (sticker: Sticker) => {
    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}`,
      stickerId: sticker.id,
      x: 90,
      y: 120,
      scale: 1,
      rotation: 0,
      opacity: 1,
      widthScale: 1,
      heightScale: 1,
    };
    setStickers((prev) => [...prev, newSticker]);
    setActiveStickerId(newSticker.id);
    setIsStickerPickerOpen(false);
  };

  const handleUpdateSticker = (id: string, updates: Partial<PlacedSticker>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleDeleteSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (activeStickerId === id) setActiveStickerId(null);
  };

  const handleDuplicate = () => {
    if (!activeSticker) return;
    const copy: PlacedSticker = {
      ...activeSticker,
      id: `sticker-${Date.now()}`,
      x: activeSticker.x + 24,
      y: activeSticker.y + 24,
    };
    setStickers((prev) => [...prev, copy]);
    setActiveStickerId(copy.id);
  };

  const handleBringToFront = () => {
    if (activeIndex < 0) return;
    setStickers((prev) => {
      const item = prev[activeIndex];
      return [...prev.filter((_, i) => i !== activeIndex), item];
    });
  };

  const handleSendToBack = () => {
    if (activeIndex < 0) return;
    setStickers((prev) => {
      const item = prev[activeIndex];
      return [item, ...prev.filter((_, i) => i !== activeIndex)];
    });
  };

  const handleOpacityChange = (delta: number) => {
    if (!activeStickerId) return;
    setStickers((prev) =>
      prev.map((s) =>
        s.id === activeStickerId
          ? { ...s, opacity: Math.min(1, Math.max(0.2, Math.round((s.opacity + delta) * 10) / 10)) }
          : s
      )
    );
  };

  const handleWidthChange = (delta: number) => {
    if (!activeStickerId) return;
    setStickers((prev) =>
      prev.map((s) =>
        s.id === activeStickerId
          ? { ...s, widthScale: Math.min(6, Math.max(0.4, Math.round(((s.widthScale ?? 1) + delta) * 10) / 10)) }
          : s
      )
    );
  };

  const handleHeightChange = (delta: number) => {
    if (!activeStickerId) return;
    setStickers((prev) =>
      prev.map((s) =>
        s.id === activeStickerId
          ? { ...s, heightScale: Math.min(6, Math.max(0.4, Math.round(((s.heightScale ?? 1) + delta) * 10) / 10)) }
          : s
      )
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <JournalPage background={paperStyle} contentPadding style={styles.page}>
          <View style={styles.tapeDecoration} />

          <TextInput
            style={[
              styles.titleInput,
              {
                color: resolvedTitleStyle.color,
                fontFamily: resolvedTitleStyle.fontFamily,
                fontSize: resolvedTitleStyle.fontSize,
                lineHeight: resolvedTitleStyle.lineHeight,
                letterSpacing: resolvedTitleStyle.letterSpacing,
                textAlign: resolvedTitleStyle.textAlign,
                textTransform: resolvedTitleStyle.textTransform,
                textDecorationLine: resolvedTitleStyle.textDecorationLine,
              },
            ]}
            placeholder="Entry title..."
            placeholderTextColor={placeholderInk}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setActiveField('title')}
            maxLength={60}
            returnKeyType="done"
            blurOnSubmit
          />
          <View style={styles.titleUnderline} />

          <Text style={styles.dateLabel}>{today}</Text>
          <View style={styles.dateUnderline} />

          <View style={styles.bodyWrapper}>
            <StyledEntryText
              text={text}
              ranges={ranges}
              baseStyle={textStyle}
              fallbackColor={ink}
              style={[
                styles.textInput,
                styles.previewOverlay,
                {
                  color: resolvedTextStyle.color,
                  fontFamily: resolvedTextStyle.fontFamily,
                  fontSize: resolvedTextStyle.fontSize,
                  lineHeight: resolvedTextStyle.lineHeight,
                  letterSpacing: resolvedTextStyle.letterSpacing,
                  textAlign: resolvedTextStyle.textAlign,
                  textTransform: resolvedTextStyle.textTransform,
                },
              ]}
            />
            <TextInput
              ref={textRef}
              style={[
                styles.textInput,
                {
                  minHeight: contentHeight,
                  color: 'transparent',
                  fontFamily: resolvedTextStyle.fontFamily,
                  fontSize: resolvedTextStyle.fontSize,
                  lineHeight: resolvedTextStyle.lineHeight,
                  letterSpacing: resolvedTextStyle.letterSpacing,
                  textAlign: resolvedTextStyle.textAlign,
                  textTransform: resolvedTextStyle.textTransform,
                },
              ]}
              placeholder="Start writing..."
              placeholderTextColor={placeholderInk}
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={handleChangeText}
              onSelectionChange={handleSelectionChange}
              onFocus={() => setActiveField('body')}
              onLayout={handleContentSizeChange}
              autoFocus
              blurOnSubmit={false}
              selectionColor={colors.accent}
              scrollEnabled={false}
            />
          </View>

          <StickerCanvas
            stickers={placedStickers}
            activeStickerId={activeStickerId}
            onActivate={setActiveStickerId}
            onUpdate={handleUpdateSticker}
            onDelete={handleDeleteSticker}
          />
        </JournalPage>
      </ScrollView>

      {activeSticker && !isStickerPickerOpen && !isFontPanelOpen && (
        <StickerToolbar
          onDuplicate={handleDuplicate}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onOpacityDown={() => handleOpacityChange(-OPACITY_STEP)}
          onOpacityUp={() => handleOpacityChange(OPACITY_STEP)}
          onWidthDown={() => handleWidthChange(-WIDTH_HEIGHT_STEP)}
          onWidthUp={() => handleWidthChange(WIDTH_HEIGHT_STEP)}
          onHeightDown={() => handleHeightChange(-WIDTH_HEIGHT_STEP)}
          onHeightUp={() => handleHeightChange(WIDTH_HEIGHT_STEP)}
          onDelete={() => handleDeleteSticker(activeSticker.id)}
          onClose={() => setActiveStickerId(null)}
          opacity={activeSticker.opacity}
          widthScale={activeSticker.widthScale ?? 1}
          heightScale={activeSticker.heightScale ?? 1}
          canBringToFront={activeIndex < placedStickers.length - 1}
          canSendToBack={activeIndex > 0}
        />
      )}

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolButton}
          activeOpacity={0.6}
          disabled={!canUndo}
          onPress={undo}
        >
          <UndoIcon dimmed={!canUndo} />
          <Text style={[styles.toolLabel, !canUndo && styles.toolLabelDisabled]}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          activeOpacity={0.6}
          disabled={!canRedo}
          onPress={redo}
        >
          <RedoIcon dimmed={!canRedo} />
          <Text style={[styles.toolLabel, !canRedo && styles.toolLabelDisabled]}>Redo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolButton, isFontPanelOpen && styles.toolButtonActive]}
          activeOpacity={0.6}
          onPress={() => {
            setIsBgPickerOpen(false);
            setIsStickerPickerOpen(false);
            setIsFontPanelOpen((prev) => !prev);
          }}
        >
          <TextIcon />
          <Text style={[styles.toolLabel, isFontPanelOpen && styles.toolLabelActive]}>Text</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          activeOpacity={0.6}
          onPress={() => {
            setIsBgPickerOpen(false);
            setIsFontPanelOpen(false);
            setIsStickerPickerOpen(true);
          }}
        >
          <StickerIcon />
          <Text style={styles.toolLabel}>Stickers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          activeOpacity={0.6}
          onPress={() => {
            setIsStickerPickerOpen(false);
            setIsFontPanelOpen(false);
            setIsBgPickerOpen((prev) => !prev);
          }}
        >
          <PaletteIcon />
          <Text style={styles.toolLabel}>Background</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, (!text.trim() && placedStickers.length === 0) && styles.saveButtonDisabled]}
          activeOpacity={0.7}
          onPress={handleSave}
          disabled={!text.trim() && placedStickers.length === 0}
        >
          <CheckIcon />
          <Text style={[styles.saveLabel, (!text.trim() && placedStickers.length === 0) && styles.saveLabelDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      {isStickerPickerOpen && (
        <StickerPicker
          onSelect={handleSelectSticker}
          onClose={() => setIsStickerPickerOpen(false)}
        />
      )}

      <BackgroundPicker
        isVisible={isBgPickerOpen}
        current={paperStyle}
        onSelect={(style) => setPaperStyle(style)}
        onClose={() => setIsBgPickerOpen(false)}
      />

      {isFontPanelOpen && (
        <FontPanel
          visible={isFontPanelOpen}
          style={panelStyle}
          selectionActive={activeField === 'title' ? true : selectionActive}
          onChange={handleStyleChange}
          onClose={() => setIsFontPanelOpen(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const iconStyles = StyleSheet.create({
  checkOuter: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.sage,
    justifyContent: 'center', alignItems: 'center',
  },
  checkStroke: {
    width: 8, height: 4, borderLeftWidth: 1.8, borderBottomWidth: 1.8,
    borderColor: colors.white, transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  page: { marginHorizontal: 4 },
  tapeDecoration: {
    position: 'absolute', top: 8, left: 12, width: 48, height: 14,
    backgroundColor: 'rgba(243,198,211,0.4)', borderRadius: 2, transform: [{ rotate: '-8deg' }],
  },
  dateLabel: { fontFamily: fonts.handwritten, fontSize: 22, color: colors.sage, marginBottom: 4 },
  dateUnderline: { width: 80, height: 1, backgroundColor: colors.accent, marginBottom: 12 },
  titleInput: {
    padding: 0,
    borderWidth: 0,
  },
  titleUnderline: {
    width: 160,
    height: 1.5,
    backgroundColor: colors.sage,
    marginTop: 6,
    marginBottom: 14,
    opacity: 0.6,
  },
  bodyWrapper: { position: 'relative', minHeight: 80 },
  previewOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  textInput: {
    fontFamily: fonts.handwritten, fontSize: 22,
    lineHeight: 34, padding: 0, borderWidth: 0,
  },
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: 24, backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)',
  },
  toolButton: { alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12 },
  toolButtonActive: { backgroundColor: 'rgba(183,196,168,0.25)', borderRadius: 12 },
  toolLabel: { fontFamily: fonts.ui, fontSize: 10, color: colors.textLight, letterSpacing: 0.5 },
  toolLabelActive: { color: colors.sage, fontFamily: fonts.uiSemiBold },
  toolLabelDisabled: { opacity: 0.35 },
  saveButton: { alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12 },
  saveButtonDisabled: { opacity: 0.35 },
  saveLabel: { fontFamily: fonts.uiSemiBold, fontSize: 10, color: colors.sage, letterSpacing: 0.5 },
  saveLabelDisabled: { color: colors.textLight },
});
