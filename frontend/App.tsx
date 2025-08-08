import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './screens/signup';
import Login from './screens/login';
import Home from './screens/home';
import Profile from './screens/profile';
import Reminders from './screens/reminders';
import Spendings from './screens/spendings';

SplashScreen.preventAutoHideAsync(); 

const Stack = createNativeStackNavigator();
const linking = {
  prefixes: ['/'], 
  config: {
    screens: {
      Home: 'home',
      SignUp: 'signup',
      Login: 'login',
      Profile: 'profile',
      Reminders: 'reminders',
    },
  },
};

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom font
        await Font.loadAsync({
          Baloo: require('./frontend/assets/fonts/BalooDa2-VariableFont_wght.ttf'),
        });

        // Optional splash delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return (
      <View style={styles.splash} onLayout={onLayoutRootView}>
        <Text style={styles.logo}>PAYBLE</Text>
        <Text style={styles.tag}>Simplifying your bills, one reminder at a time.</Text>
        {/* <LottieView
          source={require('./assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.loader}
        /> */}
      </View>
    );
  }
  console.log("App Ready:", appReady);
  return (
    <NavigationContainer linking = {linking}>
      <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Spendings" component={Spendings}/>
        <Stack.Screen name="Reminders" component={Reminders}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#6db181',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 60,
    fontFamily: 'Baloo',
    color: '#323c2bff',
    marginBottom: 10,
    fontWeight: 800,
  },
  tag: {
    fontSize: 16,
    fontFamily: 'Baloo',
    color: '#323c2bff',
    fontWeight: 500,
  },
  loader: {
    width: 25,
    height: 25,
    marginVertical: 20,
  },
});
