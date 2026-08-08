import React, { useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { TextAlign, TextStyle } from '../types/textStyle';
import {
  DARK_COLORS,
  FONT_CATEGORY_LABELS,
  FONT_FAMILIES,
  FONT_SIZE_PRESETS,
  GRADIENT_COLORS,
  MAX_FONT_SIZE,
  MAX_LETTER_SPACING,
  MAX_LINE_HEIGHT,
  MIN_FONT_SIZE,
  MIN_LINE_HEIGHT,
  PASTEL_COLORS,
  PALETTE_COLORS,
  resolveFontFamily,
} from '../theme/fontStyles';

interface FontPanelProps {
  visible: boolean;
  style: TextStyle;
  onChange: (updates: Partial<TextStyle>) => void;
  onClose: () => void;
}

type CategoryFilter = 'all' | keyof typeof FONT_CATEGORY_LABELS;

const SLIDER_THUMB = 20;

export default function FontPanel({ visible, style, onChange, onClose }: FontPanelProps) {
  const { height: windowHeight } = useWindowDimensions();
  const panelHeight = Math.min(Math.round(windowHeight * 0.62), 480);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(visible ? 0 : panelHeight + 8, { damping: 20, stiffness: 140 }) }],
    opacity: withSpring(visible ? 1 : 0, { damping: 20, stiffness: 140 }),
  }));

  return (
    <Animated.View style={[styles.container, { height: panelHeight }, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>Text</Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <FontSection label="Font family">
          <FontFamilyGrid current={style.fontFamily} onSelect={(id) => onChange({ fontFamily: id })} />
        </FontSection>

        <FontSection label="Size">
          <View style={styles.presetRow}>
            {FONT_SIZE_PRESETS.map((preset) => {
              const active = style.fontSize === preset.size;
              return (
                <TouchableOpacity
                  key={preset.label}
                  style={[styles.presetPill, active && styles.presetPillActive]}
                  activeOpacity={0.6}
                  onPress={() => onChange({ fontSize: preset.size })}
                >
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>{preset.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <SliderRow
            label="Font size"
            value={style.fontSize}
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={1}
            formatValue={(v) => `${Math.round(v)}px`}
            onChange={(fontSize) => onChange({ fontSize })}
          />
        </FontSection>

        <FontSection label="Style">
          <View style={styles.toggleRow}>
            <ToggleButton active={style.bold} onPress={() => onChange({ bold: !style.bold })}>
              <Text style={[styles.toggleText, { fontWeight: '700' }]}>B</Text>
            </ToggleButton>
            <ToggleButton active={style.italic} onPress={() => onChange({ italic: !style.italic })}>
              <Text style={[styles.toggleText, { fontStyle: 'italic' }]}>I</Text>
            </ToggleButton>
            <ToggleButton active={style.underline} onPress={() => onChange({ underline: !style.underline })}>
              <Text style={[styles.toggleText, { textDecorationLine: 'underline' }]}>U</Text>
            </ToggleButton>
            <ToggleButton active={style.strikethrough} onPress={() => onChange({ strikethrough: !style.strikethrough })}>
              <Text style={[styles.toggleText, { textDecorationLine: 'line-through' }]}>S</Text>
            </ToggleButton>
            <ToggleButton active={style.highlight} onPress={() => onChange({ highlight: !style.highlight })}>
              <HighlightGlyph />
            </ToggleButton>
            <ToggleButton active={style.textTransform === 'uppercase'} onPress={() => onChange({ textTransform: style.textTransform === 'uppercase' ? 'none' : 'uppercase' })}>
              <Text style={[styles.toggleText, { fontSize: 15, letterSpacing: 1 }]}>AA</Text>
            </ToggleButton>
            <ToggleButton active={style.textTransform === 'lowercase'} onPress={() => onChange({ textTransform: style.textTransform === 'lowercase' ? 'none' : 'lowercase' })}>
              <Text style={[styles.toggleText, { fontSize: 15, letterSpacing: 1 }]}>aa</Text>
            </ToggleButton>
          </View>
          <SliderRow
            label="Letter spacing"
            value={style.letterSpacing}
            min={0}
            max={MAX_LETTER_SPACING}
            step={0.2}
            formatValue={(v) => v.toFixed(1)}
            onChange={(letterSpacing) => onChange({ letterSpacing })}
          />
        </FontSection>

        <FontSection label="Alignment">
          <View style={styles.toggleRow}>
            {(['left', 'center', 'right', 'justify'] as TextAlign[]).map((align) => (
              <ToggleButton
                key={align}
                active={style.textAlign === align}
                onPress={() => onChange({ textAlign: align })}
              >
                <AlignGlyph type={align} active={style.textAlign === align} />
              </ToggleButton>
            ))}
          </View>
        </FontSection>

        <FontSection label="Line height">
          <SliderRow
            label="Line height"
            value={style.lineHeight}
            min={MIN_LINE_HEIGHT}
            max={MAX_LINE_HEIGHT}
            step={0.1}
            formatValue={(v) => `x${v.toFixed(1)}`}
            onChange={(lineHeight) => onChange({ lineHeight })}
          />
        </FontSection>

        <FontSection label="Color">
          <ColorSection style={style} onChange={onChange} />
        </FontSection>
      </ScrollView>
    </Animated.View>
  );
}

function FontSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function FontFamilyGrid({ current, onSelect }: { current: string; onSelect: (id: string) => void }) {
  const { width: windowWidth } = useWindowDimensions();
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const families = useMemo(
    () => (filter === 'all' ? FONT_FAMILIES : FONT_FAMILIES.filter((f) => f.category === filter)),
    [filter],
  );

  return (
    <View>
      <View style={styles.fontChips}>
        <TouchableOpacity
          style={[styles.fontChip, filter === 'all' && styles.fontChipActive]}
          activeOpacity={0.6}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.fontChipText, filter === 'all' && styles.fontChipTextActive]}>All</Text>
        </TouchableOpacity>
        {(Object.keys(FONT_CATEGORY_LABELS) as (keyof typeof FONT_CATEGORY_LABELS)[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.fontChip, filter === cat && styles.fontChipActive]}
            activeOpacity={0.6}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.fontChipText, filter === cat && styles.fontChipTextActive]}>
              {FONT_CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.fontCards}>
        {families.map((family) => {
          const previewFamily = resolveFontFamily(family, false, false);
          const selected = current === family.id;
          return (
            <TouchableOpacity
              key={family.id}
              style={[
                styles.fontCard,
                { width: windowWidth > 500 ? '31%' : '48%' },
                selected && styles.fontCardActive,
              ]}
              activeOpacity={0.6}
              onPress={() => onSelect(family.id)}
            >
              <Text style={[styles.fontPreview, { fontFamily: previewFamily }]}>Ag</Text>
              <Text numberOfLines={1} style={styles.fontCardName}>
                {family.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const update = (evt: GestureResponderEvent) => {
    const w = trackWidthRef.current;
    if (w <= 0) return;
    const locationX = evt.nativeEvent.locationX;
    if (typeof locationX !== 'number' || !Number.isFinite(locationX)) return;
    const ratio = Math.max(0, Math.min(1, locationX / w));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(clamp(stepped));
  };

  const percent = ((clamp(value) - min) / (max - min)) * 100;

  return (
    <View style={styles.sliderRow}>
      <View
        style={styles.sliderTrack}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={update}
        onResponderMove={update}
        onResponderTerminationRequest={() => false}
        onLayout={(e) => {
          trackWidthRef.current = e.nativeEvent.layout.width;
          setTrackWidth(e.nativeEvent.layout.width);
        }}
      >
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View
          style={[
            styles.sliderThumb,
            {
              left: Math.max(
                0,
                Math.min(trackWidth - SLIDER_THUMB, (percent / 100) * trackWidth - SLIDER_THUMB / 2),
              ),
            },
          ]}
        />
      </View>
      <View style={styles.sliderMeta}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{formatValue(value)}</Text>
      </View>
    </View>
  );
}

function ToggleButton({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[styles.toggle, active && styles.toggleActive]}
      activeOpacity={0.6}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

function HighlightGlyph() {
  return (
    <View style={styles.highlightGlyph}>
      <Text style={[styles.toggleText, { fontSize: 15 }]}>A</Text>
      <View style={styles.highlightBar} />
    </View>
  );
}

function AlignGlyph({ type, active }: { type: TextAlign; active: boolean }) {
  const color = active ? colors.white : colors.text;
  const widths = [20, 14, 18, 12];
  let xs: number[] = [];
  if (type === 'center') xs = [2, 5, 3, 6];
  else if (type === 'right') xs = [2, 8, 4, 10];
  else xs = [2, 2, 2, 2];

  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      {widths.map((w, i) => (
        <Rect key={i} x={xs[i]} y={4 + i * 5} width={w} height={2.2} rx={1.1} fill={color} />
      ))}
    </Svg>
  );
}

function ColorSection({
  style,
  onChange,
}: {
  style: TextStyle;
  onChange: (updates: Partial<TextStyle>) => void;
}) {
  const [hexInput, setHexInput] = useState('');

  const applyHex = () => {
    let clean = hexInput.trim().replace(/^#/, '');
    if (clean.length === 3) {
      clean = clean
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return;
    onChange({ color: { type: 'solid', value: `#${clean.toUpperCase()}` } });
    setHexInput('');
  };

  const hexValid = /^#?[0-9A-Fa-f]{3,6}$/.test(hexInput);

  return (
    <View>
      <Text style={styles.colorGroupLabel}>Palette</Text>
      <ColorSwatches
        colors={PALETTE_COLORS.map((c) => c.value)}
        selectedSolid={style.color.type === 'solid' ? style.color.value : undefined}
        onSelect={(value) => onChange({ color: { type: 'solid', value } })}
      />

      <Text style={styles.colorGroupLabel}>Pastel</Text>
      <ColorSwatches
        colors={PASTEL_COLORS.map((c) => c.value)}
        selectedSolid={style.color.type === 'solid' ? style.color.value : undefined}
        onSelect={(value) => onChange({ color: { type: 'solid', value } })}
      />

      <Text style={styles.colorGroupLabel}>Dark</Text>
      <ColorSwatches
        colors={DARK_COLORS.map((c) => c.value)}
        selectedSolid={style.color.type === 'solid' ? style.color.value : undefined}
        onSelect={(value) => onChange({ color: { type: 'solid', value } })}
      />

      <Text style={styles.colorGroupLabel}>Gradients</Text>
      <View style={styles.swatchRow}>
        {GRADIENT_COLORS.map((g) => {
          const selected =
            style.color.type === 'gradient' && style.color.from === g.from && style.color.to === g.to;
          return (
            <TouchableOpacity
              key={g.label}
              style={[styles.swatchWrap, selected && styles.swatchWrapSelected]}
              activeOpacity={0.6}
              onPress={() => onChange({ color: { type: 'gradient', from: g.from, to: g.to } })}
            >
              <GradientSwatch from={g.from} to={g.to} />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.colorGroupLabel}>Custom</Text>
      <View style={styles.hexRow}>
        <TextInput
          style={styles.hexInput}
          value={hexInput}
          onChangeText={setHexInput}
          placeholder="#RRGGBB"
          placeholderTextColor={colors.textLight}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          onSubmitEditing={applyHex}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.hexButton, !hexValid && styles.hexButtonDisabled]}
          activeOpacity={0.6}
          disabled={!hexValid}
          onPress={applyHex}
        >
          <Text style={styles.hexButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ColorSwatches({
  colors: swatches,
  selectedSolid,
  onSelect,
}: {
  colors: string[];
  selectedSolid?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.swatchRow}>
      {swatches.map((value) => {
        const selected = selectedSolid === value;
        return (
          <TouchableOpacity
            key={value}
            style={[styles.swatchWrap, selected && styles.swatchWrapSelected]}
            activeOpacity={0.6}
            onPress={() => onSelect(value)}
          >
            <View style={[styles.swatchDot, { backgroundColor: value }]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function GradientSwatch({ from, to }: { from: string; to: string }) {
  const id = `g${from.replace('#', '')}${to.replace('#', '')}`;
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Defs>
        <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={from} />
          <Stop offset="100%" stopColor={to} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={30} height={30} rx={9} fill={`url(#${id})`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 16,
    zIndex: 999,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  scrollContent: { paddingBottom: 24 },
  title: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.text },
  doneText: { fontFamily: fonts.ui, fontSize: 13, color: colors.accent },

  section: { marginBottom: 18 },
  sectionLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    color: colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  fontChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  fontChip: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 12, backgroundColor: colors.base },
  fontChipActive: { backgroundColor: colors.accent },
  fontChipText: { fontFamily: fonts.uiSemiBold, fontSize: 10, color: colors.text },
  fontChipTextActive: { color: colors.white },
  fontCards: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fontCard: {
    borderWidth: 1,
    borderColor: 'rgba(74,74,74,0.12)',
    borderRadius: 12,
    backgroundColor: colors.base,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 2,
  },
  fontCardActive: {
    borderColor: colors.accent,
    backgroundColor: '#FFF7FA',
  },
  fontPreview: { fontSize: 26, color: colors.text },
  fontCardName: { fontFamily: fonts.ui, fontSize: 11, color: colors.textLight },

  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  presetPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: colors.base,
    borderWidth: 1,
    borderColor: 'rgba(74,74,74,0.1)',
  },
  presetPillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  presetText: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: colors.text },
  presetTextActive: { color: colors.white },

  sliderRow: { marginTop: 2 },
  sliderTrack: {
    height: SLIDER_THUMB,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  sliderThumb: {
    position: 'absolute',
    width: SLIDER_THUMB,
    height: SLIDER_THUMB,
    borderRadius: SLIDER_THUMB / 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sliderLabel: { fontFamily: fonts.ui, fontSize: 11, color: colors.textLight },
  sliderValue: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: colors.text },

  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  toggle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: colors.sage },
  toggleText: { fontFamily: fonts.uiSemiBold, fontSize: 16, color: colors.text },

  highlightGlyph: { alignItems: 'center', justifyContent: 'center', width: 24, height: 24 },
  highlightBar: {
    position: 'absolute',
    bottom: 3,
    left: 2,
    right: 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F7D154',
  },

  colorGroupLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 10,
    color: colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 6,
  },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  swatchWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    padding: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchWrapSelected: { borderColor: colors.sage },
  swatchDot: { width: '100%', height: '100%', borderRadius: 7 },

  hexRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(74,74,74,0.15)',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    fontFamily: fonts.uiSemiBold,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.base,
  },
  hexButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  hexButtonDisabled: { opacity: 0.4 },
  hexButtonText: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: colors.white },
});
