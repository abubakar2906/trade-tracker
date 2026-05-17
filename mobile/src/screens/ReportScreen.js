import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card } from '../components/shared';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

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

export default function ReportScreen() {
  const { data: trades = [], isLoading } = useQuery({ queryKey: ['trades'], queryFn: () => apiFetch('/api/trades') });

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.winLoss === 'WIN' || t.profitLoss > 0).length;
  const losingTrades = trades.filter(t => t.winLoss === 'LOSS' || t.profitLoss < 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  
  const grossProfit = trades.filter(t => (Number(t.profitLoss) > 0)).reduce((sum, t) => sum + Number(t.profitLoss), 0);
  const grossLoss = trades.filter(t => (Number(t.profitLoss) < 0)).reduce((sum, t) => sum + Math.abs(Number(t.profitLoss)), 0);
  
  const totalProfit = grossProfit - grossLoss;
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '0.00');
  
  const avgWin = winningTrades > 0 ? (grossProfit / winningTrades).toFixed(2) : '0.00';
  const avgLoss = losingTrades > 0 ? (grossLoss / losingTrades).toFixed(2) : '0.00';

  const STATS = [
    { label: 'Total P&L',       value: `$${Math.abs(totalProfit).toFixed(2)}`, icon: 'cash-outline',          color: totalProfit >= 0 ? colors.positive : colors.negative },
    { label: 'Win Rate',           value: `${winRate}%`, icon: 'pie-chart-outline',     color: colors.blue },
    { label: 'Profit Factor',      value: profitFactor, icon: 'trending-up-outline',   color: colors.text },
    { label: 'Total Trades',       value: totalTrades.toString(), icon: 'receipt-outline',       color: colors.text },
    { label: 'Average Win',     value: `$${avgWin}`, icon: 'arrow-up-outline',   color: colors.positive },
    { label: 'Average Loss', value: `$${avgLoss}`, icon: 'arrow-down-outline',         color: colors.negative },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Analytics</Text>
        </View>

        <Text style={styles.sectionLabel}>ALL TIME STATISTICS</Text>

        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statsCell}>
              <MiniStatCard label={s.label} value={s.value} icon={s.icon} color={s.color} />
            </View>
          ))}
        </View>

        <Card style={[styles.miniCard, { marginTop: spacing.md }]}>
           <Text style={styles.chartTitle}>Equity Curve</Text>
           <Text style={styles.chartSub}>Coming soon in next update</Text>
           <View style={styles.chartEmpty}>
             <Ionicons name="stats-chart-outline" size={36} color={colors.textTertiary} />
             <Text style={styles.chartEmptyText}>Charts are being rebuilt for the new tag system.</Text>
           </View>
        </Card>

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
  sectionLabel: { ...typography.caption, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.8, marginLeft: 4, marginTop: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statsCell: { width: '48.5%' },
  miniCard: { padding: spacing.md, gap: spacing.sm },
  miniCardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  miniCardIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  miniCardLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500', flex: 1 },
  miniCardValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  chartTitle: { ...typography.title3, fontSize: 17 },
  chartSub: { ...typography.subheadline },
  chartEmpty: { height: 140, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface2, borderRadius: radius.md, marginTop: spacing.sm, gap: spacing.sm, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, borderStyle: 'dashed' },
  chartEmptyText: { ...typography.footnote, textAlign: 'center', color: colors.textTertiary, paddingHorizontal: 20 },
});
