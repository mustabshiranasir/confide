# Confide — An Encrypted, Decorative Digital Journal

Confide is a cross-platform mobile journaling app built with React Native (Expo) that lets users write and store private diary entries entirely on-device, with all data **encrypted at rest**. Each entry renders as a physical diary page — complete with paper textures, a handwriting-style font, and page-turn navigation — while users decorate pages with draggable stickers, washi tape, and customizable backgrounds.

## Features

### Navigation & Writing
- **Stack navigation** — BookShelf (home) → JournalBook (page-turn diary) → NewEntry (writing canvas), plus a hidden Storage Debug screen
- **Handwritten aesthetic** — Caveat font for diary text, Inter for UI labels
- **Page-turn animation** — 3D page-flip effect between diary pages
- **Decorative details** — washi tape strips, ruled date lines, book-spine shelf display

### Text Customization
- **Entry titles** — optional title field with its own heading placeholder and independent font styling
- **Per-chunk text styling** — the Font Panel applies styles only to the text you select (stored as styled ranges), so a single page can mix fonts, colors, and decorations; typing continues in the base style
- **19 font families** across 10 categories (serif, sans, handwritten, cursive, script, typewriter, modern, minimalist, decorative, playful)
- **Size presets + slider** — 8–72px
- **Style toggles** — bold, italic, underline, strikethrough, highlight, uppercase / lowercase
- **Letter spacing, line height & alignment** controls
- **Color picker** — palette, pastel, dark, gradient, and custom HEX
- **Live overlay preview** — styled chunks render behind the text input as you write
- **Gradient text rendering** — SVG-based gradient fill for whole-page gradient styles

### Sticker System
- **4 sticker packs** (~172 stickers): flowers, kawaii, stamps, and washi tape
- **Full sticker manipulation** on the writing canvas:
  - Drag / move, pinch-free resize, and rotation handles
  - Delete, duplicate
  - Layer ordering (bring to front / send to back)
  - Opacity control
  - Independent **width & height** scaling (ideal for long washi tape strips)
  - Undo / redo for every placement action
- **Favorites & recently used** stickers (persisted in AsyncStorage)
- **Washi pack auto-slicer** — raw sprite sheets (`newpack*.png`) are automatically segmented into individual trimmed tape stickers

### Journaling & Data
- **AES-256 encryption at rest** — every entry is JSON-serialized, encrypted with `crypto-js`, and stored as an `encrypted_payload` column in a local SQLite database (`confide.db`)
- **Secure key management** — a random 256-bit key is generated on first launch and stored via `expo-secure-store` (falls back to AsyncStorage on web where SecureStore is unavailable)
- **Efficient indexing** — the `entries` table acts as its own index (`SELECT id, date`), so the list can be shown without decrypting everything up front
- **Read / write / update / delete** — `saveEntry`, `getEntry`, `getAllEntries`, `updateEntry`, `deleteEntry`
- **Long-press to delete** any diary page (with confirmation)
- **Auto-refresh** — JournalBook reloads encrypted entries on every focus
- **One-time migration** — legacy AsyncStorage entries (`entry_<id>` + `entry_index`) are imported into SQLite on first run, guarded by a migration marker
- **13 page backgrounds** — custom, white, lined, dots, graph, kraft, vintage, marble, floral, watercolor, dark, gradient, fabric
- **On-device persistence** — every entry (including its title, per-chunk text style ranges, stickers, and background) is saved locally in encrypted form

### Hidden Debug Screen
- **Storage Debug** — long-press the book cover on the home screen
- Lists every SQLite row with its **raw encrypted string** and **decrypted value** side-by-side, so encryption can be visually verified (handy for reports/demos)

## Tech Stack

- React Native 0.85 + Expo SDK 56
- TypeScript
- React Navigation (Stack Navigator)
- Expo Font + Google Fonts (Caveat, Inter + 17 more font families for the text panel)
- `expo-sqlite` — on-device SQLite database
- `crypto-js` — AES encryption
- `expo-secure-store` — encryption key storage
- `react-native-reanimated` — page-turn & gesture animations
- `react-native-gesture-handler` — sticker drag / rotate gestures
- `react-native-svg` — decorative vector icons, backgrounds & gradient text

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Open in Expo Go, Android emulator, iOS simulator, or a browser (web support via Metro).

### Sticker pipeline scripts

```bash
# Regenerate the sticker catalog (stickers.json) + static asset requires
npm run stickers:sync

# Slice raw washi sprite sheets (newpack*.png) into individual stickers
npm run stickers:slice
```

## Storage & Encryption Model

| Location | Content |
| --- | --- |
| `confide.db` → `entries` table | Every diary entry with columns: `id` (TEXT PRIMARY KEY), `date`, `encrypted_payload` (AES-encrypted JSON of `{ id, date, text, title, titleStyle, background, decorations, textStyle, ranges }`), `created_at` |
| `confide.encryption.key.web` (AsyncStorage) | Web-only fallback for the AES key (native uses expo-secure-store) |
| `confide.migration.sqlite.v1` (AsyncStorage) | One-time marker that legacy `entry_<id>` / `entry_index` data has been migrated to SQLite |

The AES key is a random 256-bit value generated on first app launch, kept in expo-secure-store, cached in memory, and is **never** stored in the database. `initEncryptionKey()` is invoked once at startup (`App.tsx`).

## Project Structure

```
App.tsx                                 # Root: fonts + NavigationContainer + encryption key init
scripts/
  sync-stickers.mjs                     # Scans assets/stickers, updates catalog + asset requires
  slice-washi.mjs                       # Auto-slices washi sprite sheets into stickers
assets/stickers/
  flowers/ kawaii/ stamps/ washi/       # Sticker packs (washi/ also holds raw newpack*.png sheets)
  src/
    theme/
      colors.ts                           # Color palette constants
      fonts.ts                            # Font family name constants
      fontStyles.ts                       # Font catalog, palettes, style resolution, text wrapping/segments
    navigation/
      StackNavigator.tsx                  # BookShelf, JournalBook, NewEntry, DebugStorage
    screens/
      BookShelfScreen.tsx                 # Home — journal shelf, hidden debug entry point
      JournalBookScreen.tsx               # Page-turn diary, loads encrypted entries, long-press delete
      NewEntryScreen.tsx                  # Writing canvas (title + text + stickers + background + font panel)
      DebugStorageScreen.tsx              # Encrypted-vs-decrypted storage inspector
    components/
      JournalPage.tsx                     # Paper-style page rendering
      BackgroundPicker.tsx                # 13 background options
      FontPanel.tsx                       # Text customization sheet (fonts, size, style, color)
      GradientPageText.tsx                # SVG gradient text rendering
      StyledEntryText.tsx                 # Renders text with per-chunk style ranges
      Sticker/                            # Picker, canvas, item, toolbar, category components
    data/
      stickers.json                       # Sticker catalog (generated)
      stickerAssets.ts                    # Static require map (generated)
      stickers.ts                         # Category/source lookup
      stickerPrefs.ts                     # Favorites & recents
      journalStore.ts                     # Legacy plaintext store (superseded)
    storage/
      journalStorage.js                   # AES-encrypted SQLite CRUD + key management + legacy migration
    hooks/
      useStickerHistory.ts                # Undo/redo for sticker placements
    types/
      sticker.ts                          # PlacedSticker / Sticker types
      textStyle.ts                        # TextStyle model, style ranges, range merge/rebase helpers
```

## License

MIT
