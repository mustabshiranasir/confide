import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlacedSticker } from '../types/sticker';
import { PaperStyle } from '../components/JournalPage';

export interface StoredEntry {
  id: string;
  date: string;
  text: string;
  stickers?: PlacedSticker[];
  background?: PaperStyle;
}

const ENTRIES_KEY = '@confide/journal_entries';

export async function loadEntries(): Promise<StoredEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveEntry(entry: StoredEntry): Promise<void> {
  try {
    const current = await loadEntries();
    const without = current.filter((e) => e.id !== entry.id);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify([entry, ...without]));
  } catch {
    // ignore persistence failures
  }
}
