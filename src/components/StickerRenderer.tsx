import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  stickerId: string;
  size?: number;
}

export default function StickerRenderer({ stickerId, size }: Props) {
  const renderSticker = () => {
    switch (stickerId) {
      case 'vintage-rose': return <VintageRose />;
      case 'lavender-sprig': return <LavenderSprig />;
      case 'pressed-fern': return <PressedFern />;
      case 'daisy': return <Daisy />;
      case 'sunflower': return <Sunflower />;
      case 'botanical-leaf': return <BotanicalLeaf />;
      case 'lace-heart': return <LaceHeart />;
      case 'stitched-heart': return <StitchedHeart />;
      case 'painted-heart': return <PaintedHeart />;
      case 'double-heart': return <DoubleHeart />;
      case 'gingham-tape': return <GinghamTape />;
      case 'floral-tape': return <FloralTape />;
      case 'stripe-tape': return <StripeTape />;
      case 'polka-tape': return <PolkaTape />;
      case 'lace-tape': return <LaceTape />;
      case 'postage-stamp': return <PostageStamp />;
      case 'wax-seal': return <WaxSeal />;
      case 'postmark': return <Postmark />;
      case 'kraft-label': return <KraftLabel />;
      case 'coffee-cup': return <CoffeeCup />;
      case 'fountain-pen': return <FountainPen />;
      case 'camera': return <VintageCamera />;
      default: return <View style={[s.unknown, size ? { width: size, height: size } : undefined]} />;
    }
  };

  if (size) {
    return (
      <View style={{ width: size, height: size, overflow: 'hidden' }}>
        {renderSticker()}
      </View>
    );
  }
  return <>{renderSticker()}</>;
}

function VintageRose() {
  return (
    <View style={[s.vintageRoseOuter, s.shadow]}>
      <View style={s.vintageRoseBg} />
      <View style={s.roseStem} />
      <View style={s.roseLeafLeft} />
      <View style={s.roseLeafRight} />
      <View style={[s.rosePetal, { top: 10, left: 18, transform: [{ rotate: '-20deg' }] }]} />
      <View style={[s.rosePetal, { top: 10, left: 28, transform: [{ rotate: '20deg' }] }]} />
      <View style={[s.rosePetal, { top: 16, left: 14, transform: [{ rotate: '-40deg' }] }]} />
      <View style={[s.rosePetal, { top: 16, left: 32, transform: [{ rotate: '40deg' }] }]} />
      <View style={[s.rosePetal, { top: 6, left: 22 }]} />
      <View style={s.roseCenter} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function LavenderSprig() {
  return (
    <View style={[s.lavenderOuter, s.shadow]}>
      <View style={s.lavenderBg} />
      <View style={s.lavenderStem} />
      <View style={[s.lavBud, { top: 8 }]} />
      <View style={[s.lavBud, { top: 16 }]} />
      <View style={[s.lavBud, { top: 24 }]} />
      <View style={[s.lavBud, { top: 32 }]} />
      <View style={[s.lavBud, { top: 40 }]} />
      <View style={[s.lavBud, { top: 48 }]} />
      <View style={s.lavLeafLeft} />
      <View style={s.lavLeafRight} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function PressedFern() {
  return (
    <View style={[s.fernOuter, s.shadow]}>
      <View style={s.fernBg} />
      <View style={s.fernStem} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <View key={`fl${i}`} style={[s.fernLeaf, { top: 12 + i * 11, left: 14 - i * 0.5, transform: [{ rotate: '-30deg' }, { scaleX: 1 - i * 0.08 }] }]} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <View key={`fr${i}`} style={[s.fernLeaf, { top: 12 + i * 11, left: 30 + i * 0.5, transform: [{ rotate: '30deg' }, { scaleX: 1 - i * 0.08 }] }]} />
      ))}
      <View style={s.agedOverlay} />
    </View>
  );
}

function Daisy() {
  return (
    <View style={[s.daisyOuter, s.shadow]}>
      <View style={s.daisyBg} />
      <View style={s.daisyStem} />
      <View style={s.daisyLeafR} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <View key={`dp${deg}`} style={[s.daisyPetal, { transform: [{ rotate: `${deg}deg` }, { translateY: -16 }] }]} />
      ))}
      <View style={s.daisyCenter} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function Sunflower() {
  return (
    <View style={[s.sunflowerOuter, s.shadow]}>
      <View style={s.sunflowerBg} />
      <View style={s.sunflowerStem} />
      <View style={s.sunLeafR} />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <View key={`sp${deg}`} style={[s.sunPetal, { transform: [{ rotate: `${deg}deg` }, { translateY: -18 }] }]} />
      ))}
      <View style={s.sunCenter} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function BotanicalLeaf() {
  return (
    <View style={[s.leafOuter, s.shadow]}>
      <View style={s.leafBg} />
      <View style={s.leafMain} />
      <View style={s.leafVein1} />
      <View style={s.leafVein2} />
      <View style={s.leafVein3} />
      <View style={s.leafStem} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function LaceHeart() {
  return (
    <View style={[s.heartOuter, s.shadow]}>
      <View style={s.laceHeartBg} />
      <View style={s.laceHeartInner} />
      {Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * 360;
        return <View key={`sc${i}`} style={[s.scallop, { transform: [{ rotate: `${angle}deg` }, { translateY: -28 }] }]} />;
      })}
      <View style={s.agedOverlay} />
    </View>
  );
}

