import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@confide/sticker_favorites';
const RECENTS_KEY = '@confide/sticker_recents';
const RECENTS_LIMIT = 24;

async function readIds(key: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function writeIds(key: string, ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // ignore persistence failures
  }
}

export async function getFavoriteIds(): Promise<string[]> {
  return readIds(FAVORITES_KEY);
}

export async function toggleFavorite(stickerId: string): Promise<string[]> {
  const current = await readIds(FAVORITES_KEY);
  const next = current.includes(stickerId)
    ? current.filter((id) => id !== stickerId)
    : [...current, stickerId];
  await writeIds(FAVORITES_KEY, next);
  return next;
}

export async function getRecentIds(): Promise<string[]> {
  return readIds(RECENTS_KEY);
}

export async function recordStickerUse(stickerId: string): Promise<string[]> {
  const current = await readIds(RECENTS_KEY);
  const next = [stickerId, ...current.filter((id) => id !== stickerId)].slice(0, RECENTS_LIMIT);
  await writeIds(RECENTS_KEY, next);
  return next;
}
