import { FontCategory, TextStyle, TextStyleRange, solidColorValue } from '../types/textStyle';

export interface TextStyleSegment {
  text: string;
  style: TextStyle;
}

export function buildTextSegments(
  text: string,
  ranges: TextStyleRange[],
  baseStyle: TextStyle,
): TextStyleSegment[] {
  if (!text) return [];
  const sorted = [...ranges]
    .filter((r) => r.length > 0 && r.start >= 0)
    .sort((a, b) => a.start - b.start);
  const segments: TextStyleSegment[] = [];
  let cursor = 0;
  for (const range of sorted) {
    const start = range.start;
    const end = Math.min(range.start + range.length, text.length);
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), style: baseStyle });
    }
    if (end > cursor) {
      segments.push({ text: text.slice(Math.max(start, cursor), end), style: range.style });
    }
    cursor = Math.max(cursor, end);
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), style: baseStyle });
  }
  return segments;
}

export const DEFAULT_INK_COLOR = '#4A4A4A';

export interface FontVariantSet {
  regular: string;
  bold?: string;
  italic?: string;
  boldItalic?: string;
}

export interface FontFamilyInfo {
  id: string;
  name: string;
  category: FontCategory;
  variants: FontVariantSet;
  charRatio: number;
}

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  serif: 'Serif',
  sans: 'Sans-Serif',
  handwritten: 'Handwritten',
  cursive: 'Cursive',
  script: 'Script',
  typewriter: 'Typewriter',
  modern: 'Modern',
  minimalist: 'Minimalist',
  decorative: 'Decorative',
  playful: 'Playful',
};

export const FONT_FAMILIES: FontFamilyInfo[] = [
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'handwritten',
    variants: { regular: 'Caveat_400Regular', bold: 'Caveat_700Bold' },
    charRatio: 0.42,
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand',
    category: 'handwritten',
    variants: { regular: 'PatrickHand_400Regular' },
    charRatio: 0.5,
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower',
    category: 'handwritten',
    variants: { regular: 'IndieFlower_400Regular' },
    charRatio: 0.48,
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'serif',
    variants: {
      regular: 'PlayfairDisplay_400Regular',
      bold: 'PlayfairDisplay_700Bold',
      italic: 'PlayfairDisplay_400Regular_Italic',
      boldItalic: 'PlayfairDisplay_700Bold_Italic',
    },
    charRatio: 0.5,
  },
  {
    id: 'lora',
    name: 'Lora',
    category: 'serif',
    variants: {
      regular: 'Lora_400Regular',
      bold: 'Lora_700Bold',
      italic: 'Lora_400Regular_Italic',
      boldItalic: 'Lora_700Bold_Italic',
    },
    charRatio: 0.48,
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'sans',
    variants: { regular: 'Inter_400Regular', bold: 'Inter_700Bold' },
    charRatio: 0.5,
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'sans',
    variants: {
      regular: 'Montserrat_400Regular',
      bold: 'Montserrat_700Bold',
      italic: 'Montserrat_400Regular_Italic',
      boldItalic: 'Montserrat_700Bold_Italic',
    },
    charRatio: 0.55,
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'sans',
    variants: {
      regular: 'Poppins_400Regular',
      bold: 'Poppins_700Bold',
      italic: 'Poppins_400Regular_Italic',
      boldItalic: 'Poppins_700Bold_Italic',
    },
    charRatio: 0.53,
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    category: 'cursive',
    variants: { regular: 'Pacifico_400Regular' },
    charRatio: 0.55,
  },
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    category: 'cursive',
    variants: { regular: 'DancingScript_400Regular', bold: 'DancingScript_700Bold' },
    charRatio: 0.45,
  },
  {
    id: 'great-vibes',
    name: 'Great Vibes',
    category: 'script',
    variants: { regular: 'GreatVibes_400Regular' },
    charRatio: 0.48,
  },
  {
    id: 'special-elite',
    name: 'Special Elite',
    category: 'typewriter',
    variants: { regular: 'SpecialElite_400Regular' },
    charRatio: 0.58,
  },
  {
    id: 'courier-prime',
    name: 'Courier Prime',
    category: 'typewriter',
    variants: {
      regular: 'CourierPrime_400Regular',
      bold: 'CourierPrime_700Bold',
      italic: 'CourierPrime_400Regular_Italic',
      boldItalic: 'CourierPrime_700Bold_Italic',
    },
    charRatio: 0.6,
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    category: 'modern',
    variants: { regular: 'SpaceGrotesk_400Regular', bold: 'SpaceGrotesk_700Bold' },
    charRatio: 0.5,
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    category: 'minimalist',
    variants: {
      regular: 'WorkSans_400Regular',
      bold: 'WorkSans_700Bold',
      italic: 'WorkSans_400Regular_Italic',
      boldItalic: 'WorkSans_700Bold_Italic',
    },
    charRatio: 0.5,
  },
  {
    id: 'fredoka',
    name: 'Fredoka',
    category: 'decorative',
    variants: { regular: 'Fredoka_400Regular', bold: 'Fredoka_700Bold' },
    charRatio: 0.5,
  },
  {
    id: 'baloo-2',
    name: 'Baloo 2',
    category: 'decorative',
    variants: { regular: 'Baloo2_400Regular', bold: 'Baloo2_700Bold' },
    charRatio: 0.5,
  },
  {
    id: 'chewy',
    name: 'Chewy',
    category: 'playful',
    variants: { regular: 'Chewy_400Regular' },
    charRatio: 0.55,
  },
  {
    id: 'comic-neue',
    name: 'Comic Neue',
    category: 'playful',
    variants: {
      regular: 'ComicNeue_400Regular',
      bold: 'ComicNeue_700Bold',
      italic: 'ComicNeue_400Regular_Italic',
      boldItalic: 'ComicNeue_700Bold_Italic',
    },
    charRatio: 0.52,
  },
];

