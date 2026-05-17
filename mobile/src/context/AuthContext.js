import { createContext, useContext } from 'react';

// Auth context so any screen can access user / trigger logout
export const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
