# TradeTracker Mobile

React Native + Expo app for TradeTracker. iOS-first design.

---

## 🚀 Quick Start (3 steps, no Xcode needed)

### 1. Install Expo Go on your iPhone
Download **Expo Go** from the App Store on your iPhone. Free.

### 2. Install dependencies
```bash
cd mobile
npm install
```

### 3. Start the dev server
```bash
npx expo start
```

A QR code will appear in your terminal. Open your iPhone Camera app,
point at the QR code, and tap the banner — your app opens instantly on your phone.

> **Hot reload** is on by default. Save a file and the app updates in ~1 second.

---

## 📁 Structure

```
mobile/
├── App.js                        # Root entry point
├── app.json                      # Expo config
├── babel.config.js
├── package.json
└── src/
    ├── theme/
    │   └── index.js              # Colors, spacing, typography, radius
    ├── components/
    │   ├── shared.js             # StatCard, Card, EmptyState, SegmentedControl, Badge
    │   └── CustomTabBar.js       # iOS-style blur tab bar
    ├── navigation/
    │   └── AppNavigator.js       # Bottom tab navigator
    └── screens/
        ├── DashboardScreen.js
        ├── TradesScreen.js       # Import + Manual Log + All Trades + Performance
        ├── StrategiesScreen.js
        ├── ReportScreen.js
        └── ProfileScreen.js
```

---

## 🔌 Connecting your backend

All screens currently render with empty/zero state. To wire up your existing API:

1. Create `src/api/client.js` with your base URL:
```js
const BASE_URL = 'https://your-live-api.com/api';

export async function fetchTrades() {
  const res = await fetch(`${BASE_URL}/trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
```

2. Use `useEffect` + `useState` in each screen to load data on mount.
3. Replace the `STATS` placeholder arrays with real API responses.

---

## 🎨 Design Tokens

Edit `src/theme/index.js` to adjust:
- `colors.accent` — the green brand color (`#32D74B`)
- `colors.background` — page background (`#000000`)
- Spacing, border radius, typography scale — all in one place

---

## 📦 Building for TestFlight (when ready)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure the build
eas build:configure

# Build for iOS (uploads to Apple automatically)
eas build --platform ios
```

No Mac or Xcode required — EAS builds in the cloud.