const FONT_MAP = new Map(FONT_FAMILIES.map((f) => [f.id, f]));

export function getFontFamily(id: string): FontFamilyInfo {
  return FONT_MAP.get(id) ?? FONT_FAMILIES[0];
}

export function resolveFontFamily(family: FontFamilyInfo, bold: boolean, italic: boolean): string {
  if (bold && italic && family.variants.boldItalic) return family.variants.boldItalic;
  if (bold && family.variants.bold) return family.variants.bold;
  if (italic && family.variants.italic) return family.variants.italic;
  return family.variants.regular;
}

export const FONT_SIZE_PRESETS = [
  { label: 'Small', size: 12 },
  { label: 'Medium', size: 16 },
  { label: 'Large', size: 22 },
  { label: 'Heading', size: 32 },
  { label: 'Title', size: 48 },
];

export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 72;
export const MIN_LINE_HEIGHT = 1;
export const MAX_LINE_HEIGHT = 3;
export const MAX_LETTER_SPACING = 8;

export interface ColorSwatch {
  value: string;
  label?: string;
}

export const PALETTE_COLORS: ColorSwatch[] = [
  { value: '#4A4A4A', label: 'Ink' },
  { value: '#111111', label: 'Black' },
  { value: '#1F2937', label: 'Slate' },
  { value: '#475569', label: 'Gray' },
  { value: '#7C3AED', label: 'Violet' },
  { value: '#9333EA', label: 'Purple' },
  { value: '#2563EB', label: 'Blue' },
  { value: '#0EA5E9', label: 'Sky' },
  { value: '#0891B2', label: 'Teal' },
  { value: '#059669', label: 'Green' },
  { value: '#65A30D', label: 'Lime' },
  { value: '#CA8A04', label: 'Amber' },
  { value: '#EA580C', label: 'Orange' },
  { value: '#DC2626', label: 'Red' },
  { value: '#DB2777', label: 'Pink' },
  { value: '#BE185D', label: 'Magenta' },
];

export const PASTEL_COLORS: ColorSwatch[] = [
  { value: '#B9C6D9', label: 'Soft Blue' },
  { value: '#BFDCE8', label: 'Baby Blue' },
  { value: '#B9D8C2', label: 'Sage' },
  { value: '#C9E4C5', label: 'Mint' },
  { value: '#F4C6C9', label: 'Blush' },
  { value: '#F7CFAB', label: 'Peach' },
  { value: '#F6DEA7', label: 'Butter' },
  { value: '#D6C4E6', label: 'Lavender' },
  { value: '#E7D3EC', label: 'Lilac' },
  { value: '#F3E3C7', label: 'Cream' },
  { value: '#D5CBC6', label: 'Taupe' },
  { value: '#CBD6C0', label: 'Pistachio' },
];

