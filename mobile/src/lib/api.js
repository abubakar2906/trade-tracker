import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Auto-detect the dev machine IP from Expo's debugger host.
// This makes it work on both physical devices and simulators.
function getApiUrl() {
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0]; // strip the Expo port
    return `http://${ip}:5000`;
  }
  return 'http://localhost:5000'; // fallback for simulator
}

const API_URL = getApiUrl();

const TOKEN_KEY = 'tradetracker_token';
const USER_KEY = 'tradetracker_user';

// ── Token helpers ──────────────────────────────────────────────────────────────
export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveToken(token) {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getUser() {
  const json = await AsyncStorage.getItem(USER_KEY);
  return json ? JSON.parse(json) : null;
}

export async function saveUser(user) {
  return AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

// ── Fetch wrapper ──────────────────────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = isJson ? data.error || 'Something went wrong' : `Server Error: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// ── Auth methods ───────────────────────────────────────────────────────────────
export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await saveToken(data.token);
  await saveUser(data.user);
  return data;
}

export async function signup(email, password, fullName) {
  const data = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
  await saveToken(data.token);
  await saveUser(data.user);
  return data;
}

export async function logout() {
  await clearAuth();
}
