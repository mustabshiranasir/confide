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
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import JournalPage from '../components/JournalPage';
import { PaperStyle } from '../components/JournalPage';
import StickerTray from '../components/StickerTray';
import BackgroundPicker from '../components/BackgroundPicker';
import DraggableSticker from '../components/DraggableSticker';
import { PlacedSticker } from '../types/sticker';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: { page: number; newEntry?: { text: string; date: string; stickers?: PlacedSticker[] } };
  NewEntry: undefined;
};

const INITIAL_HEIGHT = 280;

function StickerIcon() {
  return (
    <View style={iconStyles.stickerOuter}>
      <View style={iconStyles.stickerFold} />
    </View>
  );
}

function PaletteIcon() {
  return (
    <View style={iconStyles.paletteOuter}>
      <View style={[iconStyles.paletteDot, { top: 4, left: 5 }]} />
      <View style={[iconStyles.paletteDot, { top: 4, left: 18 }]} />
      <View style={[iconStyles.paletteDot, { top: 15, left: 11 }]} />
    </View>
  );
}

function CheckIcon() {
  return (
    <View style={iconStyles.checkOuter}>
      <View style={iconStyles.checkStroke} />
    </View>
  );
}

export default function NewEntryScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [text, setText] = useState('');
  const [contentHeight, setContentHeight] = useState(INITIAL_HEIGHT);
  const [isStickerTrayOpen, setIsStickerTrayOpen] = useState(false);
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('lined');
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const textRef = useRef<TextInput>(null);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleContentSizeChange = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      setContentHeight(Math.max(INITIAL_HEIGHT, e.nativeEvent.layout.height));
    },
    [],
  );

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed && placedStickers.length === 0) return;
    navigation.navigate('JournalBook', {
      page: 0,
      newEntry: { text: trimmed, date: today, stickers: placedStickers },
    });
  };

  const handleAddSticker = (stickerId: string) => {
    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}`,
      stickerId,
      imageUrl: stickerId,
      x: 100,
      y: 100,
      scale: 1,
      rotation: 0,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setActiveStickerId(newSticker.id);
  };

  const handleDeleteSticker = (id: string) => {
    setPlacedStickers((prev) => prev.filter((s) => s.id !== id));
    if (activeStickerId === id) setActiveStickerId(null);
  };

  const handleUpdateSticker = (id: string, updates: Partial<PlacedSticker>) => {
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
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

          <Text style={styles.dateLabel}>{today}</Text>
          <View style={styles.dateUnderline} />

          <TextInput
            ref={textRef}
            style={[styles.textInput, { minHeight: contentHeight }]}
            placeholder="Start writing..."
            placeholderTextColor="rgba(74, 74, 74, 0.25)"
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
            onLayout={handleContentSizeChange}
            autoFocus
            blurOnSubmit={false}
            selectionColor={colors.accent}
            scrollEnabled={false}
          />

          {placedStickers.map((sticker) => (
            <DraggableSticker
              key={sticker.id}
              sticker={sticker}
              isActive={activeStickerId === sticker.id}
              onActivate={setActiveStickerId}
              onUpdate={handleUpdateSticker}
              onDelete={handleDeleteSticker}
            />
          ))}
        </JournalPage>
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolButton}
          activeOpacity={0.6}
          onPress={() => {
            setIsBgPickerOpen(false);
            setIsStickerTrayOpen(true);
          }}
        >
          <StickerIcon />
          <Text style={styles.toolLabel}>Stickers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          activeOpacity={0.6}
          onPress={() => {
            setIsStickerTrayOpen(false);
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

      <StickerTray
        isVisible={isStickerTrayOpen}
        onSelectSticker={handleAddSticker}
        onClose={() => setIsStickerTrayOpen(false)}
      />

      <BackgroundPicker
        isVisible={isBgPickerOpen}
        current={paperStyle}
        onSelect={(style) => setPaperStyle(style)}
        onClose={() => setIsBgPickerOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const iconStyles = StyleSheet.create({
  stickerOuter: {
    width: 22, height: 22, borderWidth: 1.5, borderColor: colors.text,
    borderRadius: 3, position: 'relative', overflow: 'hidden',
  },
  stickerFold: {
    position: 'absolute', top: 0, right: 0, width: 7, height: 7,
    backgroundColor: colors.base, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: colors.text,
  },
  paletteOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.text, position: 'relative',
  },
  paletteDot: {
    position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: colors.text,
  },
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
  textInput: {
    fontFamily: fonts.handwritten, fontSize: 22, color: colors.text,
    lineHeight: 34, padding: 0, borderWidth: 0,
  },
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: 24, backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)',
  },
  toolButton: { alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12 },
  toolLabel: { fontFamily: fonts.ui, fontSize: 10, color: colors.textLight, letterSpacing: 0.5 },
  saveButton: { alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12 },
  saveButtonDisabled: { opacity: 0.35 },
  saveLabel: { fontFamily: fonts.uiSemiBold, fontSize: 10, color: colors.sage, letterSpacing: 0.5 },
  saveLabelDisabled: { color: colors.textLight },
});