export const DARK_COLORS: ColorSwatch[] = [
  { value: '#1B1B1F', label: 'Carbon' },
  { value: '#2A2A2A', label: 'Graphite' },
  { value: '#2E2A33', label: 'Charcoal' },
  { value: '#3F3352', label: 'Plum' },
  { value: '#25314A', label: 'Navy' },
  { value: '#16324F', label: 'Marine' },
  { value: '#123B3A', label: 'Pine' },
  { value: '#1C3A2E', label: 'Forest' },
  { value: '#3A2E1C', label: 'Umber' },
  { value: '#3A2420', label: 'Cocoa' },
  { value: '#4A3B63', label: 'Grape' },
  { value: '#20303C', label: 'Midnight' },
];

export interface GradientSwatch {
  from: string;
  to: string;
  label: string;
}

export const GRADIENT_COLORS: GradientSwatch[] = [
  { from: '#FF9A8B', to: '#FF6A88', label: 'Sunset' },
  { from: '#F6D365', to: '#FDA085', label: 'Peach' },
  { from: '#F7971E', to: '#FFD200', label: 'Honey' },
  { from: '#4FACFE', to: '#00F2FE', label: 'Ocean' },
  { from: '#36D1DC', to: '#5B86E5', label: 'Sky' },
  { from: '#43E97B', to: '#38F9D7', label: 'Mint' },
  { from: '#667EEA', to: '#764BA2', label: 'Royal' },
  { from: '#8E2DE2', to: '#4A00E0', label: 'Berry' },
  { from: '#FF0844', to: '#FFB199', label: 'Cherry' },
  { from: '#2C3E50', to: '#4CA1AF', label: 'Slate' },
];

export function transformText(text: string, transform: TextStyle['textTransform']): string {
  if (transform === 'uppercase') return text.toUpperCase();
  if (transform === 'lowercase') return text.toLowerCase();
  return text;
}

export function wrapText(text: string, style: TextStyle, widthPx: number): string[] {
  const transformed = transformText(text, style.textTransform);
  const family = getFontFamily(style.fontFamily);
  const charsPerLine = Math.max(1, Math.floor(widthPx / (style.fontSize * family.charRatio)));
  const paragraphs = transformed.split('\n');
  const lines: string[] = [];
  for (const para of paragraphs) {
    const wrapped = wrapParagraph(para, charsPerLine);
    for (const line of wrapped) lines.push(line);
  }
  return lines;
}

function wrapParagraph(paragraph: string, charsPerLine: number): string[] {
  const result: string[] = [];
  const words = paragraph.split(/\s+/).filter(Boolean);
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= charsPerLine) {
      current += ' ' + word;
    } else {
      result.push(current);
      current = word;
    }
    if (current.length > charsPerLine) {
      while (current.length > charsPerLine) {
        result.push(current.slice(0, charsPerLine));
        current = current.slice(charsPerLine);
      }
    }
  }
  if (current) result.push(current);
  if (result.length === 0 && paragraph !== '') result.push(paragraph);
  return result;
}

export type TextDecorationLine = 'none' | 'underline' | 'line-through' | 'underline line-through';

export interface ResolvedTextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: TextStyle['textAlign'];
  textTransform: TextStyle['textTransform'];
  textDecorationLine: TextDecorationLine;
  color: string;
  backgroundColor?: string;
}

export function resolveTextStyle(style: TextStyle, fallbackColor?: string): ResolvedTextStyle {
  const family = getFontFamily(style.fontFamily);
  const fontFamily = resolveFontFamily(family, style.bold, style.italic);
  let color = solidColorValue(style.color);
  if (
    fallbackColor &&
    style.color.type === 'solid' &&
    style.color.value === DEFAULT_INK_COLOR
  ) {
    color = fallbackColor;
  }
  const hasUnderline = style.underline;
  const hasStrike = style.strikethrough;
  const decoration: TextDecorationLine =
    hasUnderline && hasStrike
      ? 'underline line-through'
      : hasUnderline
        ? 'underline'
        : hasStrike
          ? 'line-through'
          : 'none';
  return {
    fontFamily,
    fontSize: style.fontSize,
    lineHeight: Math.round(style.fontSize * style.lineHeight),
    letterSpacing: style.letterSpacing,
    textAlign: style.textAlign,
    textTransform: style.textTransform,
    textDecorationLine: decoration,
    color,
    backgroundColor: style.highlight ? 'rgba(255, 224, 130, 0.5)' : undefined,
  };
}
