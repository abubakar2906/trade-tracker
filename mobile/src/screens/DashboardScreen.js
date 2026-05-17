import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.winLoss === 'WIN' || t.profitLoss > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  const totalProfit = trades.reduce((sum, t) => sum + (Number(t.profitLoss) || 0), 0);

  const dynamicStats = [
    { title: 'Total P&L', value: `$${totalProfit.toFixed(2)}`, subtitle: 'All time', icon: 'cash-outline', valueColor: totalProfit >= 0 ? colors.positive : colors.negative },
    { title: 'Win Rate', value: `${winRate}%`, subtitle: `${winningTrades} Wins`, icon: 'pie-chart-outline' },
    { title: 'Total Trades', value: totalTrades.toString(), subtitle: 'All time', icon: 'bar-chart-outline' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
           <View style={{ width: '100%', marginBottom: spacing.sm }}>
              <StatCard
                title={dynamicStats[0].title}
                value={dynamicStats[0].value}
                subtitle={dynamicStats[0].subtitle}
                iconName={dynamicStats[0].icon}
                valueColor={dynamicStats[0].valueColor}
              />
           </View>
           <View style={styles.statsRow}>
              <View style={styles.statsCell}>
                <StatCard title={dynamicStats[1].title} value={dynamicStats[1].value} subtitle={dynamicStats[1].subtitle} iconName={dynamicStats[1].icon} />
              </View>
              <View style={styles.statsCell}>
                <StatCard title={dynamicStats[2].title} value={dynamicStats[2].value} subtitle={dynamicStats[2].subtitle} iconName={dynamicStats[2].icon} />
              </View>
           </View>
        </View>

        <Card style={styles.section}>
          <SectionHeader title="Recent Trades" action="See All" onAction={() => navigation.navigate('Trades')} />
          {trades.length === 0 ? (
            <EmptyState icon="receipt-outline" title="No trades yet" subtitle="Start logging trades to see them here." />
          ) : (
            trades.slice(0, 3).map((trade) => (
              <View key={trade.id} style={styles.tradeCard}>
                 <View style={styles.tradeTop}>
                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                    <Text style={styles.tradeDate}>{new Date(trade.date).toLocaleDateString()}</Text>
                 </View>
                 <View style={styles.tradeMid}>
                    <View style={styles.tradeBadge}><Text style={styles.tradeBadgeText}>{trade.bias}</Text></View>
                    <View style={[styles.tradeBadge, trade.winLoss === 'WIN' && { backgroundColor: colors.positiveDim }]}><Text style={[styles.tradeBadgeText, trade.winLoss === 'WIN' && { color: colors.positive }]}>{trade.winLoss || 'PENDING'}</Text></View>
                 </View>
                 <Text style={[styles.tradePnL, Number(trade.profitLoss) >= 0 ? { color: colors.positive } : { color: colors.negative }]}>
                    {Number(trade.profitLoss) >= 0 ? '+' : ''}${Math.abs(Number(trade.profitLoss)).toFixed(2)}
                 </Text>
              </View>
            ))
          )}
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  pageTitle: { ...typography.largeTitle },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  statsGrid: { marginBottom: spacing.xl },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  statsCell: { flex: 1 },
  section: { padding: spacing.xl, marginBottom: spacing.xl },
  tradeCard: { paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  tradeTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tradeSymbol: { ...typography.headline, fontSize: 16 },
  tradeDate: { ...typography.footnote, color: colors.textTertiary },
  tradeMid: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  tradeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: colors.surface2 },
  tradeBadgeText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  tradePnL: { ...typography.subheadline, fontWeight: '700', alignSelf: 'flex-end' },
});
