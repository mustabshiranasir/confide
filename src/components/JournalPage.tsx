import React from 'react';
import { View, StyleSheet, ViewStyle, ImageBackground } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

export type PaperStyle =
  | 'custom'
  | 'white'
  | 'lined'
  | 'dots'
  | 'graph'
  | 'kraft'
  | 'vintage'
  | 'marble'
  | 'floral'
  | 'watercolor'
  | 'dark'
  | 'gradient'
  | 'fabric';

export const PAPER_STYLES: { key: PaperStyle; label: string }[] = [
  { key: 'custom', label: 'Custom' },
  { key: 'white', label: 'White' },
  { key: 'lined', label: 'Lined' },
  { key: 'dots', label: 'Dots' },
  { key: 'graph', label: 'Graph' },
  { key: 'kraft', label: 'Kraft' },
  { key: 'vintage', label: 'Vintage' },
  { key: 'marble', label: 'Marble' },
  { key: 'floral', label: 'Floral' },
  { key: 'watercolor', label: 'Watercolor' },
  { key: 'dark', label: 'Dark' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'fabric', label: 'Fabric' },
];

export function getPaperInk(style: PaperStyle): string {
  return style === 'dark' ? '#EFE7D6' : colors.text;
}

interface JournalPageProps {
  background?: PaperStyle;
  children?: React.ReactNode;
  style?: ViewStyle;
  contentPadding?: boolean;
}

const LINE_SPACING = 28;
const DOT_SPACING = 26;
const GRAPH_SPACING = 20;
const FABRIC_SPACING = 12;
const TORN_TEETH = 22;

const CUSTOM_BG = require('../../assets/backgrounds/custom.png');

function TornEdge({ dark = false }: { dark?: boolean }) {
  return (
    <View pointerEvents="none" style={styles.tornColumn}>
      {Array.from({ length: TORN_TEETH }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.tooth,
            dark && styles.toothDark,
            i % 2 === 0 ? styles.toothEven : styles.toothOdd,
          ]}
        />
      ))}
    </View>
  );
}

function GrainOverlay() {
  return (
    <View style={styles.grainLayer}>
      {GRAIN_DOTS.map((dot, i) => (
        <View
          key={i}
          style={[styles.grainDot, { top: dot.y, left: dot.x, opacity: dot.o, width: dot.s, height: dot.s }]}
        />
      ))}
    </View>
  );
}

function LinedBackground() {
  const lines = Math.ceil(400 / LINE_SPACING);
  return (
    <View style={styles.fillLayer}>
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={i}
          style={[styles.rulingLine, { top: 48 + i * LINE_SPACING }]}
        />
      ))}
      <View style={styles.leftMargin} />
    </View>
  );
}

function DotsBackground() {
  const rows = Math.ceil(400 / DOT_SPACING);
  const cols = Math.ceil(300 / DOT_SPACING);
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ y: 40 + r * DOT_SPACING, x: 26 + c * DOT_SPACING });
    }
  }
  return (
    <View style={styles.fillLayer}>
      {dots.map((d, i) => (
        <View key={i} style={[styles.dotPoint, { top: d.y, left: d.x }]} />
      ))}
    </View>
  );
}

function GraphBackground() {
  const rows = Math.ceil(400 / GRAPH_SPACING);
  const cols = Math.ceil(300 / GRAPH_SPACING);
  return (
    <View style={styles.fillLayer}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={`h${i}`} style={[styles.graphLineH, { top: 40 + i * GRAPH_SPACING }]} />
      ))}
      {Array.from({ length: cols }).map((_, i) => (
        <View key={`v${i}`} style={[styles.graphLineV, { left: 24 + i * GRAPH_SPACING }]} />
      ))}
    </View>
  );
}

function KraftBackground() {
  return (
    <View style={styles.kraftLayer}>
      {KRAFT_GRAIN.map((dot, i) => (
        <View
          key={i}
          style={[styles.kraftFiber, { top: dot.y, left: dot.x, transform: [{ rotate: dot.r + 'deg' }] }]}
        />
      ))}
    </View>
  );
}

function VintageBackground() {
  return (
    <View style={styles.fillLayer}>
      {VINTAGE_STAINS.map((s, i) => (
        <View
          key={i}
          style={[styles.vintageStain, { top: s.y, left: s.x, width: s.w, height: s.h }]}
        />
      ))}
      <View style={styles.vintageVignette} />
      <View style={styles.vintageBorder} />
    </View>
  );
}

