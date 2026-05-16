import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { getToken, getUser, logout } from '../lib/api';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { colors } from '../theme';

const Stack = createStackNavigator();

// Auth context so any screen can access user / trigger logout
export const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const NAV_THEME = {
  dark: true,
  colors: {
    primary: '#fafafa',          // --primary
    background: '#0a0a0a',       // --background
    card: '#0a0a0a',             // --card
    text: '#fafafa',             // --foreground
    border: '#262626',           // --border
    notification: '#FF453A',     // --destructive
  },
};

export default function RootNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await getToken();
      if (token) {
        const savedUser = await getUser();
        setUser(savedUser);
      }
    } catch (e) {
      console.log('Auth check failed:', e);
    } finally {
      setLoading(false);
    }
  }

  const authContext = {
    user,
    signIn: (userData) => setUser(userData),
    signOut: async () => {
      await logout();
      setUser(null);
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={NAV_THEME}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="App" component={AppNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
