import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: undefined;
  NewEntry: undefined;
};

const SAMPLE_ENTRIES = [
  {
    id: '1',
    date: 'July 27, 2026',
    text: 'Today was a beautiful day. I sat by the window and watched the rain, and it felt like the world was whispering secrets just for me...',
  },
  {
    id: '2',
    date: 'July 26, 2026',
    text: 'I started a new project today. The blank canvas excites me more than it should. There is something magical about beginnings.',
  },
  {
    id: '3',
    date: 'July 25, 2026',
    text: 'Spent the evening rearranging my bookshelf. Each book is a memory, a phase of life. I kept running into old friends on the shelves.',
  },
];

export default function JournalBookScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentPage, setCurrentPage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const entry = SAMPLE_ENTRIES[currentPage];

  const turnPage = (direction: 'next' | 'prev') => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      if (direction === 'next' && currentPage < SAMPLE_ENTRIES.length - 1) {
        setCurrentPage(currentPage + 1);
      } else if (direction === 'prev' && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderText}>
          Page {currentPage + 1} of {SAMPLE_ENTRIES.length}
        </Text>
      </View>

      <Animated.View style={[styles.diaryPage, { opacity: fadeAnim }]}>
        <View style={styles.pageRuling}>
          <View style={styles.dateLine}>
            <Text style={styles.dateText}>{entry.date}</Text>
          </View>
          <Text style={styles.entryText}>{entry.text}</Text>
        </View>

        <View style={styles.pageDecoration}>
          <View style={styles.tapeStrip} />
        </View>
      </Animated.View>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
          activeOpacity={0.7}
          onPress={() => turnPage('prev')}
          disabled={currentPage === 0}
        >
          <Text style={[styles.navButtonText, currentPage === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.newEntryPill}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('NewEntry')}
        >
          <Text style={styles.newEntryPillText}>+ New Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === SAMPLE_ENTRIES.length - 1 && styles.navButtonDisabled,
          ]}
          activeOpacity={0.7}
          onPress={() => turnPage('next')}
          disabled={currentPage === SAMPLE_ENTRIES.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPage === SAMPLE_ENTRIES.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  pageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pageHeaderText: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  diaryPage: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 28,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  pageRuling: {
    flex: 1,
  },
  dateLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    borderBottomStyle: 'solid',
    paddingBottom: 8,
    marginBottom: 16,
  },
  dateText: {
    fontFamily: fonts.handwritten,
    fontSize: 22,
    color: colors.sage,
  },
  entryText: {
    fontFamily: fonts.handwritten,
    fontSize: 24,
    color: colors.text,
    lineHeight: 36,
  },
  pageDecoration: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  tapeStrip: {
    width: 60,
    height: 18,
    backgroundColor: 'rgba(183, 196, 168, 0.4)',
    borderRadius: 2,
    transform: [{ rotate: '12deg' }],
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.sage,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(183, 196, 168, 0.3)',
  },
  navButtonText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
    color: colors.white,
  },
  navButtonTextDisabled: {
    color: 'rgba(122, 122, 122, 0.5)',
  },
  newEntryPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  newEntryPillText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
    color: colors.white,
  },
});
