import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export interface StickerToolbarProps {
  onDuplicate: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onOpacityDown: () => void;
  onOpacityUp: () => void;
  onWidthDown: () => void;
  onWidthUp: () => void;
  onHeightDown: () => void;
  onHeightUp: () => void;
  onDelete: () => void;
  onClose: () => void;
  opacity: number;
  widthScale: number;
  heightScale: number;
  canBringToFront: boolean;
  canSendToBack: boolean;
}

function ToolbarButton({
  label,
  onPress,
  disabled,
  danger,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonLabel, danger && styles.buttonLabelDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function StickerToolbar({
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onOpacityDown,
  onOpacityUp,
  onWidthDown,
  onWidthUp,
  onHeightDown,
  onHeightUp,
  onDelete,
  onClose,
  opacity,
  widthScale,
  heightScale,
  canBringToFront,
  canSendToBack,
}: StickerToolbarProps) {
  return (
    <View style={styles.container}>
      <ToolbarButton label="⧉ Dup" onPress={onDuplicate} />
      <ToolbarButton label="▲ Front" onPress={onBringToFront} disabled={!canBringToFront} />
      <ToolbarButton label="▼ Back" onPress={onSendToBack} disabled={!canSendToBack} />
      <ToolbarButton label="− Opacity" onPress={onOpacityDown} disabled={opacity <= 0.2} />
      <ToolbarButton label="+ Opacity" onPress={onOpacityUp} disabled={opacity >= 1} />
      <ToolbarButton label="↔ W−" onPress={onWidthDown} disabled={widthScale <= 0.4} />
      <ToolbarButton label="↔ W+" onPress={onWidthUp} disabled={widthScale >= 6} />
      <ToolbarButton label="↕ H−" onPress={onHeightDown} disabled={heightScale <= 0.4} />
      <ToolbarButton label="↕ H+" onPress={onHeightUp} disabled={heightScale >= 6} />
      <ToolbarButton label="✕ Delete" onPress={onDelete} danger />
      <ToolbarButton label="Done" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.base,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 12,
    color: colors.text,
  },
  buttonLabelDanger: {
    color: '#E0574F',
  },
});
