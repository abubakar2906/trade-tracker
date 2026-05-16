import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card, EmptyState } from '../components/shared';

const TIME_FILTERS = ['All Time', '1W', '1M', '3M', '1Y'];
const TYPE_FILTERS = ['All Types', 'Forex', 'Crypto', 'Stocks'];

const STATS = [
  { label: 'Total Profit',       value: '$0.00', sub: null,           icon: 'cash-outline',          color: colors.positive },
  { label: 'Win Rate',           value: '0.00%', sub: null,           icon: 'pie-chart-outline',     color: colors.blue },
  { label: 'Max Drawdown',       value: '$0.00', sub: null,           icon: 'trending-down-outline', color: colors.negative },
  { label: 'Profit Factor',      value: '0.00',  sub: null,           icon: 'trending-up-outline',   color: colors.text },
  { label: 'Total Trades',       value: '0',     sub: null,           icon: 'receipt-outline',       color: colors.text },
  { label: 'Average Profit',     value: '$0.00', sub: null,           icon: 'stats-chart-outline',   color: colors.text },
  { label: 'Longest Win Streak', value: '0',     sub: null,           icon: 'flame-outline',         color: colors.orange },
  { label: 'Longest Lose Streak',value: '0',     sub: null,           icon: 'thunderstorm-outline',  color: colors.negative },
];

function FilterPill({ options, selected, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.pillRow}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.pill, selected === i && styles.pillActive]}
            onPress={() => onChange(i)}
          >
            <Text style={[styles.pillText, selected === i && styles.pillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function MiniStatCard({ label, value, icon, color }) {
  return (
    <Card style={styles.miniCard}>
      <View style={styles.miniCardHeader}>
        <View style={[styles.miniCardIcon, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={styles.miniCardLabel}>{label}</Text>
      </View>
      <Text style={[styles.miniCardValue, { color }]}>{value}</Text>
    </Card>
  );
}

function ChartPlaceholder({ title, subtitle }) {
  return (
    <Card style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      {subtitle ? <Text style={styles.chartSub}>{subtitle}</Text> : null}
      <View style={styles.chartEmpty}>
        <Ionicons name="bar-chart-outline" size={36} color={colors.textTertiary} />
        <Text style={styles.chartEmptyText}>No data yet</Text>
      </View>
    </Card>
  );
}

export default function ReportScreen() {
  const [timeFilter, setTimeFilter] = useState(0);
  const [typeFilter, setTypeFilter] = useState(0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Report</Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <FilterPill options={TIME_FILTERS} selected={timeFilter} onChange={setTimeFilter} />
          <FilterPill options={TYPE_FILTERS} selected={typeFilter} onChange={setTypeFilter} />
        </View>

        {/* Trade Statistics label */}
        <Text style={styles.sectionLabel}>TRADE STATISTICS</Text>

        {/* 2×4 Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statsCell}>
              <MiniStatCard label={s.label} value={s.value} icon={s.icon} color={s.color} />
            </View>
          ))}
        </View>

        {/* Charts */}
        <Text style={styles.sectionLabel}>CHARTS</Text>
        <ChartPlaceholder title="Profit by Symbol" subtitle="Total profit for each traded symbol" />
        <ChartPlaceholder title="Trades by Day" subtitle="Number of trades executed each day" />
        <ChartPlaceholder title="Win/Loss Ratio" subtitle="Visual breakdown of trade outcomes" />

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  header: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  pageTitle: { ...typography.largeTitle },
  filtersSection: { gap: spacing.sm },
  pillRow: { flexDirection: 'row', gap: spacing.sm, paddingBottom: 2 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.surface3, borderColor: colors.borderStrong },
  pillText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '500' },
  pillTextActive: { color: colors.text, fontWeight: '600' },
  sectionLabel: {
    ...typography.caption, color: colors.textTertiary,
    fontWeight: '600', letterSpacing: 0.8, marginLeft: 4, marginTop: spacing.sm,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statsCell: { width: '48.5%' },
  miniCard: { padding: spacing.md, gap: spacing.sm },
  miniCardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  miniCardIcon: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  miniCardLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500', flex: 1 },
  miniCardValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  chartCard: { padding: spacing.lg, gap: spacing.sm },
  chartTitle: { ...typography.title3, fontSize: 17 },
  chartSub: { ...typography.subheadline },
  chartEmpty: {
    height: 140, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface2, borderRadius: radius.md,
    marginTop: spacing.sm, gap: spacing.sm, borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border, borderStyle: 'dashed',
  },
  chartEmptyText: { ...typography.footnote },
});
