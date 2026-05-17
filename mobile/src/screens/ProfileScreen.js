import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card } from '../components/shared';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={16} color={colors.textSecondary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={value ? styles.infoValue : styles.infoEmpty}>{value || 'Not set'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { data: trades = [] } = useQuery({ queryKey: ['trades'], queryFn: () => apiFetch('/api/trades') });

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.winLoss === 'WIN' || t.profitLoss > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  const totalProfit = trades.reduce((sum, t) => sum + (Number(t.profitLoss) || 0), 0);

  const initials = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{user?.name || 'Trader'}</Text>
            <Text style={styles.heroEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={16} color={colors.text} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{totalTrades}</Text>
            <Text style={styles.statsLabel}>Total Trades</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{winRate}%</Text>
            <Text style={styles.statsLabel}>Win Rate</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsValue, totalProfit >= 0 ? { color: colors.positive } : { color: colors.negative }]}>
              {totalProfit >= 0 ? '+' : ''}${Math.abs(totalProfit).toFixed(2)}
            </Text>
            <Text style={styles.statsLabel}>Total P&L</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
        <Card style={styles.infoCard}>
          {[
            { icon: 'person-outline', label: 'Personal Information' },
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'shield-outline', label: 'Privacy & Security' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name={item.icon} size={16} color={colors.textSecondary} />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.sep} />}
            </React.Fragment>
          ))}
        </Card>

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.negative} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#000' },
  heroInfo: { flex: 1 },
  heroName: { ...typography.title2, fontSize: 22 },
  heroEmail: { ...typography.footnote, marginTop: 2, color: colors.textSecondary },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  editBtnText: { fontSize: 14, fontWeight: '600', color: colors.text },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingVertical: spacing.lg, marginBottom: spacing.sm },
  statsItem: { flex: 1, alignItems: 'center' },
  statsValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  statsLabel: { ...typography.caption, marginTop: 4, textAlign: 'center', color: colors.textSecondary },
  sectionLabel: { ...typography.caption, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.8, marginLeft: 4, marginTop: spacing.sm },
  infoCard: { overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  infoIconWrap: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500' },
  infoValue: { ...typography.callout, marginTop: 2 },
  infoEmpty: { ...typography.callout, fontStyle: 'italic', color: colors.textTertiary, marginTop: 2 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  settingLabel: { ...typography.callout, flex: 1 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,69,58,0.1)', borderRadius: radius.lg, paddingVertical: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,69,58,0.2)', marginTop: spacing.lg },
  signOutText: { fontSize: 16, fontWeight: '600', color: colors.negative },
});
