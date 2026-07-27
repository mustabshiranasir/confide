import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { PlacedSticker } from '../types/sticker';
import StickerRenderer from './StickerRenderer';
import { getStickerDef } from '../data/stickers';

interface DraggableStickerProps {
  sticker: PlacedSticker;
  onUpdate: (id: string, updates: Partial<PlacedSticker>) => void;
  onDelete: (id: string) => void;
  isActive: boolean;
  onActivate: (id: string) => void;
}

export default function DraggableSticker({ sticker, onUpdate, onDelete, isActive, onActivate }: DraggableStickerProps) {
  const translateX = useSharedValue(sticker.x);
  const translateY = useSharedValue(sticker.y);
  const scale = useSharedValue(sticker.scale);
  const rotation = useSharedValue(sticker.rotation);
  const zIndex = useSharedValue(1);

  const savedTranslateX = useSharedValue(sticker.x);
  const savedTranslateY = useSharedValue(sticker.y);
  const savedScale = useSharedValue(sticker.scale);
  const savedRotation = useSharedValue(sticker.rotation);

  const def = getStickerDef(sticker.stickerId);
  const stickerW = def?.width ?? 80;
  const stickerH = def?.height ?? 80;

  const handleUpdate = () => {
    onUpdate(sticker.id, {
      x: translateX.value, y: translateY.value,
      scale: scale.value, rotation: rotation.value,
    });
  };

  const handleDelete = () => { onDelete(sticker.id); };

  const panGesture = Gesture.Pan()
    .onStart(() => { zIndex.value = 100; runOnJS(onActivate)(sticker.id); })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      zIndex.value = 1;
      runOnJS(handleUpdate)();
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => { zIndex.value = 100; runOnJS(onActivate)(sticker.id); })
    .onUpdate((e) => { scale.value = savedScale.value * e.scale; })
    .onEnd(() => { savedScale.value = scale.value; zIndex.value = 1; runOnJS(handleUpdate)(); });

  const rotationGesture = Gesture.Rotation()
    .onStart(() => { zIndex.value = 100; runOnJS(onActivate)(sticker.id); })
    .onUpdate((e) => { rotation.value = savedRotation.value + e.rotation; })
    .onEnd(() => { savedRotation.value = rotation.value; zIndex.value = 1; runOnJS(handleUpdate)(); });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture, rotationGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
    zIndex: zIndex.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={composed}>
        <View style={[styles.stickerFrame, { width: stickerW + 8, height: stickerH + 8 }]}>
          <StickerRenderer stickerId={sticker.stickerId} />
        </View>
      </GestureDetector>

      {isActive && (
        <>
          <View style={styles.selectionRing} />
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7} onPress={handleDelete}>
            <Text style={styles.deleteX}>x</Text>
          </TouchableOpacity>
          <View style={styles.rotateHandle}><View style={styles.handleDot} /></View>
          <View style={styles.scaleHandle}><View style={styles.handleDot} /></View>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, top: 0 },
  stickerFrame: { alignItems: 'center', justifyContent: 'center' },
  selectionRing: {
    position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
    borderWidth: 1.5, borderColor: 'rgba(243,198,211,0.7)', borderStyle: 'dashed', borderRadius: 8,
  },
  deleteBtn: {
    position: 'absolute', top: -10, left: -10, width: 20, height: 20,
    borderRadius: 10, backgroundColor: '#C85A5A', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3,
  },
  deleteX: { color: '#fff', fontSize: 12, fontFamily: 'Inter-SemiBold', lineHeight: 14 },
  rotateHandle: { position: 'absolute', top: -14, right: -14, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  scaleHandle: { position: 'absolute', bottom: -14, right: -14, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  handleDot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#F3C6D3',
    borderWidth: 1.5, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
});
