import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Baloo2_400Regular, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import {
  ComicNeue_400Regular,
  ComicNeue_400Regular_Italic,
  ComicNeue_700Bold,
  ComicNeue_700Bold_Italic,
} from '@expo-google-fonts/comic-neue';
import {
  CourierPrime_400Regular,
  CourierPrime_400Regular_Italic,
  CourierPrime_700Bold,
  CourierPrime_700Bold_Italic,
} from '@expo-google-fonts/courier-prime';
import { DancingScript_400Regular, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Fredoka_400Regular, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import {
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_700Bold,
  Lora_700Bold_Italic,
} from '@expo-google-fonts/lora';
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
} from '@expo-google-fonts/montserrat';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
} from '@expo-google-fonts/poppins';
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import {
  WorkSans_400Regular,
  WorkSans_400Regular_Italic,
  WorkSans_700Bold,
  WorkSans_700Bold_Italic,
} from '@expo-google-fonts/work-sans';
import StackNavigator from './src/navigation/StackNavigator';
import { initEncryptionKey } from './src/storage/journalStorage';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Caveat_400Regular': Caveat_400Regular,
    'Caveat_700Bold': Caveat_700Bold,
    'Inter_400Regular': Inter_400Regular,
    'Inter_600SemiBold': Inter_600SemiBold,
    'Inter_700Bold': Inter_700Bold,
    'Baloo2_400Regular': Baloo2_400Regular,
    'Baloo2_700Bold': Baloo2_700Bold,
    'Chewy_400Regular': Chewy_400Regular,
    'ComicNeue_400Regular': ComicNeue_400Regular,
    'ComicNeue_400Regular_Italic': ComicNeue_400Regular_Italic,
    'ComicNeue_700Bold': ComicNeue_700Bold,
    'ComicNeue_700Bold_Italic': ComicNeue_700Bold_Italic,
    'CourierPrime_400Regular': CourierPrime_400Regular,
    'CourierPrime_400Regular_Italic': CourierPrime_400Regular_Italic,
    'CourierPrime_700Bold': CourierPrime_700Bold,
    'CourierPrime_700Bold_Italic': CourierPrime_700Bold_Italic,
    'DancingScript_400Regular': DancingScript_400Regular,
    'DancingScript_700Bold': DancingScript_700Bold,
    'Fredoka_400Regular': Fredoka_400Regular,
    'Fredoka_700Bold': Fredoka_700Bold,
    'GreatVibes_400Regular': GreatVibes_400Regular,
    'IndieFlower_400Regular': IndieFlower_400Regular,
    'Lora_400Regular': Lora_400Regular,
    'Lora_400Regular_Italic': Lora_400Regular_Italic,
    'Lora_700Bold': Lora_700Bold,
    'Lora_700Bold_Italic': Lora_700Bold_Italic,
    'Montserrat_400Regular': Montserrat_400Regular,
    'Montserrat_400Regular_Italic': Montserrat_400Regular_Italic,
    'Montserrat_700Bold': Montserrat_700Bold,
    'Montserrat_700Bold_Italic': Montserrat_700Bold_Italic,
    'Pacifico_400Regular': Pacifico_400Regular,
    'PatrickHand_400Regular': PatrickHand_400Regular,
    'PlayfairDisplay_400Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay_400Regular_Italic': PlayfairDisplay_400Regular_Italic,
    'PlayfairDisplay_700Bold': PlayfairDisplay_700Bold,
    'PlayfairDisplay_700Bold_Italic': PlayfairDisplay_700Bold_Italic,
    'Poppins_400Regular': Poppins_400Regular,
    'Poppins_400Regular_Italic': Poppins_400Regular_Italic,
    'Poppins_700Bold': Poppins_700Bold,
    'Poppins_700Bold_Italic': Poppins_700Bold_Italic,
    'SpaceGrotesk_400Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk_700Bold': SpaceGrotesk_700Bold,
    'SpecialElite_400Regular': SpecialElite_400Regular,
    'WorkSans_400Regular': WorkSans_400Regular,
    'WorkSans_400Regular_Italic': WorkSans_400Regular_Italic,
    'WorkSans_700Bold': WorkSans_700Bold,
    'WorkSans_700Bold_Italic': WorkSans_700Bold_Italic,
  });

  useEffect(() => {
    initEncryptionKey();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
