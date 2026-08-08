import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { TextStyle } from '../types/textStyle';
import {
  getFontFamily,
  resolveFontFamily,
  wrapText,
} from '../theme/fontStyles';

interface GradientPageTextProps {
  text: string;
  style: TextStyle;
  width: number;
}

const HIGHLIGHT_FILL = 'rgba(255, 224, 130, 0.5)';

export default function GradientPageText({ text, style, width }: GradientPageTextProps) {
  const family = getFontFamily(style.fontFamily);
  const fontFamily = resolveFontFamily(family, style.bold, style.italic);
  const lines = wrapText(text, style, width);
  const lineHeight = style.fontSize * style.lineHeight;
  const baseline = style.fontSize * 0.82;

  const rawId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `grad${rawId}`;

  const textAnchor =
    style.textAlign === 'center' ? 'middle' : style.textAlign === 'right' ? 'end' : 'start';
  const x = style.textAlign === 'center' ? width / 2 : style.textAlign === 'right' ? width : 0;

  const decoration =
    style.underline ? 'underline' : style.strikethrough ? 'line-through' : 'none';

  return (
    <View pointerEvents="none">
      <Svg width={width} height={lines.length * lineHeight}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={style.color.type === 'gradient' ? style.color.from : '#4A4A4A'} />
            <Stop offset="100%" stopColor={style.color.type === 'gradient' ? style.color.to : '#4A4A4A'} />
          </LinearGradient>
        </Defs>

        {lines.map((line, i) => {
          const y = i * lineHeight + baseline;
          return (
            <React.Fragment key={i}>
              {style.highlight ? (
                <Rect x={0} y={i * lineHeight} width={width} height={lineHeight} rx={2} fill={HIGHLIGHT_FILL} />
              ) : null}
              <SvgText
                x={x}
                y={y}
                textAnchor={textAnchor}
                fontFamily={fontFamily}
                fontSize={style.fontSize}
                letterSpacing={style.letterSpacing}
                textDecoration={decoration}
                fill={`url(#${gradientId})`}
              >
                {line}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
