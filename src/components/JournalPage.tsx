import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

export type PaperStyle = 'lined' | 'kraft' | 'grid' | 'pastel';

interface JournalPageProps {
  background?: PaperStyle;
  children?: React.ReactNode;
  style?: ViewStyle;
  contentPadding?: boolean;
}

const LINE_SPACING = 28;
const GRID_SPACING = 24;
const TORN_TEETH = 22;

function TornEdge() {
  return (
    <View style={styles.tornColumn}>
      {Array.from({ length: TORN_TEETH }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.tooth,
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
    <View style={styles.linedLayer}>
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

function GridBackground() {
  const rows = Math.ceil(400 / GRID_SPACING);
  const cols = Math.ceil(300 / GRID_SPACING);
  return (
    <View style={styles.gridLayer}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={`h${i}`} style={[styles.gridLineH, { top: 40 + i * GRID_SPACING }]} />
      ))}
      {Array.from({ length: cols }).map((_, i) => (
        <View key={`v${i}`} style={[styles.gridLineV, { left: 24 + i * GRID_SPACING }]} />
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

function PastelBackground() {
  return (
    <View style={styles.pastelLayer}>
      <View style={styles.pastelWash1} />
      <View style={styles.pastelWash2} />
      <View style={styles.pastelWash3} />
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

const PAPER_BG: Record<PaperStyle, string> = {
  lined: colors.white,
  kraft: '#E8DCC8',
  grid: '#F8F6F2',
  pastel: '#FDE8EF',
};

export default function JournalPage({
  background = 'lined',
  children,
  style,
  contentPadding = true,
}: JournalPageProps) {
  return (
    <View style={[styles.outerShadow, style]}>
      <View style={styles.page}>
        <TornEdge />

        <View style={[styles.paperFace, { backgroundColor: PAPER_BG[background] }]}>
          {background === 'lined' && <LinedBackground />}
          {background === 'kraft' && <KraftBackground />}
          {background === 'grid' && <GridBackground />}
          {background === 'pastel' && <PastelBackground />}

          <GrainOverlay />

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
    flexDirection: 'row',
    aspectRatio: 3 / 4,
    backgroundColor: '#F3EDE4',
    borderRadius: 3,
    overflow: 'hidden',
  },

  tornColumn: {
    width: 8,
    backgroundColor: '#F3EDE4',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tooth: {
    width: 8,
    height: 6,
    backgroundColor: colors.white,
  },
  toothEven: {
    borderBottomLeftRadius: 4,
  },
  toothOdd: {
    borderTopLeftRadius: 4,
  },

  paperFace: {
    flex: 1,
    overflow: 'hidden',
  },

  linedLayer: {
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

  gridLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(160, 180, 200, 0.18)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(160, 180, 200, 0.18)',
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

  pastelLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FDE8EF',
  },
  pastelWash1: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 180,
    height: 120,
    backgroundColor: 'rgba(243, 198, 211, 0.2)',
    borderRadius: 999,
    transform: [{ rotate: '-15deg' }],
  },
  pastelWash2: {
    position: 'absolute',
    top: 120,
    right: 0,
    width: 140,
    height: 160,
    backgroundColor: 'rgba(183, 196, 168, 0.12)',
    borderRadius: 999,
    transform: [{ rotate: '20deg' }],
  },
  pastelWash3: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    width: 160,
    height: 100,
    backgroundColor: 'rgba(243, 198, 211, 0.15)',
    borderRadius: 999,
    transform: [{ rotate: '10deg' }],
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
    flex: 1,
    position: 'relative',
  },
  contentPadding: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingLeft: 44,
    paddingRight: 20,
  },
});
