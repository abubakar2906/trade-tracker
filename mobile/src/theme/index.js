// TradeTracker Design System — matching web app dark theme exactly
// Web CSS dark mode variables extracted from globals.css:
// --background: 0 0% 3.9%  (#0a0a0a)
// --foreground: 0 0% 98%   (#fafafa)
// --card: 0 0% 3.9%        (#0a0a0a)
// --border: 0 0% 14.9%     (#262626)
// --muted: 0 0% 14.9%      (#262626)
// --muted-foreground: 0 0% 63.9% (#a3a3a3)
// --primary: 0 0% 98%      (#fafafa)  ← WHITE, not green
// --primary-foreground: 0 0% 9% (#171717)
// --secondary: 0 0% 14.9%  (#262626)
// --destructive: red        (#FF453A)

export const colors = {
  // Base
  background: '#0a0a0a',      // --background
  surface: '#262626',          // --muted / --secondary
  surface2: '#333333',
  surface3: '#404040',

  // Borders
  border: '#262626',           // --border (solid, not translucent)
  borderStrong: '#3a3a3a',

  // Text
  text: '#fafafa',             // --foreground
  textSecondary: '#a3a3a3',    // --muted-foreground
  textTertiary: '#525252',

  // Primary — WHITE (matches web --primary in dark mode)
  primary: '#fafafa',
  primaryForeground: '#171717', // --primary-foreground

  // Data colors — green is ONLY for positive P&L / chart data
  positive: '#32D74B',
  positiveDim: 'rgba(50,215,75,0.15)',
  blue: '#0A84FF',
  negative: '#FF453A',         // --destructive
  orange: '#FF9F0A',

  // Tab bar
  tabBar: 'rgba(10,10,10,0.92)',
  tabBarBorder: '#262626',

  // Cards
  cardBackground: '#0a0a0a',  // --card
  cardBorder: '#262626',       // --border
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    color: '#fafafa',
  },
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
    color: '#fafafa',
  },
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
    color: '#fafafa',
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: '#fafafa',
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    color: '#fafafa',
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
    color: '#fafafa',
  },
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    color: '#fafafa',
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    color: '#a3a3a3',
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    color: '#a3a3a3',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    color: '#a3a3a3',
  },
};
