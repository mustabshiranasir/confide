import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { getStickerSource } from '../../data/stickers';
import { PlacedSticker } from '../../types/sticker';

export interface StickerItemProps {
  sticker: PlacedSticker;
  isActive: boolean;
  zIndex: number;
  onActivate: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PlacedSticker>) => void;
  onDelete: (id: string) => void;
}

const BASE_SIZE = 80;
const HANDLE_SIZE = 26;
const MIN_SCALE = 0.2;
const MAX_SCALE = 4;

function rotateOffset(
  offsetX: number,
  offsetY: number,
  rotation: number,
  scale: number,
) {
  'worklet';
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return {
    x: scale * (offsetX * cos - offsetY * sin),
    y: scale * (offsetX * sin + offsetY * cos),
  };
}

export default function StickerItem({
  sticker,
  isActive,
  zIndex,
  onActivate,
  onUpdate,
  onDelete,
}: StickerItemProps) {
  const source = getStickerSource(sticker.stickerId);

  const translateX = useSharedValue(sticker.x);
  const translateY = useSharedValue(sticker.y);
  const scale = useSharedValue(sticker.scale);
  const rotation = useSharedValue(sticker.rotation);

  const baseX = useSharedValue(0);
  const baseY = useSharedValue(0);
  const baseScale = useSharedValue(1);
  const baseRotation = useSharedValue(0);

  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const startHandleX = useSharedValue(0);
  const startHandleY = useSharedValue(0);
  const startDist = useSharedValue(1);
  const startAngle = useSharedValue(0);

  const notifyActivate = () => onActivate(sticker.id);

  const notifyMove = () => {
    onUpdate(sticker.id, { x: translateX.value, y: translateY.value });
  };

  const notifyScale = () => {
    onUpdate(sticker.id, { scale: scale.value });
  };

  const notifyRotation = () => {
    onUpdate(sticker.id, { rotation: rotation.value });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      'worklet';
      baseX.value = translateX.value;
      baseY.value = translateY.value;
      runOnJS(notifyActivate)();
    })
    .onUpdate((e) => {
      'worklet';
      translateX.value = baseX.value + e.translationX;
      translateY.value = baseY.value + e.translationY;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(notifyMove)();
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      'worklet';
      baseScale.value = scale.value;
      runOnJS(notifyActivate)();
    })
    .onUpdate((e) => {
      'worklet';
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, baseScale.value * e.scale));
    })
    .onEnd(() => {
      'worklet';
      runOnJS(notifyScale)();
    });

  const rotate = Gesture.Rotation()
    .onStart(() => {
      'worklet';
      baseRotation.value = rotation.value;
      runOnJS(notifyActivate)();
    })
    .onUpdate((e) => {
      'worklet';
      rotation.value = baseRotation.value + e.rotation;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(notifyRotation)();
    });

  const composed = Gesture.Simultaneous(
    pan.hitSlop(8),
    pinch.hitSlop(8),
    rotate.hitSlop(8),
  );

  const resize = Gesture.Pan()
    .onStart(() => {
      'worklet';
      baseScale.value = scale.value;
      baseRotation.value = rotation.value;
      baseX.value = translateX.value;
      baseY.value = translateY.value;
      centerX.value = translateX.value + BASE_SIZE / 2;
      centerY.value = translateY.value + BASE_SIZE / 2;
      const corner = rotateOffset(BASE_SIZE / 2, BASE_SIZE / 2, rotation.value, scale.value);
      startHandleX.value = centerX.value + corner.x;
      startHandleY.value = centerY.value + corner.y;
      const dx = startHandleX.value - centerX.value;
      const dy = startHandleY.value - centerY.value;
      startDist.value = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      runOnJS(notifyActivate)();
    })
    .onUpdate((e) => {
      'worklet';
      const fx = startHandleX.value + e.translationX;
      const fy = startHandleY.value + e.translationY;
      const dx = fx - centerX.value;
      const dy = fy - centerY.value;
      const dist = Math.sqrt(dx * dx + dy * dy);
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, (baseScale.value * dist) / startDist.value));
    })
    .onEnd(() => {
      'worklet';
      runOnJS(notifyScale)();
    });

  const rotateHandle = Gesture.Pan()
    .onStart(() => {
      'worklet';
      baseRotation.value = rotation.value;
      baseScale.value = scale.value;
      baseX.value = translateX.value;
      baseY.value = translateY.value;
      centerX.value = translateX.value + BASE_SIZE / 2;
      centerY.value = translateY.value + BASE_SIZE / 2;
      const top = rotateOffset(0, -BASE_SIZE / 2, rotation.value, scale.value);
      startHandleX.value = centerX.value + top.x;
      startHandleY.value = centerY.value + top.y;
      startAngle.value = Math.atan2(
        startHandleY.value - centerY.value,
        startHandleX.value - centerX.value,
      );
      runOnJS(notifyActivate)();
    })
    .onUpdate((e) => {
      'worklet';
      const fx = startHandleX.value + e.translationX;
      const fy = startHandleY.value + e.translationY;
      const angle = Math.atan2(fy - centerY.value, fx - centerX.value);
      rotation.value = baseRotation.value + (angle - startAngle.value);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(notifyRotation)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
    opacity: sticker.opacity,
  }));

  const resizeStyle = useAnimatedStyle(() => {
    const corner = rotateOffset(BASE_SIZE / 2, BASE_SIZE / 2, rotation.value, scale.value);
    return {
      left: translateX.value + BASE_SIZE / 2 + corner.x - HANDLE_SIZE / 2,
      top: translateY.value + BASE_SIZE / 2 + corner.y - HANDLE_SIZE / 2,
    };
  });

  const rotateHandleStyle = useAnimatedStyle(() => {
    const top = rotateOffset(0, -BASE_SIZE / 2, rotation.value, scale.value);
    return {
      left: translateX.value + BASE_SIZE / 2 + top.x - HANDLE_SIZE / 2,
      top: translateY.value + BASE_SIZE / 2 + top.y - HANDLE_SIZE / 2,
    };
  });

  if (!source) return null;

  return (
    <React.Fragment>
      <Animated.View
        style={[styles.container, { zIndex }, animatedStyle]}
        pointerEvents="box-none"
      >
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.inner, isActive && styles.innerActive]}>
            <Image source={source} style={styles.image} resizeMode="contain" />
          </Animated.View>
        </GestureDetector>

        {isActive && (
          <TouchableOpacity
            style={styles.deleteBadge}
            activeOpacity={0.7}
            onPress={() => onDelete(sticker.id)}
          >
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {isActive && (
        <GestureDetector gesture={resize}>
          <Animated.View style={[styles.handle, styles.resizeHandle, resizeStyle, { zIndex }]}>
            <Text style={styles.handleGlyph}>⤡</Text>
          </Animated.View>
        </GestureDetector>
      )}

      {isActive && (
        <GestureDetector gesture={rotateHandle}>
          <Animated.View style={[styles.handle, styles.rotateHandle, rotateHandleStyle, { zIndex }]}>
            <Text style={styles.handleGlyph}>↻</Text>
          </Animated.View>
        </GestureDetector>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  inner: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerActive: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E0574F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: colors.white,
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
    lineHeight: 16,
    marginTop: -1,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  resizeHandle: {
    borderColor: colors.sage,
  },
  rotateHandle: {
    borderColor: colors.accent,
  },
  handleGlyph: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 13,
    color: colors.text,
    lineHeight: 15,
  },
});
