# Confide — An Encrypted, Decorative Digital Journal

Confide is a cross-platform mobile journaling app built with React Native (Expo) that lets users write and store private diary entries entirely on-device, with all data encrypted at rest. Each entry renders as a physical diary page — complete with paper textures, a handwriting-style font, and page-turn navigation — while users decorate pages with draggable stickers, washi tape, and customizable backgrounds.

## Features (Current)

- **Stack Navigation** — Three-screen flow: BookShelf (home) → JournalBook (diary with page turning) → NewEntry (writing canvas)
- **Handwritten Aesthetic** — Caveat font for diary text, Inter for UI labels
- **Soft Color Palette** — Cream base (`#FBF6EE`), accent pink (`#F3C6D3`), muted sage (`#B7C4A8`)
- **Page-Turn Animation** — Fade transition between diary pages with sample entries
- **Decorative Details** — Washi tape strips, ruled date lines, book-spine shelf display

## Roadmap

- [ ] AES encryption for all journal entries (encrypted storage)
- [ ] On-device persistence with AsyncStorage / react-native-encrypted-storage
- [ ] Draggable stickers and washi tape decorations
- [ ] Customizable page backgrounds
- [ ] Biometric authentication
- [ ] Search and tag system

## Tech Stack

- React Native 0.85 + Expo SDK 56
- React Navigation (Stack Navigator)
- Expo Font + Google Fonts (Caveat, Inter)
- TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Open in Expo Go, Android emulator, or iOS simulator.

## Project Structure

```
App.tsx                            # Root: fonts + NavigationContainer
src/
  theme/
    colors.ts                      # Color palette constants
    fonts.ts                       # Font family name constants
  navigation/
    StackNavigator.tsx             # Stack with BookShelf, JournalBook, NewEntry
  screens/
    BookShelfScreen.tsx            # Home — shelf of journal books
    JournalBookScreen.tsx          # Open diary with page-turn navigation
    NewEntryScreen.tsx             # Blank page for writing
```

## License

MIT
