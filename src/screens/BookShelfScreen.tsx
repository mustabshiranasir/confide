import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: { page: number };
  NewEntry: undefined;
};

const LEATHER_BASE = '#6B3A2A';
const LEATHER_LIGHT = '#7D4835';
const LEATHER_HIGHLIGHT = '#8B5E4B';
const SPINE_COLOR = '#5C3222';
const PAGE_EDGE = '#F5F0E8';
const PAGE_SHADOW = '#E0D8CC';

function BookCover() {
  return (
    <View style={styles.bookStack}>
      <View style={[styles.pageLayer, styles.pageLayer3]} />
      <View style={[styles.pageLayer, styles.pageLayer2]} />
      <View style={[styles.pageLayer, styles.pageLayer1]} />

      <View style={styles.cover}>
        <View style={styles.spine}>
          <View style={styles.spineLine} />
          <View style={[styles.spineLine, { marginTop: 4 }]} />
        </View>

        <View style={styles.coverFace}>
          <View style={styles.textureRow}>
            <View style={[styles.textureDot, { top: 18, left: 30 }]} />
            <View style={[styles.textureDot, { top: 42, left: 68 }]} />
            <View style={[styles.textureDot, { top: 15, left: 110 }]} />
            <View style={[styles.textureDot, { top: 55, left: 45 }]} />
            <View style={[styles.textureDot, { top: 30, left: 140 }]} />
            <View style={[styles.textureDot, { top: 65, left: 120 }]} />
            <View style={[styles.textureDot, { top: 80, left: 28 }]} />
            <View style={[styles.textureDot, { top: 95, left: 90 }]} />
            <View style={[styles.textureDot, { top: 110, left: 55 }]} />
            <View style={[styles.textureDot, { top: 130, left: 130 }]} />
            <View style={[styles.textureDot, { top: 148, left: 40 }]} />
            <View style={[styles.textureDot, { top: 165, left: 100 }]} />
            <View style={[styles.textureDot, { top: 185, left: 60 }]} />
            <View style={[styles.textureDot, { top: 200, left: 145 }]} />
            <View style={[styles.textureDot, { top: 220, left: 35 }]} />
            <View style={[styles.textureDot, { top: 240, left: 115 }]} />
          </View>

          <View style={styles.coverBorder} />

          <View style={styles.titleBlock}>
            <View style={styles.titleOrnamentTop} />
            <Text style={styles.coverTitle}>My Journal</Text>
            <View style={styles.titleDivider} />
            <Text style={styles.coverSubtitle}>a place for thoughts</Text>
            <View style={styles.titleOrnamentBottom} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function BookShelfScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.base} />

      <View style={styles.header}>
        <Text style={styles.brandTitle}>Confide</Text>
      </View>

      <View style={styles.shelfArea}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('JournalBook', { page: 0 })}
        >
          <BookCover />
        </TouchableOpacity>

        <Text style={styles.tapHint}>Tap to open</Text>
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('NewEntry')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const COVER_W = 240;
const COVER_H = 340;
const SPINE_W = 18;
const PAGE_OFFSET = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 12,
  },
  brandTitle: {
    fontFamily: fonts.handwritten,
    fontSize: 42,
    color: colors.text,
    letterSpacing: 1,
  },
  shelfArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapHint: {
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.textLight,
    marginTop: 20,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  bookStack: {
    width: COVER_W + SPINE_W + PAGE_OFFSET * 3 + 12,
    height: COVER_H + PAGE_OFFSET * 3 + 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageLayer: {
    position: 'absolute',
    width: COVER_W,
    height: COVER_H,
    backgroundColor: PAGE_EDGE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PAGE_SHADOW,
  },
  pageLayer1: {
    bottom: 0,
    right: 0,
    transform: [{ rotate: '0.6deg' }],
  },
  pageLayer2: {
    bottom: PAGE_OFFSET,
    right: PAGE_OFFSET,
    transform: [{ rotate: '0.3deg' }],
  },
  pageLayer3: {
    bottom: PAGE_OFFSET * 2,
    right: PAGE_OFFSET * 2,
  },

  cover: {
    position: 'absolute',
    bottom: PAGE_OFFSET * 2,
    right: PAGE_OFFSET * 2,
    flexDirection: 'row',
    width: COVER_W + SPINE_W,
    height: COVER_H,
  },

  spine: {
    width: SPINE_W,
    height: COVER_H,
    backgroundColor: SPINE_COLOR,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  spineLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 1,
  },

  coverFace: {
    flex: 1,
    backgroundColor: LEATHER_BASE,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },

  textureRow: {
    ...StyleSheet.absoluteFill,
  },
  textureDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LEATHER_LIGHT,
    opacity: 0.15,
  },

  coverBorder: {
    ...StyleSheet.absoluteFill,
    margin: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'solid',
  },

  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titleOrnamentTop: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
  },
  coverTitle: {
    fontFamily: fonts.handwritten,
    fontSize: 38,
    color: '#F0E4D4',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  titleDivider: {
    width: 60,
    height: 1,
    backgroundColor: LEATHER_HIGHLIGHT,
    marginVertical: 14,
    opacity: 0.6,
  },
  coverSubtitle: {
    fontFamily: fonts.ui,
    fontSize: 12,
    color: 'rgba(240,228,212,0.55)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  titleOrnamentBottom: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 24,
  },

  fab: {
    position: 'absolute',
    right: 28,
    bottom: 36,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.white,
    lineHeight: 30,
    fontWeight: '300',
  },
});
