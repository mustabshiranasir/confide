import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BookShelfScreen from '../screens/BookShelfScreen';
import JournalBookScreen from '../screens/JournalBookScreen';
import NewEntryScreen from '../screens/NewEntryScreen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export type RootStackParamList = {
  BookShelf: undefined;
  JournalBook: undefined;
  NewEntry: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BookShelf"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.base,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: fonts.handwritten,
          fontSize: 24,
        },
        cardStyle: {
          backgroundColor: colors.base,
        },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="BookShelf"
        component={BookShelfScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JournalBook"
        component={JournalBookScreen}
        options={{
          title: 'My Diary',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="NewEntry"
        component={NewEntryScreen}
        options={{
          title: 'New Entry',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
