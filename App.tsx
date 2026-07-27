import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Caveat_400Regular } from '@expo-google-fonts/caveat';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Caveat-Regular': Caveat_400Regular,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

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
