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
  JournalBook: undefined;
  NewEntry: undefined;
};

export default function BookShelfScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.base} />

      <View style={styles.header}>
        <Text style={styles.title}>Confide</Text>
        <Text style={styles.subtitle}>your private journal</Text>
      </View>

      <View style={styles.shelfArea}>
        <View style={styles.bookRow}>
          <TouchableOpacity
            style={styles.book}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('JournalBook')}
          >
            <View style={[styles.bookCover, { backgroundColor: colors.accent }]}>
              <Text style={styles.bookLabel}>Diary</Text>
              <Text style={styles.bookSubLabel}>My thoughts</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.book, { opacity: 0.4 }]}>
            <View style={[styles.bookCover, { backgroundColor: colors.sage }]}>
              <Text style={styles.bookLabel}>Travel</Text>
              <Text style={styles.bookSubLabel}>Coming soon</Text>
            </View>
          </View>

          <View style={[styles.book, { opacity: 0.4 }]}>
            <View style={[styles.bookCover, { backgroundColor: '#D4C5A9' }]}>
              <Text style={styles.bookLabel}>Dreams</Text>
              <Text style={styles.bookSubLabel}>Coming soon</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.newEntryButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('NewEntry')}
      >
        <Text style={styles.newEntryButtonText}>+ New Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: fonts.handwritten,
    fontSize: 48,
    color: colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  shelfArea: {
    flex: 1,
    justifyContent: 'center',
  },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  book: {
    width: 110,
    height: 160,
  },
  bookCover: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  bookLabel: {
    fontFamily: fonts.handwritten,
    fontSize: 20,
    color: colors.white,
  },
  bookSubLabel: {
    fontFamily: fonts.ui,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  newEntryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newEntryButtonText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
