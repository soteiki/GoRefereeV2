/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Welcome from './src/modules/welcome/Welcome';
import MainTab from './src/modules/mainTab/MainTab';
import LoginRegister from './src/modules/LoginAndRegister/LoginRegister';
import Judge from './src/modules/judge/Judge';


const Stack = createStackNavigator();


const App = () => {

  console.error = () => { };
  console.warn = () => { };

  return (
    <SafeAreaProvider style={{ width: '100%', height: '100%' }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'white'}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Welcome'
          screenOptions={{
            cardStyle: { elevation: 1, }
          }}
        >
          <Stack.Screen
            name='Welcome'
            component={Welcome}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name='LoginRegister'
            component={LoginRegister}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name='Judge'
            component={Judge}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
          <Stack.Screen
            name='MainTab'
            component={MainTab}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({

});

export default App;
