import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { PaperStyle, PAPER_STYLES } from './JournalPage';

const CUSTOM_BG = require('../../assets/backgrounds/custom.png');

interface BackgroundPickerProps {
  isVisible: boolean;
  current: PaperStyle;
  onSelect: (style: PaperStyle) => void;
  onClose: () => void;
}

const SWATCH_SIZE = 44;
const PANEL_HEIGHT = 92;

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.swatchRow}
      >
        {PAPER_STYLES.map((opt) => (
          <TouchableOpacity key={opt.key} style={styles.swatchCol} activeOpacity={0.6} onPress={() => onSelect(opt.key)}>
            <View style={[styles.swatch, current === opt.key && styles.swatchActive]}>
              <SwatchPreview style={opt.key} />
            </View>
            <Text style={[styles.swatchLabel, current === opt.key && styles.swatchLabelActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

function SwatchPreview({ style }: { style: PaperStyle }) {
  switch (style) {
    case 'custom':
      return <ImageBackground source={CUSTOM_BG} style={sp.preview} resizeMode="cover" />;
    case 'white':
      return <View style={[sp.preview, { backgroundColor: '#FFFFFF' }]} />;
    case 'lined':
      return (
        <View style={[sp.preview, { backgroundColor: '#FFFFFF' }]}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[sp.miniLine, { top: 6 + i * 6 }]} />
          ))}
          <View style={sp.miniMargin} />
        </View>
      );
    case 'dots':
      return (
        <View style={[sp.preview, { backgroundColor: '#FFFFFF' }]}>
          {[8, 18, 28, 38].map((y) =>
            [8, 18, 28, 38].map((x) => (
              <View key={`${x}-${y}`} style={[sp.miniDot, { top: y, left: x }]} />
            ))
          )}
        </View>
      );
    case 'graph':
      return (
        <View style={[sp.preview, { backgroundColor: '#F8F6F2' }]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={`h${i}`} style={[sp.miniGridH, { top: 6 + i * 8 }]} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <View key={`v${i}`} style={[sp.miniGridV, { left: 7 + i * 8 }]} />
          ))}
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
    case 'vintage':
      return (
        <View style={[sp.preview, { backgroundColor: '#F4EBD8' }]}>
          <View style={[sp.miniStain, { top: 8, left: 6, width: 14, height: 10 }]} />
          <View style={[sp.miniStain, { bottom: 6, right: 4, width: 12, height: 9 }]} />
          <View style={sp.miniBorder} />
        </View>
      );
    case 'marble':
      return (
        <View style={[sp.preview, { backgroundColor: '#FBFBF8' }]}>
          <Svg width="100%" height="100%">
            <Path d="M-2,10 C10,4 20,16 32,8 S48,18 48,8" stroke="rgba(120,120,130,0.35)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <Path d="M-2,28 C12,22 24,34 38,26 S50,36 50,26" stroke="rgba(140,130,140,0.3)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <Path d="M0,40 C12,34 22,44 34,38 S46,46 48,38" stroke="rgba(120,120,130,0.35)" strokeWidth="1" fill="none" strokeLinecap="round" />
          </Svg>
        </View>
      );
    case 'floral':
      return (
        <View style={[sp.preview, { backgroundColor: '#FFFDF7' }]}>
          <Svg width="100%" height="100%">
            {FLOWER_PREVIEW.map((f, i) => (
              <G key={i} rotation={f.r} origin={`${f.x}, ${f.y}`} opacity={0.75}>
                {PETAL_ANGLES.map((a, j) => (
                  <Circle key={j} cx={f.x + Math.cos(a) * f.s} cy={f.y + Math.sin(a) * f.s} r={f.s * 0.42} fill={f.c} />
                ))}
                <Circle cx={f.x} cy={f.y} r={f.s * 0.38} fill="#F7E7A6" />
              </G>
            ))}
          </Svg>
        </View>
      );
    case 'watercolor':
      return (
        <View style={[sp.preview, { backgroundColor: '#FCF9F4' }]}>
          <View style={[sp.miniWash1, { backgroundColor: 'rgba(243,198,211,0.35)' }]} />
          <View style={[sp.miniWash2, { backgroundColor: 'rgba(183,196,168,0.25)' }]} />
          <View style={[sp.miniWash3, { backgroundColor: 'rgba(159,195,222,0.22)' }]} />
        </View>
      );
    case 'dark':
      return (
        <View style={[sp.preview, { backgroundColor: '#2A2A31' }]}>
          {[8, 18, 28, 38].map((y) => (
            <View key={y} style={[sp.miniLineDark, { top: y }]} />
          ))}
        </View>
      );
    case 'gradient':
      return (
        <View style={sp.preview}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={{ flex: 1, backgroundColor: `rgba(222, 206, 178, ${((i + 1) / 5) * 0.55})` }} />
          ))}
        </View>
      );
    case 'fabric':
      return (
        <View style={[sp.preview, { backgroundColor: '#EFE7DA' }]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={`h${i}`} style={[sp.miniFabric, { top: 8 + i * 8, left: 3, right: 3 }]} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={`v${i}`} style={[sp.miniFabric, { left: 8 + i * 8, top: 3, bottom: 3 }]} />
          ))}
        </View>
      );
    default:
      return <View style={sp.preview} />;
  }
}

