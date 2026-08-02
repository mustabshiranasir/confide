import { useCallback, useState } from 'react';
import { PlacedSticker } from '../types/sticker';

interface HistoryState {
  past: PlacedSticker[][];
  present: PlacedSticker[];
  future: PlacedSticker[][];
}

const HISTORY_LIMIT = 50;

export function useStickerHistory(initial: PlacedSticker[] = []) {
  const [state, setState] = useState<HistoryState>({
    past: [],
    present: initial,
    future: [],
  });

  const setStickers = useCallback((updater: (prev: PlacedSticker[]) => PlacedSticker[]) => {
    setState((s) => {
      const next = updater(s.present);
      if (next === s.present) return s;
      return {
        past: [...s.past.slice(-(HISTORY_LIMIT - 1)), s.present],
        present: next,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        present: previous,
        future: [...s.future.slice(-(HISTORY_LIMIT - 1)), s.present],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[s.future.length - 1];
      return {
        past: [...s.past.slice(-(HISTORY_LIMIT - 1)), s.present],
        present: next,
        future: s.future.slice(0, -1),
      };
    });
  }, []);

  return {
    stickers: state.present,
    setStickers,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
