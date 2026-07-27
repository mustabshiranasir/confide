import React, { useState } from 'react';
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
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function NewEntryScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>{today}</Text>
          <View style={styles.dateUnderline} />
        </View>

        <View style={styles.editorCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Start writing..."
            placeholderTextColor="rgba(74, 74, 74, 0.3)"
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
            autoFocus
          />

          <View style={styles.tapeDecoration} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, !text.trim() && styles.saveButtonDisabled]}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            disabled={!text.trim()}
          >
            <Text style={[styles.saveButtonText, !text.trim() && styles.saveButtonTextDisabled]}>
              Save Entry
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    fontFamily: fonts.handwritten,
    fontSize: 24,
    color: colors.sage,
  },
  dateUnderline: {
    width: 120,
    height: 1,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  editorCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    minHeight: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  textInput: {
    fontFamily: fonts.handwritten,
    fontSize: 22,
    color: colors.text,
    lineHeight: 34,
    minHeight: 360,
  },
  tapeDecoration: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 50,
    height: 16,
    backgroundColor: 'rgba(243, 198, 211, 0.4)',
    borderRadius: 2,
    transform: [{ rotate: '-8deg' }],
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 15,
    color: colors.accent,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.sage,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(183, 196, 168, 0.3)',
  },
  saveButtonText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 15,
    color: colors.white,
  },
  saveButtonTextDisabled: {
    color: 'rgba(122, 122, 122, 0.5)',
  },
});
