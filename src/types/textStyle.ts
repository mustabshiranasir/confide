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
