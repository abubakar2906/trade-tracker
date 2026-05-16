import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

const TAB_CONFIG = {
  Dashboard: { icon: 'house.fill', iconActive: 'house.fill', label: 'Home', ionicon: 'home-outline', ioniconActive: 'home' },
  Trades:    { icon: 'chart.bar', iconActive: 'chart.bar.fill', label: 'Trades', ionicon: 'stats-chart-outline', ioniconActive: 'stats-chart' },
  Strategies:{ icon: 'lightbulb', iconActive: 'lightbulb.fill', label: 'Strategy', ionicon: 'bulb-outline', ioniconActive: 'bulb' },
  Report:    { icon: 'doc.text', iconActive: 'doc.text.fill', label: 'Report', ionicon: 'document-text-outline', ioniconActive: 'document-text' },
  Profile:   { icon: 'person', iconActive: 'person.fill', label: 'Profile', ionicon: 'person-outline', ioniconActive: 'person' },
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  const handlePress = (route, isFocused) => {
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      <View style={styles.border} />
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {};
          const iconName = isFocused ? config.ioniconActive : config.ionicon;

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={() => handlePress(route, isFocused)}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.tabBar,
  },
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.tabBarBorder,
  },
  tabRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {},
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,  // White active, matching web --primary
    fontWeight: '600',
  },
});
