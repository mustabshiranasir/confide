import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { STICKER_CATEGORIES, StickerCategory } from '../data/stickers';
import StickerRenderer from './StickerRenderer';

interface StickerTrayProps {
  isVisible: boolean;
  onSelectSticker: (stickerId: string) => void;
  onClose: () => void;
}

const TRAY_HEIGHT = 320;

export default function StickerTray({ isVisible, onSelectSticker, onClose }: StickerTrayProps) {
  const [activeCategory, setActiveCategory] = useState<StickerCategory>('Botanicals');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withSpring(isVisible ? 0 : TRAY_HEIGHT, { damping: 20, stiffness: 120 }),
    }],
  }));

  const activeItems = STICKER_CATEGORIES.find((c) => c.title === activeCategory)?.items ?? [];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>Stickers</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
        {STICKER_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.title}
            style={[styles.tab, activeCategory === cat.title && styles.tabActive]}
            activeOpacity={0.7}
            onPress={() => setActiveCategory(cat.title)}
          >
            <Text style={[styles.tabText, activeCategory === cat.title && styles.tabTextActive]}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stickerRow}>
        {activeItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.stickerBtn}
            activeOpacity={0.6}
            onPress={() => { onSelectSticker(item.id); onClose(); }}
          >
            <View style={styles.stickerThumb}>
              <StickerRenderer stickerId={item.id} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: TRAY_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 20, zIndex: 1000,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingBottom: 8,
  },
  title: { fontFamily: fonts.uiSemiBold, fontSize: 16, color: colors.text },
  closeBtn: { padding: 4 },
  closeText: { fontFamily: fonts.ui, fontSize: 14, color: colors.accent },
  tabRow: { paddingHorizontal: 12, gap: 6, paddingBottom: 10 },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, backgroundColor: colors.base },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontFamily: fonts.ui, fontSize: 12, color: colors.textLight },
  tabTextActive: { color: colors.white, fontFamily: fonts.uiSemiBold },
  stickerRow: { paddingHorizontal: 16, gap: 12, alignItems: 'center', paddingBottom: 20 },
  stickerBtn: { alignItems: 'center', justifyContent: 'center' },
  stickerThumb: {
    width: 90, height: 90,
    backgroundColor: 'rgba(251,246,238,0.6)',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
});
