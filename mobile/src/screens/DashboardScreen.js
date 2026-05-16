import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { StatCard, SectionHeader, Card, EmptyState } from '../components/shared';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export default function DashboardScreen({ navigation }) {
  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => apiFetch('/api/trades'),
  });

  // Calculate dynamic stats
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.profitLoss > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  
  const grossProfit = trades.filter(t => t.profitLoss > 0).reduce((sum, t) => sum + t.profitLoss, 0);
  const grossLoss = trades.filter(t => t.profitLoss < 0).reduce((sum, t) => sum + Math.abs(t.profitLoss), 0);
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '0.00');
  const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  const dynamicStats = [
    { title: 'Total Trades', value: totalTrades.toString(), subtitle: 'All time', icon: 'bar-chart-outline' },
    { title: 'Win Rate',     value: `${winRate}%`, subtitle: 'All time', icon: 'pie-chart-outline' },
    { title: 'Profit Factor',value: profitFactor, subtitle: 'All time', icon: 'trending-up-outline' },
    { title: 'Total Profit', value: `$${totalProfit.toFixed(2)}`, subtitle: 'All time', icon: 'cash-outline', valueColor: totalProfit >= 0 ? colors.positive : colors.negative },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Title */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stat Grid — 2×2 */}
        <View style={styles.statsGrid}>
          {dynamicStats.map((s, i) => (
            <View key={i} style={styles.statsCell}>
              <StatCard
                title={s.title}
                value={s.value}
                subtitle={s.subtitle}
                iconName={s.icon}
                valueColor={s.valueColor}
              />
            </View>
          ))}
        </View>

        {/* Recent Trades */}
        <Card style={styles.section}>
          <SectionHeader
            title="Recent Trades"
            action="See All"
            onAction={() => navigation.navigate('Trades')}
          />
          <EmptyState
            icon="receipt-outline"
            title="No trades yet"
            subtitle="Start logging trades to see them here."
          />
        </Card>

        {/* Upcoming News */}
        <Card style={styles.section}>
          <View style={styles.newsHeader}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.newsTitle}>Upcoming High-Impact News</Text>
          </View>
          <Text style={styles.newsBody}>Major economic events to watch out for.</Text>
          <View style={styles.newsPill}>
            <Ionicons name="checkmark-circle-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.newsPillText}>No high-impact news today</Text>
          </View>
        </Card>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pageTitle: {
    ...typography.largeTitle,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statsCell: {
    width: '47%', // slightly smaller than 50% to account for gap
  },
  section: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  newsTitle: {
    ...typography.headline,
    fontSize: 16,
  },
  newsBody: {
    ...typography.subheadline,
    marginBottom: spacing.md,
  },
  newsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface2,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  newsPillText: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
});