const PETAL_ANGLES = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];

const FLOWER_PREVIEW = [
  { x: 11, y: 11, s: 4, c: '#F3B8C9', r: -12 },
  { x: 34, y: 10, s: 3.4, c: '#D9B3E8', r: 18 },
  { x: 22, y: 30, s: 4.2, c: '#A9CBB7', r: 25 },
  { x: 8, y: 34, s: 3, c: '#F2CF7D', r: 40 },
  { x: 36, y: 36, s: 3.4, c: '#9FC3DE', r: -20 },
];

const sp = StyleSheet.create({
  preview: { width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' },
  miniLine: { position: 'absolute', left: 4, right: 4, height: 0.5, backgroundColor: 'rgba(180,195,210,0.4)' },
  miniLineDark: { position: 'absolute', left: 4, right: 4, height: 0.5, backgroundColor: 'rgba(255,255,255,0.12)' },
  miniMargin: { position: 'absolute', top: 2, bottom: 2, left: 10, width: 0.5, backgroundColor: 'rgba(243,198,211,0.5)' },
  miniDot: { position: 'absolute', width: 1.6, height: 1.6, borderRadius: 1, backgroundColor: 'rgba(150,165,185,0.5)' },
  miniFiber: { position: 'absolute', width: 6, height: 0.8, backgroundColor: 'rgba(160,140,110,0.25)', borderRadius: 1 },
  miniGridH: { position: 'absolute', left: 3, right: 3, height: 0.5, backgroundColor: 'rgba(160,180,200,0.35)' },
  miniGridV: { position: 'absolute', top: 3, bottom: 3, width: 0.5, backgroundColor: 'rgba(160,180,200,0.35)' },
  miniWash1: { position: 'absolute', top: 4, left: 2, width: 20, height: 14, borderRadius: 10 },
  miniWash2: { position: 'absolute', bottom: 4, right: 2, width: 16, height: 12, borderRadius: 10 },
  miniWash3: { position: 'absolute', top: 22, right: 6, width: 14, height: 10, borderRadius: 10 },
  miniStain: { position: 'absolute', backgroundColor: 'rgba(180,150,105,0.18)', borderRadius: 10 },
  miniBorder: { position: 'absolute', top: 3, left: 3, right: 3, bottom: 3, borderWidth: 0.5, borderColor: 'rgba(160,130,90,0.4)', borderRadius: 4 },
  miniFabric: { position: 'absolute', height: 0.6, width: 0.6, backgroundColor: 'rgba(140,120,95,0.25)' },
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  title: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.text },
  doneText: { fontFamily: fonts.ui, fontSize: 13, color: colors.accent },
  swatchRow: { gap: 14, paddingRight: 20, paddingBottom: 8 },
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
