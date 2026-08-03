import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

const DB_NAME = 'confide.db';
const LEGACY_ENTRY_PREFIX = 'entry_';
const LEGACY_INDEX_KEY = 'entry_index';
const MIGRATION_MARKER_KEY = 'confide.migration.sqlite.v1';
const SECURE_KEY_NAME = 'confide.encryption.key';
const WEB_KEY_NAME = 'confide.encryption.key.web';

let cachedKey = null;
let dbPromise = null;

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function migrateLegacyData(db) {
  try {
    const marker = await AsyncStorage.getItem(MIGRATION_MARKER_KEY);
    if (marker) return;
    const indexRaw = await AsyncStorage.getItem(LEGACY_INDEX_KEY);
    if (indexRaw) {
      const index = JSON.parse(indexRaw);
      if (Array.isArray(index)) {
        const createdAt = new Date().toISOString();
        for (const item of index) {
          const raw = await AsyncStorage.getItem(`${LEGACY_ENTRY_PREFIX}${item.id}`);
          if (raw && item.id && item.date) {
            await db.runAsync(
              'INSERT OR IGNORE INTO entries (id, date, encrypted_payload, created_at) VALUES (?, ?, ?, ?)',
              [item.id, item.date, raw, createdAt],
            );
          }
        }
      }
    }
    await AsyncStorage.setItem(MIGRATION_MARKER_KEY, 'true');
  } catch (error) {
    console.error('[journalStorage] migrateLegacyData failed', error);
  }
}

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS entries (
          id TEXT PRIMARY KEY NOT NULL,
          date TEXT NOT NULL,
          encrypted_payload TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
      await migrateLegacyData(db);
      return db;
    })();
  }
  return dbPromise;
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
    const db = await getDatabase();
    const key = await getKey();
    const encrypted = encrypt(JSON.stringify(entry), key);
    await db.runAsync(
      `INSERT INTO entries (id, date, encrypted_payload, created_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         date = excluded.date,
         encrypted_payload = excluded.encrypted_payload`,
      [entry.id, entry.date, encrypted, new Date().toISOString()],
    );
  } catch (error) {
    console.error('[journalStorage] saveEntry failed', entry && entry.id, error);
  }
}

export async function getEntry(id) {
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync(
      'SELECT encrypted_payload FROM entries WHERE id = ?',
      [id],
    );
    if (!row) return null;
    const key = await getKey();
    const plaintext = decrypt(row.encrypted_payload, key);
    if (!plaintext) return null;
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('[journalStorage] getEntry failed', id, error);
    return null;
  }
}

export async function getAllEntries() {
  try {
    const db = await getDatabase();
    const key = await getKey();
    const rows = await db.getAllAsync(
      'SELECT id, encrypted_payload FROM entries',
    );
    const entries = [];
    for (const row of rows) {
      try {
        const plaintext = decrypt(row.encrypted_payload, key);
        if (!plaintext) continue;
        entries.push(JSON.parse(plaintext));
      } catch (error) {
        console.error('[journalStorage] getAllEntries failed for', row.id, error);
      }
    }
    return sortByDateDesc(entries);
  } catch (error) {
    console.error('[journalStorage] getAllEntries failed', error);
    return [];
  }
}

export async function decryptString(ciphertext) {
  try {
    if (!ciphertext) return '';
    const key = await getKey();
    return decrypt(ciphertext, key);
  } catch (error) {
    console.error('[journalStorage] decryptString failed', error);
    return '';
  }
}

export async function updateEntry(id, updates) {
  try {
    const current = await getEntry(id);
    if (!current) return null;
    const merged = { ...current, ...updates, id };
    const db = await getDatabase();
    const key = await getKey();
    const encrypted = encrypt(JSON.stringify(merged), key);
    await db.runAsync(
      'UPDATE entries SET date = ?, encrypted_payload = ? WHERE id = ?',
      [merged.date, encrypted, id],
    );
    return merged;
  } catch (error) {
    console.error('[journalStorage] updateEntry failed', id, error);
    return null;
  }
}

export async function deleteEntry(id) {
  try {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM entries WHERE id = ?', [id]);
  } catch (error) {
    console.error('[journalStorage] deleteEntry failed', id, error);
  }
}
