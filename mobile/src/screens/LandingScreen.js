import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header/Logo */}
        <View style={styles.header}>
          <Text style={styles.logoText}>TradeTracker</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Built for serious traders</Text>
          </View>

          <Text style={styles.title} adjustsFontSizeToFit minimumFontScale={0.6} numberOfLines={3}>
            Know every trade.{'\n'}
            <Text style={styles.titleMuted}>Own your edge.</Text>
          </Text>

          <Text style={styles.subtitle}>
            TradeTracker gives you a complete picture of your performance —
            P&L, win rate, R:R ratio, and strategy insights all in one place.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.footnote}>
            No credit card required · Forex, Crypto & Stocks
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  logoText: {
    ...typography.title2,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.text,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.positive, // Green dot is fine — it's a status indicator
    marginRight: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 50,
    color: colors.text,
    letterSpacing: -1.5,
    marginBottom: spacing.lg,
  },
  titleMuted: {
    color: colors.textSecondary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    maxWidth: '95%',
  },
  actions: {
    width: '100%',
    gap: spacing.md,
    paddingTop: spacing.xxl,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary, // WHITE — matches web --primary
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.headline,
    color: colors.primaryForeground, // Dark text on white button
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    ...typography.headline,
    color: colors.text,
  },
  footnote: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.textTertiary,
  },
});
