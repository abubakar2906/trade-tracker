import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card, EmptyState, SegmentedControl } from '../components/shared';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

const TABS = ['All Trades', 'Performance', 'Import'];

// ── All Trades Tab ─────────────────────────────────────────────────────────────
function AllTradesTab({ navigation }) {
  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => apiFetch('/api/trades'),
  });

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: colors.textSecondary }}>Loading...</Text></View>;
  }

  if (trades.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon="receipt-outline"
          title="No trades logged"
          subtitle="Use the Log Trade button above to add your first trade."
          action="Log Trade"
          onAction={() => navigation.navigate('AddTrade')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={trades}
      keyExtractor={t => t.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: spacing.sm }}
      renderItem={({ item: trade }) => (
        <Card style={styles.tradeCard}>
          <View style={styles.tradeTop}>
             <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
             <Text style={styles.tradeDate}>{new Date(trade.date).toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.tradeTagsWrap}>
             <View style={[styles.tradeBadge, { borderColor: trade.bias === 'BULLISH' ? colors.positive : trade.bias === 'BEARISH' ? colors.negative : colors.border }]}>
               <Text style={[styles.tradeBadgeText, { color: trade.bias === 'BULLISH' ? colors.positive : trade.bias === 'BEARISH' ? colors.negative : colors.text }]}>{trade.bias}</Text>
             </View>
             
             {trade.setups?.slice(0, 2).map((s, i) => (
               <View key={i} style={styles.tradeBadge}><Text style={styles.tradeBadgeText}>{s}</Text></View>
             ))}
             {trade.setups?.length > 2 && <Text style={styles.tradeMoreTags}>+{trade.setups.length - 2}</Text>}
          </View>

          <View style={styles.tradeBottom}>
             <View style={[styles.resultBadge, trade.winLoss === 'WIN' ? { backgroundColor: colors.positiveDim } : trade.winLoss === 'LOSS' ? { backgroundColor: 'rgba(255,69,58,0.15)' } : {}]}>
               <Text style={[styles.resultBadgeText, trade.winLoss === 'WIN' ? { color: colors.positive } : trade.winLoss === 'LOSS' ? { color: colors.negative } : {}]}>
                 {trade.winLoss || 'PENDING'}
               </Text>
             </View>
             
             <Text style={[styles.tradePnL, Number(trade.profitLoss) >= 0 ? { color: colors.positive } : { color: colors.negative }]}>
                {Number(trade.profitLoss) >= 0 ? '+' : ''}${Math.abs(Number(trade.profitLoss)).toFixed(2)}
             </Text>
          </View>
        </Card>
      )}
    />
  );
}

// ── Performance Tab ────────────────────────────────────────────────────────────
function PerformanceTab() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <EmptyState
        icon="trending-up-outline"
        title="Performance Analysis"
        subtitle="Chart visualizations coming soon!"
      />
    </View>
  );
}

// ── Import Tab ─────────────────────────────────────────────────────────────────
function ImportTab() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: 120 }}>
      <Card style={styles.importCard}>
        <View style={styles.importHeader}>
          <View style={styles.importIconWrap}>
            <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.importTitle}>Import from CSV</Text>
            <Text style={styles.importSub}>Upload your broker history file</Text>
          </View>
        </View>
        <Text style={styles.importHint}>Supports MetaTrader 4/5, cTrader exports</Text>
        <TouchableOpacity style={styles.importButton}>
          <Ionicons name="document-outline" size={18} color={colors.text} />
          <Text style={styles.importButtonText}>Choose File</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function TradesScreen({ navigation }) {
  const [tab, setTab] = useState(0);
  const tabs = [<AllTradesTab navigation={navigation} />, <PerformanceTab />, <ImportTab />];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.pageTitle} numberOfLines={1} adjustsFontSizeToFit>Journal</Text>
        <TouchableOpacity 
          style={styles.addTradeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => navigation.navigate('AddTrade')}
        >
          <Ionicons name="add" size={20} color={colors.primaryForeground} />
          <Text style={styles.addTradeBtnText}>Log Trade</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.segWrap}>
        <SegmentedControl options={TABS} selected={tab} onChange={setTab} />
      </View>
      <View style={styles.tabContent}>
        {tabs[tab]}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl,
  },
  pageTitle: { ...typography.largeTitle },
  addTradeBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, gap: 4,
  },
  addTradeBtnText: { ...typography.subheadline, color: colors.primaryForeground, fontWeight: '700' },
  segWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  tabContent: { flex: 1, paddingHorizontal: spacing.lg },

  // Trade Cards
  tradeCard: { padding: spacing.md, marginBottom: spacing.md },
  tradeTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  tradeSymbol: { ...typography.headline, fontSize: 18 },
  tradeDate: { ...typography.footnote, color: colors.textTertiary },
  
  tradeTagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md },
  tradeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2 },
  tradeBadgeText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  tradeMoreTags: { ...typography.caption, color: colors.textTertiary, alignSelf: 'center' },

  tradeBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  resultBadgeText: { ...typography.footnote, fontWeight: '700', color: colors.textSecondary },
  tradePnL: { ...typography.title3 },

  // Import
  importCard: { padding: spacing.xl, gap: spacing.md },
  importHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  importIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  importTitle: { ...typography.headline },
  importSub: { ...typography.footnote, marginTop: 2, color: colors.textSecondary },
  importHint: { ...typography.footnote, color: colors.textTertiary },
  importButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.surface2, borderRadius: radius.md,
    paddingVertical: 13, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderStrong,
  },
  importButtonText: { ...typography.callout, fontWeight: '600', color: colors.text },
});