function StitchedHeart() {
  return (
    <View style={[s.heartOuter, s.shadow]}>
      <View style={s.stitchHeartBg} />
      <View style={s.stitchLine1} />
      <View style={s.stitchLine2} />
      <View style={s.stitchLine3} />
      <View style={s.stitchLine4} />
      <View style={s.stitchLine5} />
      <View style={s.stitchLine6} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function PaintedHeart() {
  return (
    <View style={[s.heartOuter, s.shadow]}>
      <View style={s.paintSplash1} />
      <View style={s.paintSplash2} />
      <View style={s.paintSplash3} />
      <View style={s.paintHeartCenter} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function DoubleHeart() {
  return (
    <View style={[s.doubleHeartOuter, s.shadow]}>
      <View style={s.dblHeartBg} />
      <View style={[s.dblHeart1, s.dblHeartShape]} />
      <View style={[s.dblHeart2, s.dblHeartShape]} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function GinghamTape() {
  return (
    <View style={[s.washiOuter, s.shadow]}>
      <View style={s.washiBgPink} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <View key={`gv${i}`} style={[s.ginghamV, { left: i * 11 }]} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <View key={`gh${i}`} style={[s.ginghamH, { top: i * 11 }]} />
      ))}
      <View style={s.tornLeft} />
      <View style={s.tornRight} />
    </View>
  );
}

function FloralTape() {
  return (
    <View style={[s.washiOuter, s.shadow]}>
      <View style={s.washiBgCream} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={`fl${i}`} style={[s.floralDot, { left: 12 + i * 22 }]}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <View key={`fp${deg}`} style={[s.floralPetal, { transform: [{ rotate: `${deg}deg` }, { translateY: -5 }] }]} />
          ))}
          <View style={s.floralCenter} />
        </View>
      ))}
      <View style={s.tornLeft} />
      <View style={s.tornRight} />
    </View>
  );
}

function StripeTape() {
  return (
    <View style={[s.washiOuter, s.shadow]}>
      <View style={s.washiBgSage} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => (
        <View key={`st${i}`} style={[s.diagStripe, { left: i * 10 - 20 }]} />
      ))}
      <View style={s.tornLeft} />
      <View style={s.tornRight} />
    </View>
  );
}

function PolkaTape() {
  return (
    <View style={[s.washiOuter, s.shadow]}>
      <View style={s.washiBgCream} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <View key={`pk${i}`} style={[s.polkaDot, { left: 8 + (i % 4) * 34, top: i < 4 ? 8 : i < 8 ? 20 : 32 }]} />
      ))}
      <View style={s.tornLeft} />
      <View style={s.tornRight} />
    </View>
  );
}

function LaceTape() {
  return (
    <View style={[s.washiOuter, s.shadow]}>
      <View style={s.washiBgLace} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => (
        <View key={`lc${i}`} style={[s.laceHole, { left: 4 + i * 8 }]} />
      ))}
      <View style={s.laceCenterLine} />
      <View style={s.tornLeft} />
      <View style={s.tornRight} />
    </View>
  );
}

