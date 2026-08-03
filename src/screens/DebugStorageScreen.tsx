import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase, decryptString } from '../storage/journalStorage';

interface StorageRow {
  id: string;
  date: string;
  raw: string;
  decrypted: string;
}

const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
}) as string;

export default function DebugStorageScreen() {
  const [rows, setRows] = useState<StorageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    getDatabase()
      .then((db: SQLiteDatabase) =>
        db.getAllAsync<{ id: string; date: string; encrypted_payload: string }>(
          'SELECT id, date, encrypted_payload FROM entries',
        ),
      )
      .then((entries) =>
        Promise.all(
          entries.map(async (row) => ({
            id: row.id,
            date: row.date,
            raw: row.encrypted_payload,
            decrypted: await decryptString(row.encrypted_payload),
          })),
        ),
      )
      .then((next) => {
        if (!active) return;
        setRows(next.sort((a, b) => a.id.localeCompare(b.id)));
      })
      .catch((error) => console.error('[DebugStorage] load failed', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const renderRow = ({ item }: { item: StorageRow }) => (
    <View style={styles.row}>
      <Text style={styles.rowKey}>{item.id}</Text>
      <Text style={styles.rowDate}>{item.date}</Text>
      <View style={styles.col}>
        <Text style={styles.colLabel}>RAW (encrypted)</Text>
        <Text style={styles.mono} selectable>
          {item.raw.length > 0 ? item.raw : '(empty)'}
        </Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.colLabel}>DECRYPTED</Text>
        <Text style={styles.mono} selectable>
          {item.decrypted.length === 0 ? '(decrypt failed)' : item.decrypted}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>confide.db {'\u2014'} entries table</Text>
          <Text style={styles.summarySub}>
            {loading ? 'Loading...' : `${rows.length} row(s) total`}
          </Text>
          <Text style={styles.summarySub}>
            AES key lives in expo-secure-store (never in the database).
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          activeOpacity={0.7}
          onPress={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.loadingBox}>
          <Text style={styles.emptyText}>No entries in the database yet.</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={renderRow}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  summary: { flex: 1, paddingRight: 12 },
  summaryTitle: { fontFamily: fonts.uiSemiBold, fontSize: 14, color: colors.text },
  summarySub: { fontFamily: fonts.ui, fontSize: 11, color: colors.textLight, marginTop: 2 },
  refreshButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.accent,
    minWidth: 76,
    alignItems: 'center',
  },
  refreshText: { fontFamily: fonts.uiSemiBold, fontSize: 12, color: colors.text },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fonts.ui, fontSize: 13, color: colors.textLight },
  listContent: { padding: 12 },
  separator: { height: 10 },
  row: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  rowKey: { fontFamily: fonts.uiSemiBold, fontSize: 13, color: colors.text },
  rowDate: {
    fontFamily: fonts.ui,
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 8,
  },
  col: { marginTop: 6 },
  colLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 9,
    color: colors.sage,
    letterSpacing: 1,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: MONO,
    fontSize: 10,
    lineHeight: 15,
    color: colors.text,
  },
});
