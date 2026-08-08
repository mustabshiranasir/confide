export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'none' | 'uppercase' | 'lowercase';
export type FontCategory =
  | 'serif'
  | 'sans'
  | 'handwritten'
  | 'cursive'
  | 'script'
  | 'typewriter'
  | 'modern'
  | 'minimalist'
  | 'decorative'
  | 'playful';

export interface SolidColor {
  type: 'solid';
  value: string;
}

export interface GradientColor {
  type: 'gradient';
  from: string;
  to: string;
}

export type TextColor = SolidColor | GradientColor;

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  highlight: boolean;
  textTransform: TextTransform;
  letterSpacing: number;
  color: TextColor;
  textAlign: TextAlign;
  lineHeight: number;
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'caveat',
  fontSize: 22,
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  highlight: false,
  textTransform: 'none',
  letterSpacing: 0,
  color: { type: 'solid', value: '#4A4A4A' },
  textAlign: 'left',
  lineHeight: 1.5,
};

export interface TextStyleRange {
  start: number;
  length: number;
  style: TextStyle;
}

export function mergeTextStyle(base: TextStyle, override: Partial<TextStyle>): TextStyle {
  return { ...base, ...override };
}

export function applyStyleToSelection(
  ranges: TextStyleRange[],
  start: number,
  length: number,
  updates: Partial<TextStyle>,
): TextStyleRange[] {
  if (length <= 0) return ranges;
  const end = start + length;
  const clipped: TextStyleRange[] = [];
  for (const r of ranges) {
    const rEnd = r.start + r.length;
    if (rEnd <= start || r.start >= end) {
      clipped.push(r);
      continue;
    }
    if (r.start < start) clipped.push({ ...r, length: start - r.start });
    if (rEnd > end) clipped.push({ ...r, start: end, length: rEnd - end });
  }
  const existing = ranges.find((r) => r.start === start && r.length === length);
  const merged = mergeTextStyle(existing ? existing.style : DEFAULT_TEXT_STYLE, updates);
  clipped.push({ start, length, style: merged });
  return clipped.sort((a, b) => a.start - b.start);
}

export function rebaseRanges(
  ranges: TextStyleRange[],
  oldText: string,
  newText: string,
): TextStyleRange[] {
  if (ranges.length === 0 || oldText === newText) return ranges;
  let commonPrefix = 0;
  while (
    commonPrefix < oldText.length &&
    commonPrefix < newText.length &&
    oldText[commonPrefix] === newText[commonPrefix]
  ) {
    commonPrefix += 1;
  }
  let commonSuffix = 0;
  while (
    commonSuffix < oldText.length - commonPrefix &&
    commonSuffix < newText.length - commonPrefix &&
    oldText[oldText.length - 1 - commonSuffix] === newText[newText.length - 1 - commonSuffix]
  ) {
    commonSuffix += 1;
  }
  const editStart = commonPrefix;
  const deleted = oldText.length - commonPrefix - commonSuffix;
  const delta = newText.length - oldText.length;

  const next: TextStyleRange[] = [];
  for (const r of ranges) {
    const end = r.start + r.length;
    if (end <= editStart) {
      next.push(r);
      continue;
    }
    if (r.start >= editStart + deleted) {
      next.push({ ...r, start: r.start + delta });
      continue;
    }
    const keepBefore = Math.max(0, editStart - r.start);
    const keepAfter = Math.max(0, end - (editStart + deleted));
    const newStart = r.start < editStart ? r.start : editStart + Math.max(0, delta);
    const newLen = keepBefore + keepAfter;
    if (newLen > 0) next.push({ ...r, start: newStart, length: newLen });
  }
  return next.sort((a, b) => a.start - b.start);
}

export function isGradientColor(color: TextColor): color is GradientColor {
  return color.type === 'gradient';
}

export function solidColorValue(color: TextColor): string {
  if (color.type === 'solid') return color.value;
  const from = hexToRgb(color.from);
  const to = hexToRgb(color.to);
  return `rgb(${Math.round((from.r + to.r) / 2)}, ${Math.round((from.g + to.g) / 2)}, ${Math.round(
    (from.b + to.b) / 2,
  )})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const int = parseInt(clean, 16);
  if (Number.isNaN(int) || clean.length !== 6) return { r: 74, g: 74, b: 74 };
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}
