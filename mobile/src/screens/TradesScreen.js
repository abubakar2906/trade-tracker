import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card, EmptyState, SegmentedControl } from '../components/shared';

const TABS = ['All Trades', 'Performance', 'Import'];

// ── All Trades Tab ─────────────────────────────────────────────────────────────
function AllTradesTab({ navigation }) {
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

// ── Performance Tab ────────────────────────────────────────────────────────────
function PerformanceTab() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <EmptyState
        icon="trending-up-outline"
        title="No performance data"
        subtitle="Log trades to unlock charts and performance insights."
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

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>MT4 / MT5 INTEGRATION</Text>
        <View style={styles.divider} />
      </View>

      <Card style={styles.importCard}>
        <View style={styles.importHeader}>
          <View style={[styles.importIconWrap, { backgroundColor: 'rgba(10,132,255,0.15)' }]}>
            <Ionicons name="sync-outline" size={24} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.importTitle}>Broker Sync</Text>
            <Text style={styles.importSub}>Connect MT4/MT5 to auto-sync trades</Text>
          </View>
        </View>
        <View style={styles.emptyBrokerBox}>
          <Text style={styles.emptyBrokerText}>No broker accounts connected</Text>
        </View>
        <TouchableOpacity style={[styles.importButton, { backgroundColor: colors.blue }]}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.importButtonText}>Connect Broker</Text>
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
        <Text style={styles.pageTitle} numberOfLines={1} adjustsFontSizeToFit>Trade Journal</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pageTitle: { ...typography.largeTitle },
  addTradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  addTradeBtnText: {
    ...typography.subheadline,
    color: colors.primaryForeground,
    fontWeight: '700',
  },
  segWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Import
  importCard: { padding: spacing.xl, gap: spacing.md },
  // Fix: use colors.positiveDim for import icon bg
  importHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  importIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.positiveDim, alignItems: 'center', justifyContent: 'center',
  },
  importTitle: { ...typography.headline },
  importSub: { ...typography.footnote, marginTop: 2 },
  importHint: { ...typography.footnote, color: colors.textTertiary },
  importButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.surface2, borderRadius: radius.md,
    paddingVertical: 13, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderStrong,
  },
  importButtonText: { ...typography.callout, fontWeight: '600' },
  emptyBrokerBox: {
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderStrong,
    borderRadius: radius.md, borderStyle: 'dashed', paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyBrokerText: { ...typography.subheadline },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong },
  dividerText: { ...typography.caption, color: colors.textTertiary, letterSpacing: 0.5 },
});