function PostageStamp() {
  return (
    <View style={[s.stampOuter, s.shadow]}>
      <View style={s.stampBg} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <React.Fragment key={`sb${i}`}>
          <View style={[s.stampBumpH, { top: -2, left: 4 + i * 6.8 }]} />
          <View style={[s.stampBumpH, { bottom: -2, left: 4 + i * 6.8 }]} />
          <View style={[s.stampBumpV, { left: -2, top: 4 + i * 8.4 }]} />
          <View style={[s.stampBumpV, { right: -2, top: 4 + i * 8.4 }]} />
        </React.Fragment>
      ))}
      <View style={s.stampInnerFrame} />
      <View style={s.stampFlower}>
        {[0, 72, 144, 216, 288].map((deg) => (
          <View key={`sfp${deg}`} style={[s.stampPetal, { transform: [{ rotate: `${deg}deg` }, { translateY: -8 }] }]} />
        ))}
        <View style={s.stampFlowerCenter} />
      </View>
      <View style={s.stampValue}>5</View>
      <View style={s.stampText}>POSTAGE</View>
      <View style={s.agedOverlay} />
    </View>
  );
}

function WaxSeal() {
  return (
    <View style={[s.sealOuter, s.shadow]}>
      <View style={s.sealBg} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i / 12) * 360;
        return <View key={`se${i}`} style={[s.sealEdge, { transform: [{ rotate: `${angle}deg` }, { translateY: -26 }] }]} />;
      })}
      <View style={s.sealInnerRing} />
      <View style={s.sealHeart}>
        <View style={[s.sealHeartShape, { left: 8, top: 6, transform: [{ scale: 0.5 }] }]} />
      </View>
      <View style={s.agedOverlayLight} />
    </View>
  );
}

function Postmark() {
  return (
    <View style={[s.postmarkOuter, s.shadow]}>
      <View style={s.postmarkRing1} />
      <View style={s.postmarkRing2} />
      <View style={s.postmarkLine1} />
      <View style={s.postmarkLine2} />
      <View style={s.postmarkLine3} />
      <View style={s.postmarkDate}>JUL 27</View>
      <View style={s.postmarkCity}>NEW YORK</View>
      <View style={s.agedOverlay} />
    </View>
  );
}

function KraftLabel() {
  return (
    <View style={[s.kraftOuter, s.shadow]}>
      <View style={s.kraftBg} />
      <View style={s.kraftHole} />
      <View style={s.kraftString} />
      <View style={s.kraftText1}>NO.</View>
      <View style={s.kraftText2}>42</View>
      <View style={s.kraftText3}>confide</View>
      <View style={s.agedOverlay} />
    </View>
  );
}