function MarbleBackground() {
  return (
    <View style={styles.fillLayer}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        {MARBLE_VEINS.map((v, i) => (
          <Path
            key={i}
            d={v.d}
            stroke={v.c}
            strokeWidth={v.w}
            fill="none"
            opacity={v.o}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}

function FloralBackground() {
  return (
    <View style={styles.fillLayer}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        {FLOWERS.map((f, i) => (
          <G key={i} rotation={f.r} origin={`${f.x}, ${f.y}`} opacity={0.55}>
            {PETAL_ANGLES.map((a, j) => (
              <Circle
                key={j}
                cx={f.x + Math.cos(a) * f.s}
                cy={f.y + Math.sin(a) * f.s}
                r={f.s * 0.42}
                fill={f.c}
              />
            ))}
            <Circle cx={f.x} cy={f.y} r={f.s * 0.38} fill="#F7E7A6" />
          </G>
        ))}
      </Svg>
    </View>
  );
}

function WatercolorBackground() {
  return (
    <View style={styles.fillLayer}>
      {WATERCOLOR_BLOBS.map((b, i) => (
        <View
          key={i}
          style={[
            styles.waterBlob,
            {
              top: b.y,
              left: b.x,
              width: b.w,
              height: b.h,
              backgroundColor: b.c,
              transform: [{ rotate: `${b.r}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function GradientBackground() {
  const steps = 14;
  return (
    <View style={styles.fillLayer}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            backgroundColor: `rgba(222, 206, 178, ${((i + 1) / steps) * 0.45})`,
          }}
        />
      ))}
    </View>
  );
}

function FabricBackground() {
  const rows = Math.ceil(400 / FABRIC_SPACING);
  const cols = Math.ceil(300 / FABRIC_SPACING);
  return (
    <View style={styles.fillLayer}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={`h${i}`} style={[styles.fabricH, { top: 36 + i * FABRIC_SPACING }]} />
      ))}
      {Array.from({ length: cols }).map((_, i) => (
        <View key={`v${i}`} style={[styles.fabricV, { left: 24 + i * FABRIC_SPACING }]} />
      ))}
    </View>
  );
}

const GRAIN_DOTS = Array.from({ length: 40 }).map(() => ({
  y: Math.round(Math.random() * 520),
  x: Math.round(Math.random() * 280),
  o: 0.03 + Math.random() * 0.04,
  s: 2 + Math.round(Math.random() * 3),
}));

const KRAFT_GRAIN = Array.from({ length: 30 }).map(() => ({
  y: Math.round(Math.random() * 520),
  x: Math.round(Math.random() * 280),
  r: Math.round(Math.random() * 180),
}));

const VINTAGE_STAINS = [
  { y: 80, x: 40, w: 90, h: 70 },
  { y: 200, x: 200, w: 110, h: 80 },
  { y: 340, x: 90, w: 120, h: 90 },
];

const MARBLE_VEINS = [
  { d: 'M-20,60 C40,30 80,90 140,70 S240,110 360,60', c: 'rgba(120,120,130,0.14)', w: 1.6, o: 1 },
  { d: 'M-10,150 C60,120 100,180 170,150 S280,190 360,140', c: 'rgba(140,130,140,0.12)', w: 1.2, o: 1 },
  { d: 'M-30,260 C50,230 90,290 160,260 S270,300 370,250', c: 'rgba(120,120,130,0.14)', w: 1.6, o: 1 },
  { d: 'M-20,360 C60,330 100,390 180,360 S290,400 380,350', c: 'rgba(150,140,150,0.12)', w: 1.2, o: 1 },
  { d: 'M70,-20 C90,60 30,120 70,200 S50,320 80,480', c: 'rgba(130,120,130,0.1)', w: 1.2, o: 1 },
  { d: 'M220,-20 C200,80 260,140 220,240 S240,360 210,480', c: 'rgba(130,120,130,0.1)', w: 1.2, o: 1 },
];

const PETAL_ANGLES = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];

const FLOWERS = [
  { x: 38, y: 64, s: 15, c: '#F3B8C9', r: -12 },
  { x: 262, y: 118, s: 13, c: '#D9B3E8', r: 18 },
  { x: 176, y: 92, s: 11, c: '#F2CF7D', r: 40 },
  { x: 58, y: 168, s: 12, c: '#A9CBB7', r: -25 },
  { x: 232, y: 210, s: 16, c: '#F3B8C9', r: 8 },
  { x: 120, y: 258, s: 12, c: '#9FC3DE', r: 30 },
  { x: 268, y: 316, s: 13, c: '#E8C2A6', r: -15 },
  { x: 44, y: 340, s: 11, c: '#D9B3E8', r: 22 },
  { x: 152, y: 398, s: 14, c: '#A9CBB7', r: -30 },
  { x: 252, y: 428, s: 12, c: '#F2CF7D', r: 12 },
];

const WATERCOLOR_BLOBS = [
  { y: 30, x: 12, w: 200, h: 130, c: 'rgba(243,198,211,0.18)', r: -15 },
  { y: 120, x: 130, w: 170, h: 170, c: 'rgba(183,196,168,0.16)', r: 18 },
  { y: 260, x: -20, w: 210, h: 140, c: 'rgba(159,195,222,0.14)', r: -22 },
  { y: 360, x: 150, w: 190, h: 130, c: 'rgba(243,198,211,0.14)', r: 30 },
  { y: 420, x: 60, w: 160, h: 100, c: 'rgba(233,205,154,0.16)', r: -28 },
];

const PAPER_BG: Record<PaperStyle, string> = {
  custom: '#F3EDE4',
  white: colors.white,
  lined: colors.white,
  dots: '#FFFFFF',
  graph: '#F8F6F2',
  kraft: '#E8DCC8',
  vintage: '#F4EBD8',
  marble: '#FBFBF8',
  floral: '#FFFDF7',
  watercolor: '#FCF9F4',
  dark: '#2A2A31',
  gradient: '#F8F3E9',
  fabric: '#EFE7DA',
};

export default function JournalPage({
  background = 'custom',
  children,
  style,
  contentPadding = true,
}: JournalPageProps) {
  return (
    <View style={[styles.outerShadow, style]}>
      <View style={[styles.page, background === 'dark' && styles.pageDark]}>
        <View style={[styles.pageBackground, { backgroundColor: PAPER_BG[background] }]}>
          {background === 'custom' ? (
            <ImageBackground source={CUSTOM_BG} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <>
              {background === 'lined' && <LinedBackground />}
              {background === 'dots' && <DotsBackground />}
              {background === 'graph' && <GraphBackground />}
              {background === 'kraft' && <KraftBackground />}
              {background === 'vintage' && <VintageBackground />}
              {background === 'marble' && <MarbleBackground />}
              {background === 'floral' && <FloralBackground />}
              {background === 'watercolor' && <WatercolorBackground />}
              {background === 'gradient' && <GradientBackground />}
              {background === 'fabric' && <FabricBackground />}
            </>
          )}

          <GrainOverlay />
        </View>

        <TornEdge dark={background === 'dark'} />

        <View
          style={[
            styles.contentArea,
            contentPadding && styles.contentPadding,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  page: {
    aspectRatio: 3 / 4,
    backgroundColor: '#F3EDE4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pageDark: {
    backgroundColor: '#1E1E24',
  },

  pageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  tornColumn: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
    justifyContent: 'space-between',
    paddingVertical: 4,
    zIndex: 1,
  },
  tooth: {
    width: 8,
    height: 6,
    backgroundColor: '#F3EDE4',
  },
  toothDark: {
    backgroundColor: '#1E1E24',
  },
  toothEven: {
    borderBottomLeftRadius: 4,
  },
  toothOdd: {
    borderTopLeftRadius: 4,
  },

  fillLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  rulingLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(180, 195, 210, 0.25)',
  },
  leftMargin: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 36,
    width: 1,
    backgroundColor: 'rgba(243, 198, 211, 0.3)',
  },

  dotPoint: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(150, 165, 185, 0.35)',
  },

  graphLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(160, 180, 200, 0.22)',
  },
  graphLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(160, 180, 200, 0.22)',
  },

  kraftLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8DCC8',
  },
  kraftFiber: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: 'rgba(160, 140, 110, 0.15)',
    borderRadius: 1,
  },

  vintageStain: {
    position: 'absolute',
    backgroundColor: 'rgba(180, 150, 105, 0.08)',
    borderRadius: 999,
    transform: [{ rotate: '18deg' }],
  },
  vintageVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(120, 95, 55, 0.05)',
  },
  vintageBorder: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(160, 130, 90, 0.3)',
    borderRadius: 6,
  },

  waterBlob: {
    position: 'absolute',
    borderRadius: 999,
  },

  fabricH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(140, 120, 95, 0.1)',
  },
  fabricV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(140, 120, 95, 0.1)',
  },

  grainLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  grainDot: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#000',
  },

  contentArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentPadding: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingLeft: 44,
    paddingRight: 20,
  },
});
