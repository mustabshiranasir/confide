import React from 'react';
import { StyleProp, Text, TextStyle as RNTextStyle } from 'react-native';
import { DEFAULT_TEXT_STYLE, TextStyle, TextStyleRange } from '../types/textStyle';
import { buildTextSegments, resolveTextStyle } from '../theme/fontStyles';

interface StyledEntryTextProps {
  text: string;
  ranges?: TextStyleRange[];
  baseStyle?: TextStyle;
  fallbackColor?: string;
  style?: StyleProp<RNTextStyle>;
  numberOfLines?: number;
}

export default function StyledEntryText({
  text,
  ranges = [],
  baseStyle = DEFAULT_TEXT_STYLE,
  fallbackColor,
  style,
  numberOfLines,
}: StyledEntryTextProps) {
  const segments = buildTextSegments(text, ranges, baseStyle);
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {segments.map((segment, index) => (
        <Text key={index} style={resolveTextStyle(segment.style, fallbackColor)}>
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}