function CoffeeCup() {
  return (
    <View style={[s.coffeeOuter, s.shadow]}>
      <View style={s.coffeeBg} />
      <View style={s.steam1} />
      <View style={s.steam2} />
      <View style={s.steam3} />
      <View style={s.cupBody} />
      <View style={s.cupRim} />
      <View style={s.cupHandle} />
      <View style={s.cupSaucer} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function FountainPen() {
  return (
    <View style={[s.penOuter, s.shadow]}>
      <View style={s.penBg} />
      <View style={s.penBody} />
      <View style={s.penGrip} />
      <View style={s.penNib} />
      <View style={s.penClip} />
      <View style={s.agedOverlay} />
    </View>
  );
}

function VintageCamera() {
  return (
    <View style={[s.cameraOuter, s.shadow]}>
      <View style={s.cameraBg} />
      <View style={s.cameraTop} />
      <View style={s.cameraBtn} />
      <View style={s.cameraLensOuter} />
      <View style={s.cameraLensInner} />
      <View style={s.cameraLensShine} />
      <View style={s.cameraFlash} />
      <View style={s.agedOverlay} />
    </View>
  );
}

const ABS_FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

const s = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  unknown: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#ddd' },
  agedOverlay: { ...ABS_FILL, backgroundColor: 'rgba(180,160,120,0.08)', borderRadius: 999 },
  agedOverlayLight: { ...ABS_FILL, backgroundColor: 'rgba(180,160,120,0.05)', borderRadius: 999 },

  vintageRoseOuter: { width: 80, height: 90, alignItems: 'center' },
  vintageRoseBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.6)', borderRadius: 40 },
  roseStem: { position: 'absolute', bottom: 8, left: 37, width: 3, height: 30, backgroundColor: '#6B8E5A', borderRadius: 1.5 },
  roseLeafLeft: { position: 'absolute', bottom: 28, left: 22, width: 14, height: 8, backgroundColor: '#8BAF7A', borderRadius: 999, transform: [{ rotate: '-35deg' }] },
  roseLeafRight: { position: 'absolute', bottom: 34, left: 42, width: 14, height: 8, backgroundColor: '#8BAF7A', borderRadius: 999, transform: [{ rotate: '35deg' }] },
  rosePetal: { position: 'absolute', width: 16, height: 14, backgroundColor: '#E8A0B0', borderRadius: 999 },
  roseCenter: { position: 'absolute', top: 20, left: 32, width: 12, height: 10, backgroundColor: '#D4788A', borderRadius: 999 },

  lavenderOuter: { width: 40, height: 100, alignItems: 'center' },
  lavenderBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 20 },
  lavenderStem: { position: 'absolute', bottom: 12, left: 18, width: 2, height: 55, backgroundColor: '#7A9E6A', borderRadius: 1 },
  lavBud: { position: 'absolute', left: 13, width: 12, height: 8, backgroundColor: '#B49AC8', borderRadius: 6 },
  lavLeafLeft: { position: 'absolute', bottom: 30, left: 6, width: 12, height: 5, backgroundColor: '#8BAF7A', borderRadius: 999, transform: [{ rotate: '-25deg' }] },
  lavLeafRight: { position: 'absolute', bottom: 36, left: 22, width: 12, height: 5, backgroundColor: '#8BAF7A', borderRadius: 999, transform: [{ rotate: '25deg' }] },

  fernOuter: { width: 70, height: 100, alignItems: 'center' },
  fernBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 8 },
  fernStem: { position: 'absolute', top: 8, left: 33, width: 2, height: 84, backgroundColor: '#5C8A4F', borderRadius: 1 },
  fernLeaf: { position: 'absolute', width: 18, height: 6, backgroundColor: '#7CAF6A', borderRadius: 999 },

  daisyOuter: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
  daisyBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 35 },
  daisyStem: { position: 'absolute', bottom: 4, left: 33, width: 2, height: 18, backgroundColor: '#6B8E5A', borderRadius: 1 },
  daisyLeafR: { position: 'absolute', bottom: 10, left: 38, width: 10, height: 5, backgroundColor: '#8BAF7A', borderRadius: 999, transform: [{ rotate: '30deg' }] },
  daisyPetal: { position: 'absolute', width: 10, height: 16, backgroundColor: '#F5F0E8', borderRadius: 999, top: 27, left: 30 },
  daisyCenter: { position: 'absolute', top: 25, left: 25, width: 20, height: 20, backgroundColor: '#E8C840', borderRadius: 10, zIndex: 2 },

  sunflowerOuter: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
  sunflowerBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 35 },
  sunflowerStem: { position: 'absolute', bottom: 4, left: 33, width: 2.5, height: 18, backgroundColor: '#5C7A4A', borderRadius: 1 },
  sunLeafR: { position: 'absolute', bottom: 8, left: 38, width: 12, height: 6, backgroundColor: '#7A9E5A', borderRadius: 999, transform: [{ rotate: '35deg' }] },
  sunPetal: { position: 'absolute', width: 8, height: 16, backgroundColor: '#E8A830', borderRadius: 999, top: 27, left: 31 },
  sunCenter: { position: 'absolute', top: 23, left: 23, width: 24, height: 24, backgroundColor: '#8B5E3C', borderRadius: 12, zIndex: 2 },

  leafOuter: { width: 60, height: 90, alignItems: 'center' },
  leafBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 8 },
  leafMain: { position: 'absolute', top: 6, left: 15, width: 30, height: 58, backgroundColor: '#7CAF6A', borderRadius: 999, transform: [{ rotate: '5deg' }] },
  leafVein1: { position: 'absolute', top: 10, left: 28, width: 1.5, height: 50, backgroundColor: '#5C8A4F', borderRadius: 1, transform: [{ rotate: '5deg' }] },
  leafVein2: { position: 'absolute', top: 18, left: 22, width: 12, height: 1, backgroundColor: '#5C8A4F', borderRadius: 1, transform: [{ rotate: '-15deg' }] },
  leafVein3: { position: 'absolute', top: 30, left: 24, width: 14, height: 1, backgroundColor: '#5C8A4F', borderRadius: 1, transform: [{ rotate: '-10deg' }] },
  leafStem: { position: 'absolute', bottom: 10, left: 28, width: 2, height: 22, backgroundColor: '#5C8A4F', borderRadius: 1 },

  heartOuter: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  laceHeartBg: { position: 'absolute', width: 64, height: 58, backgroundColor: '#F5E8EC', borderRadius: 32, top: 14, transform: [{ rotate: '45deg' }] },
  laceHeartInner: { position: 'absolute', width: 50, height: 45, backgroundColor: '#FADCE4', borderRadius: 25, top: 20, transform: [{ rotate: '45deg' }] },
  scallop: { position: 'absolute', width: 8, height: 8, backgroundColor: '#F5E8EC', borderRadius: 4, top: 40, left: 36 },

  stitchHeartBg: { position: 'absolute', width: 60, height: 54, backgroundColor: '#D4A0A8', borderRadius: 30, top: 16, transform: [{ rotate: '45deg' }] },
  stitchLine1: { position: 'absolute', top: 18, left: 14, width: 3, height: 3, backgroundColor: '#F5F0E8', borderRadius: 1.5 },
  stitchLine2: { position: 'absolute', top: 18, left: 22, width: 3, height: 3, backgroundColor: '#F5F0E8', borderRadius: 1.5 },
  stitchLine3: { position: 'absolute', top: 18, left: 30, width: 3, height: 3, backgroundColor: '#F5F0E8', borderRadius: 1.5 },
  stitchLine4: { position: 'absolute', top: 26, left: 14, width: 3, height: 3, backgroundColor: '#F5F0E8', borderRadius: 1.5 },
  stitchLine5: { position: 'absolute', top: 26, left: 22, width: 3, height: 3, backgroundColor: '#F5F0E8', borderRadius: 1.5 },
  stitchLine6: { position: 'absolute', top: 26, left: 30, width: 3, height: 3, backgroundColor: '#F5F0E8', borderRadius: 1.5 },

  paintSplash1: { position: 'absolute', width: 50, height: 44, backgroundColor: 'rgba(243,198,211,0.5)', borderRadius: 25, top: 16, left: 8, transform: [{ rotate: '45deg' }] },
  paintSplash2: { position: 'absolute', width: 40, height: 36, backgroundColor: 'rgba(183,196,168,0.4)', borderRadius: 20, top: 12, left: 18, transform: [{ rotate: '50deg' }] },
  paintSplash3: { position: 'absolute', width: 30, height: 26, backgroundColor: 'rgba(243,198,211,0.35)', borderRadius: 15, top: 20, left: 24, transform: [{ rotate: '40deg' }] },
  paintHeartCenter: { position: 'absolute', width: 36, height: 32, backgroundColor: '#E88A9E', borderRadius: 18, top: 24, left: 22, transform: [{ rotate: '45deg' }] },

  doubleHeartOuter: { width: 90, height: 70, alignItems: 'center', justifyContent: 'center' },
  dblHeartBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 8 },
  dblHeart1: { position: 'absolute', width: 40, height: 36, backgroundColor: '#E8A0B0', borderRadius: 20, top: 14, left: 12, transform: [{ rotate: '45deg' }] },
  dblHeart2: { position: 'absolute', width: 36, height: 32, backgroundColor: '#D4788A', borderRadius: 18, top: 18, left: 34, transform: [{ rotate: '45deg' }] },
  dblHeartShape: {},

  washiOuter: { width: 140, height: 44, overflow: 'hidden' },
  washiBgPink: { ...ABS_FILL, backgroundColor: 'rgba(243,198,211,0.45)' },
  washiBgCream: { ...ABS_FILL, backgroundColor: 'rgba(245,240,232,0.6)' },
  washiBgSage: { ...ABS_FILL, backgroundColor: 'rgba(183,196,168,0.4)' },
  washiBgLace: { ...ABS_FILL, backgroundColor: 'rgba(245,240,232,0.55)' },
  tornLeft: { position: 'absolute', top: 0, left: 0, width: 6, height: '100%', backgroundColor: 'rgba(251,246,238,0.7)' },
  tornRight: { position: 'absolute', top: 0, right: 0, width: 6, height: '100%', backgroundColor: 'rgba(251,246,238,0.7)' },
  ginghamV: { position: 'absolute', top: 0, width: 1, height: 44, backgroundColor: 'rgba(216,160,176,0.35)' },
  ginghamH: { position: 'absolute', left: 0, height: 1, width: 140, backgroundColor: 'rgba(216,160,176,0.35)' },
  floralDot: { position: 'absolute', top: 14 },
  floralPetal: { position: 'absolute', width: 5, height: 8, backgroundColor: '#D4788A', borderRadius: 999, left: 8 },
  floralCenter: { position: 'absolute', width: 5, height: 5, backgroundColor: '#E8C840', borderRadius: 2.5, left: 7, top: 1 },
  diagStripe: { position: 'absolute', top: -10, width: 4, height: 64, backgroundColor: 'rgba(255,255,255,0.45)', transform: [{ rotate: '25deg' }] },
  polkaDot: { position: 'absolute', width: 8, height: 8, backgroundColor: '#D4A0A8', borderRadius: 4 },
  laceHole: { position: 'absolute', top: 12, width: 5, height: 5, backgroundColor: 'rgba(251,246,238,0.7)', borderRadius: 2.5 },
  laceCenterLine: { position: 'absolute', top: 20, left: 0, width: 140, height: 1, backgroundColor: 'rgba(212,160,168,0.4)' },

  stampOuter: { width: 72, height: 88, overflow: 'hidden' },
  stampBg: { ...ABS_FILL, backgroundColor: '#F5F0E8' },
  stampBumpH: { position: 'absolute', width: 5, height: 3, backgroundColor: '#F5F0E8', borderRadius: 2 },
  stampBumpV: { position: 'absolute', width: 3, height: 5, backgroundColor: '#F5F0E8', borderRadius: 2 },
  stampInnerFrame: { position: 'absolute', top: 8, left: 8, right: 8, bottom: 18, borderWidth: 1, borderColor: 'rgba(74,74,74,0.15)', borderStyle: 'dotted' },
  stampFlower: { position: 'absolute', top: 18, left: 22 },
  stampPetal: { position: 'absolute', width: 7, height: 12, backgroundColor: '#D4788A', borderRadius: 999, left: 10 },
  stampFlowerCenter: { position: 'absolute', width: 8, height: 8, backgroundColor: '#E8C840', borderRadius: 4, left: 9, top: 4 },
  stampValue: { position: 'absolute', bottom: 4, right: 8, fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#7A7A7A' },
  stampText: { position: 'absolute', bottom: 4, left: 8, fontFamily: 'Inter-Regular', fontSize: 6, color: '#7A7A7A', letterSpacing: 1.5, textTransform: 'uppercase' },

  sealOuter: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center' },
  sealBg: { ...ABS_FILL, backgroundColor: '#C85A5A', borderRadius: 34 },
  sealEdge: { position: 'absolute', width: 10, height: 6, backgroundColor: '#B04848', borderRadius: 3, top: 34, left: 29 },
  sealInnerRing: { position: 'absolute', width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  sealHeart: { position: 'absolute', top: 22, left: 26 },
  sealHeartShape: { width: 16, height: 14, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 8, transform: [{ rotate: '45deg' }] },

  postmarkOuter: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  postmarkRing1: { position: 'absolute', width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: 'rgba(74,74,74,0.25)' },
  postmarkRing2: { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 0.5, borderColor: 'rgba(74,74,74,0.15)' },
  postmarkLine1: { position: 'absolute', top: 28, left: 6, width: 60, height: 1.5, backgroundColor: 'rgba(74,74,74,0.25)' },
  postmarkLine2: { position: 'absolute', top: 34, left: 6, width: 60, height: 1.5, backgroundColor: 'rgba(74,74,74,0.25)' },
  postmarkLine3: { position: 'absolute', top: 40, left: 6, width: 60, height: 1.5, backgroundColor: 'rgba(74,74,74,0.25)' },
  postmarkDate: { position: 'absolute', top: 16, fontFamily: 'Inter-SemiBold', fontSize: 9, color: 'rgba(74,74,74,0.5)', letterSpacing: 1 },
  postmarkCity: { position: 'absolute', top: 46, fontFamily: 'Inter-Regular', fontSize: 7, color: 'rgba(74,74,74,0.4)', letterSpacing: 1.5 },

  kraftOuter: { width: 90, height: 50 },
  kraftBg: { ...ABS_FILL, backgroundColor: '#C4A87C', borderRadius: 4 },
  kraftHole: { position: 'absolute', top: 6, left: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FBF6EE' },
  kraftString: { position: 'absolute', top: 2, left: 10, width: 1.5, height: 12, backgroundColor: '#8B7355', borderRadius: 1 },
  kraftText1: { position: 'absolute', top: 12, left: 24, fontFamily: 'Inter-SemiBold', fontSize: 8, color: '#5C4A2E', letterSpacing: 1 },
  kraftText2: { position: 'absolute', top: 8, left: 44, fontFamily: 'Inter-SemiBold', fontSize: 18, color: '#4A3A1E' },
  kraftText3: { position: 'absolute', bottom: 6, left: 24, fontFamily: 'Caveat-Regular', fontSize: 14, color: '#5C4A2E' },

  coffeeOuter: { width: 64, height: 72, alignItems: 'center' },
  coffeeBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 8 },
  steam1: { position: 'absolute', top: 4, left: 24, width: 3, height: 14, backgroundColor: 'rgba(74,74,74,0.08)', borderRadius: 1.5, transform: [{ rotate: '10deg' }] },
  steam2: { position: 'absolute', top: 2, left: 30, width: 3, height: 16, backgroundColor: 'rgba(74,74,74,0.06)', borderRadius: 1.5, transform: [{ rotate: '-5deg' }] },
  steam3: { position: 'absolute', top: 6, left: 36, width: 2.5, height: 12, backgroundColor: 'rgba(74,74,74,0.07)', borderRadius: 1.5, transform: [{ rotate: '8deg' }] },
  cupBody: { position: 'absolute', bottom: 14, left: 14, width: 30, height: 30, backgroundColor: '#F5F0E8', borderRadius: 4 },
  cupRim: { position: 'absolute', bottom: 42, left: 11, width: 36, height: 5, backgroundColor: '#E8E0D4', borderRadius: 2.5 },
  cupHandle: { position: 'absolute', bottom: 20, right: 10, width: 10, height: 16, borderWidth: 2.5, borderColor: '#E8E0D4', borderRadius: 5, borderLeftWidth: 0 },
  cupSaucer: { position: 'absolute', bottom: 10, left: 8, width: 44, height: 4, backgroundColor: '#E8E0D4', borderRadius: 2 },

  penOuter: { width: 36, height: 96, alignItems: 'center' },
  penBg: { ...ABS_FILL, backgroundColor: 'rgba(251,246,238,0.5)', borderRadius: 8 },
  penBody: { position: 'absolute', top: 6, left: 12, width: 12, height: 50, backgroundColor: '#3A3A3A', borderRadius: 2 },
  penGrip: { position: 'absolute', top: 54, left: 13, width: 10, height: 16, backgroundColor: '#C4A87C', borderRadius: 1 },
  penNib: { position: 'absolute', bottom: 12, left: 14, width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 14, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#C4A87C' },
  penClip: { position: 'absolute', top: 8, right: 10, width: 2, height: 22, backgroundColor: '#D4A040', borderRadius: 1 },

  cameraOuter: { width: 80, height: 60, alignItems: 'center' },
  cameraBg: { ...ABS_FILL, backgroundColor: '#3A3A3A', borderRadius: 8 },
  cameraTop: { position: 'absolute', top: -6, left: 28, width: 24, height: 10, backgroundColor: '#3A3A3A', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  cameraBtn: { position: 'absolute', top: -4, right: 16, width: 8, height: 5, backgroundColor: '#C85A5A', borderRadius: 2 },
  cameraLensOuter: { position: 'absolute', top: 14, left: 22, width: 28, height: 28, borderRadius: 14, backgroundColor: '#5A5A5A', borderWidth: 2, borderColor: '#6A6A6A' },
  cameraLensInner: { position: 'absolute', top: 18, left: 26, width: 20, height: 20, borderRadius: 10, backgroundColor: '#2A3A4A' },
  cameraLensShine: { position: 'absolute', top: 20, left: 30, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  cameraFlash: { position: 'absolute', top: 8, left: 10, width: 8, height: 6, backgroundColor: '#E8E0D4', borderRadius: 2 },
});
