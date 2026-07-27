import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PaperStyle } from './JournalPage';

interface BackgroundPickerProps {
  isVisible: boolean;
  current: PaperStyle;
  onSelect: (style: PaperStyle) => void;
  onClose: () => void;
}

const OPTIONS: { key: PaperStyle; label: string }[] = [
  { key: 'lined', label: 'Lined' },
  { key: 'kraft', label: 'Kraft' },
  { key: 'grid', label: 'Grid' },
  { key: 'pastel', label: 'Blush' },
];

const SWATCH_SIZE = 44;
const PANEL_HEIGHT = 90;

export default function BackgroundPicker({ isVisible, current, onSelect, onClose }: BackgroundPickerProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(isVisible ? 0 : PANEL_HEIGHT + 8, { damping: 20, stiffness: 140 }) }],
    opacity: withSpring(isVisible ? 1 : 0, { damping: 20, stiffness: 140 }),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>Paper</Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.swatchRow}>
        {OPTIONS.map((opt) => (
          <TouchableOpacity key={opt.key} style={styles.swatchCol} activeOpacity={0.6} onPress={() => onSelect(opt.key)}>
            <View style={[styles.swatch, current === opt.key && styles.swatchActive]}>
              <SwatchPreview style={opt.key} />
            </View>
            <Text style={[styles.swatchLabel, current === opt.key && styles.swatchLabelActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

function SwatchPreview({ style }: { style: PaperStyle }) {
  switch (style) {
    case 'lined':
      return (
        <View style={[sp.preview, { backgroundColor: '#FFFFFF' }]}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[sp.miniLine, { top: 6 + i * 6 }]} />
          ))}
          <View style={sp.miniMargin} />
        </View>
      );
    case 'kraft':
      return (
        <View style={[sp.preview, { backgroundColor: '#E8DCC8' }]}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[sp.miniFiber, { top: 8 + i * 8, left: 6 + i * 5, transform: [{ rotate: `${i * 30}deg` }] }]} />
          ))}
        </View>
      );
    case 'grid':
      return (
        <View style={[sp.preview, { backgroundColor: '#F8F6F2' }]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={`h${i}`} style={[sp.miniGridH, { top: 6 + i * 7 }]} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <View key={`v${i}`} style={[sp.miniGridV, { left: 7 + i * 8 }]} />
          ))}
        </View>
      );
    case 'pastel':
      return (
        <View style={[sp.preview, { backgroundColor: '#FDE8EF' }]}>
          <View style={sp.miniWash1} />
          <View style={sp.miniWash2} />
        </View>
      );
    default:
      return <View style={sp.preview} />;
  }
}

const sp = StyleSheet.create({
  preview: { width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' },
  miniLine: { position: 'absolute', left: 4, right: 4, height: 0.5, backgroundColor: 'rgba(180,195,210,0.4)' },
  miniMargin: { position: 'absolute', top: 2, bottom: 2, left: 10, width: 0.5, backgroundColor: 'rgba(243,198,211,0.5)' },
  miniFiber: { position: 'absolute', width: 6, height: 0.8, backgroundColor: 'rgba(160,140,110,0.25)', borderRadius: 1 },
  miniGridH: { position: 'absolute', left: 3, right: 3, height: 0.5, backgroundColor: 'rgba(160,180,200,0.3)' },
  miniGridV: { position: 'absolute', top: 3, bottom: 3, width: 0.5, backgroundColor: 'rgba(160,180,200,0.3)' },
  miniWash1: { position: 'absolute', top: 4, left: 2, width: 20, height: 14, backgroundColor: 'rgba(243,198,211,0.3)', borderRadius: 10 },
  miniWash2: { position: 'absolute', bottom: 4, right: 2, width: 16, height: 12, backgroundColor: 'rgba(183,196,168,0.2)', borderRadius: 10 },
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: PANEL_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 16, zIndex: 999,
    paddingHorizontal: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 6 },
  title: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.text },
  doneText: { fontFamily: fonts.ui, fontSize: 13, color: colors.accent },
  swatchRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 4 },
  swatchCol: { alignItems: 'center', gap: 6 },
  swatch: {
    width: SWATCH_SIZE, height: SWATCH_SIZE, borderRadius: SWATCH_SIZE / 2,
    borderWidth: 2, borderColor: 'transparent', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  swatchActive: { borderColor: colors.accent, shadowOpacity: 0.15, shadowRadius: 5, elevation: 5 },
  swatchLabel: { fontFamily: fonts.ui, fontSize: 10, color: colors.textLight, letterSpacing: 0.3 },
  swatchLabelActive: { color: colors.accent, fontFamily: fonts.uiSemiBold },
});
