import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

const ENTRY_PREFIX = 'entry_';
const INDEX_KEY = 'entry_index';
const SECURE_KEY_NAME = 'confide.encryption.key';
const WEB_KEY_NAME = 'confide.encryption.key.web';

let cachedKey = null;

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function upsertIndex(index, id, date) {
  return sortByDateDesc([...index.filter((item) => item.id !== id), { id, date }]);
}

async function readIndex() {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[journalStorage] readIndex failed', error);
    return [];
  }
}

async function writeIndex(index) {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

async function secureGet() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(WEB_KEY_NAME);
  }
  return SecureStore.getItemAsync(SECURE_KEY_NAME);
}

async function secureSet(value) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(WEB_KEY_NAME, value);
    return;
  }
  await SecureStore.setItemAsync(SECURE_KEY_NAME, value);
}

function encrypt(plaintext, key) {
  return CryptoJS.AES.encrypt(plaintext, key).toString();
}

function decrypt(ciphertext, key) {
  return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
}

async function getKey() {
  if (cachedKey) return cachedKey;
  const key = await initEncryptionKey();
  if (!key) throw new Error('journalStorage: encryption key unavailable');
  return key;
}

export async function initEncryptionKey() {
  try {
    if (cachedKey) return cachedKey;
    const existing = await secureGet();
    if (existing) {
      cachedKey = existing;
      return cachedKey;
    }
    const generated = CryptoJS.lib.WordArray.random(32).toString();
    await secureSet(generated);
    cachedKey = generated;
    return cachedKey;
  } catch (error) {
    console.error('[journalStorage] initEncryptionKey failed', error);
    return null;
  }
}

export async function saveEntry(entry) {
  try {
    const key = await getKey();
    const encrypted = encrypt(JSON.stringify(entry), key);
    await AsyncStorage.setItem(`${ENTRY_PREFIX}${entry.id}`, encrypted);
    const index = await readIndex();
    await writeIndex(upsertIndex(index, entry.id, entry.date));
  } catch (error) {
    console.error('[journalStorage] saveEntry failed', entry && entry.id, error);
  }
}

export async function getEntry(id) {
  try {
    const key = await getKey();
    const raw = await AsyncStorage.getItem(`${ENTRY_PREFIX}${id}`);
    if (!raw) return null;
    const plaintext = decrypt(raw, key);
    if (!plaintext) return null;
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('[journalStorage] getEntry failed', id, error);
    return null;
  }
}

export async function getAllEntries() {
  try {
    const index = await readIndex();
    const entries = await Promise.all(index.map((item) => getEntry(item.id)));
    return sortByDateDesc(entries.filter(Boolean));
  } catch (error) {
    console.error('[journalStorage] getAllEntries failed', error);
    return [];
  }
}

export async function updateEntry(id, updates) {
  try {
    const current = await getEntry(id);
    if (!current) return null;
    const merged = { ...current, ...updates, id };
    await saveEntry(merged);
    return merged;
  } catch (error) {
    console.error('[journalStorage] updateEntry failed', id, error);
    return null;
  }
}

export async function deleteEntry(id) {
  try {
    await AsyncStorage.removeItem(`${ENTRY_PREFIX}${id}`);
    const index = await readIndex();
    await writeIndex(index.filter((item) => item.id !== id));
  } catch (error) {
    console.error('[journalStorage] deleteEntry failed', id, error);
  }
}
