import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import GlassCard from './GlassCard';

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ title, value, subtitle, iconName, valueColor }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
        <Ionicons name={iconName} size={16} color={colors.textTertiary} />
      </View>
      <Text 
        style={[styles.statCardValue, valueColor && { color: valueColor }]}
        numberOfLines={1} 
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      {subtitle ? <Text style={styles.statCardSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name={icon} size={32} color={colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
      {action ? (
        <TouchableOpacity style={styles.emptyButton} onPress={onAction}>
          <Text style={styles.emptyButtonText}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── Card Container ─────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <GlassCard style={[styles.card, style]}>{children}</GlassCard>;
}

// ── Pill Badge ─────────────────────────────────────────────────────────────────
export function Badge({ label, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ── iOS Segmented Control ─────────────────────────────────────────────────────
export function SegmentedControl({ options, selected, onChange }) {
  return (
    <View style={styles.segmented}>
      {options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          style={[styles.segment, selected === i && styles.segmentActive]}
          onPress={() => onChange(i)}
        >
          <Text style={[styles.segmentText, selected === i && styles.segmentTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // StatCard
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statCardTitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statCardSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },

  // SectionHeader
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title3,
  },
  sectionAction: {
    ...typography.callout,
    color: colors.primary,  // White link — matches web
    fontWeight: '500',
  },

  // EmptyState
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.headline,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.subheadline,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,  // White button
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,  // Dark text on white
  },

  // Card
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // SegmentedControl
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: colors.surface3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
});
