import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card, EmptyState } from '../components/shared';

function StrategyCard({ strategy, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Card style={styles.strategyCard}>
        <View style={styles.strategyCardInner}>
          <View style={[styles.strategyIcon, { backgroundColor: strategy.color + '22' }]}>
            <Ionicons name={strategy.icon} size={22} color={strategy.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.strategyName}>{strategy.name}</Text>
            {strategy.description ? (
              <Text style={styles.strategyDesc} numberOfLines={1}>{strategy.description}</Text>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </View>
        {strategy.rules ? (
          <View style={styles.strategyRules}>
            <Text style={styles.strategyRulesText} numberOfLines={2}>{strategy.rules}</Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}

const ICON_OPTIONS = [
  { icon: 'trending-up', color: colors.positive },
  { icon: 'analytics', color: colors.blue },
  { icon: 'flash', color: colors.orange },
  { icon: 'shield-checkmark', color: '#BF5AF2' },
  { icon: 'pulse', color: colors.negative },
  { icon: 'rocket', color: '#64D2FF' },
];

export default function StrategiesScreen() {
  const [strategies, setStrategies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', rules: '', iconIdx: 0 });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const chosen = ICON_OPTIONS[form.iconIdx];
    setStrategies(prev => [...prev, {
      id: Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      rules: form.rules.trim(),
      icon: chosen.icon,
      color: chosen.color,
    }]);
    setForm({ name: '', description: '', rules: '', iconIdx: 0 });
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Strategies</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color={colors.primaryForeground} />
          <Text style={styles.createBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {strategies.length === 0 ? (
          <EmptyState
            icon="bulb-outline"
            title="No strategies yet"
            subtitle="Document your trading strategies, rules, and entry criteria."
            action="Create First Strategy"
            onAction={() => setShowModal(true)}
          />
        ) : (
          strategies.map(s => (
            <StrategyCard key={s.id} strategy={s} onPress={() => {}} />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={styles.modalSafe}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Strategy</Text>
              <TouchableOpacity onPress={handleCreate}>
                <Text style={[styles.modalCancel, { color: colors.primary, fontWeight: '700' }]}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
              {/* Icon Picker */}
              <View>
                <Text style={styles.inputLabel}>ICON</Text>
                <View style={styles.iconRow}>
                  {ICON_OPTIONS.map((opt, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.iconPick, form.iconIdx === i && { borderColor: opt.color, borderWidth: 2 }]}
                      onPress={() => setForm(f => ({ ...f, iconIdx: i }))}
                    >
                      <View style={[styles.iconPickInner, { backgroundColor: opt.color + '22' }]}>
                        <Ionicons name={opt.icon} size={22} color={opt.color} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={styles.inputLabel}>STRATEGY NAME</Text>
                <Card>
                  <TextInput
                    style={styles.textField}
                    placeholder="e.g. Breakout Momentum"
                    placeholderTextColor={colors.textTertiary}
                    value={form.name}
                    onChangeText={v => setForm(f => ({ ...f, name: v }))}
                  />
                </Card>
              </View>

              <View>
                <Text style={styles.inputLabel}>DESCRIPTION</Text>
                <Card>
                  <TextInput
                    style={styles.textField}
                    placeholder="Brief summary of the strategy…"
                    placeholderTextColor={colors.textTertiary}
                    value={form.description}
                    onChangeText={v => setForm(f => ({ ...f, description: v }))}
                    multiline
                    numberOfLines={2}
                  />
                </Card>
              </View>

              <View>
                <Text style={styles.inputLabel}>RULES & CRITERIA</Text>
                <Card>
                  <TextInput
                    style={[styles.textField, { minHeight: 100 }]}
                    placeholder="Entry/exit conditions, timeframes, risk rules…"
                    placeholderTextColor={colors.textTertiary}
                    value={form.rules}
                    onChangeText={v => setForm(f => ({ ...f, rules: v }))}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />
                </Card>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pageTitle: { ...typography.largeTitle },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: radius.pill,
  },
  createBtnText: { fontSize: 15, fontWeight: '600', color: colors.primaryForeground },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.sm },

  strategyCard: { padding: spacing.lg, marginBottom: 2 },
  strategyCardInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  strategyIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  strategyName: { ...typography.headline, fontSize: 16 },
  strategyDesc: { ...typography.footnote, marginTop: 2 },
  strategyRules: {
    marginTop: spacing.md, paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
  strategyRulesText: { ...typography.subheadline, lineHeight: 20 },

  // Modal
  modalSafe: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  modalTitle: { ...typography.headline },
  modalCancel: { ...typography.callout, color: colors.blue },
  inputLabel: { ...typography.caption, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.8, marginBottom: spacing.sm, marginLeft: 4 },
  textField: {
    ...typography.body, color: colors.text,
    padding: spacing.lg, minHeight: 48,
  },
  iconRow: { flexDirection: 'row', gap: spacing.sm },
  iconPick: { borderRadius: 14, padding: 2 },
  iconPickInner: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
