import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
}
