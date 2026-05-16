import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card, SegmentedControl } from '../components/shared';

const ASSET_TYPES = ['Forex', 'Crypto', 'Stocks', 'Futures', 'Options'];
const ACTIONS = ['Buy (Long)', 'Sell (Short)'];
const EMOTIONS = ['Confident', 'Anxious', 'FOMO', 'Disciplined', 'Neutral'];

export default function AddTradeScreen({ navigation }) {
  const [assetType, setAssetType] = useState(0);
  const [action, setAction] = useState(0);
  const [emotion, setEmotion] = useState(null);
  const [form, setForm] = useState({
    symbol: '', entryPrice: '', exitPrice: '', lotSize: '',
    amountInvested: '', stopLoss: '', takeProfit: '', notes: '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calculatePL = () => {
    const entry = parseFloat(form.entryPrice);
    const exit = parseFloat(form.exitPrice);
    const units = parseFloat(form.lotSize) || 1; // Simplification
    if (!isNaN(entry) && !isNaN(exit)) {
      const diff = action === 0 ? exit - entry : entry - exit;
      return (diff * units).toFixed(2);
    }
    return '0.00';
  };

  const handleLogTrade = () => {
    if (!form.symbol || !form.entryPrice) {
      Alert.alert('Missing Data', 'Please enter at least a Symbol and Entry Price.');
      return;
    }
    // TODO: Send to Supabase
    Alert.alert('Success', 'Trade logged successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Trade</Text>
        <TouchableOpacity onPress={handleLogTrade}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.livePLContainer}>
            <Text style={styles.livePLLabel}>Estimated P&L</Text>
            <Text style={[styles.livePLValue, { color: parseFloat(calculatePL()) >= 0 ? colors.positive : colors.negative }]}>
              ${calculatePL()}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>ASSET & DIRECTION</Text>
          <Card style={styles.card}>
            <FormRow label="Asset Type">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
                <View style={styles.chipRow}>
                  {ASSET_TYPES.map((t, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.chip, assetType === i && styles.chipActive]}
                      onPress={() => setAssetType(i)}
                    >
                      <Text style={[styles.chipText, assetType === i && styles.chipTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Action">
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                {ACTIONS.map((a, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.chip, action === i && (i === 0 ? styles.chipBuy : styles.chipSell)]}
                    onPress={() => setAction(i)}
                  >
                    <Text style={[styles.chipText, action === i && styles.chipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Symbol">
              <TextInput
                style={styles.input}
                placeholder="e.g. EURUSD, BTC, AAPL"
                placeholderTextColor={colors.textTertiary}
                value={form.symbol}
                onChangeText={v => update('symbol', v)}
                autoCapitalize="characters"
              />
            </FormRow>
          </Card>

          <Text style={styles.sectionLabel}>PRICING</Text>
          <Card style={styles.card}>
            <FormRow label="Entry Price">
              <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad" value={form.entryPrice} onChangeText={v => update('entryPrice', v)} />
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Exit Price (Optional)">
              <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad" value={form.exitPrice} onChangeText={v => update('exitPrice', v)} />
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Lot Size / Quantity">
              <TextInput style={styles.input} placeholder="1.0" placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad" value={form.lotSize} onChangeText={v => update('lotSize', v)} />
            </FormRow>
          </Card>

          <Text style={styles.sectionLabel}>RISK MANAGEMENT</Text>
          <Card style={styles.card}>
            <FormRow label="Stop Loss">
              <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad" value={form.stopLoss} onChangeText={v => update('stopLoss', v)} />
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Take Profit">
              <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad" value={form.takeProfit} onChangeText={v => update('takeProfit', v)} />
            </FormRow>
          </Card>

          <Text style={styles.sectionLabel}>PSYCHOLOGY</Text>
          <Card style={styles.card}>
            <FormRow label="Emotional State">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
                <View style={styles.chipRow}>
                  {EMOTIONS.map((e, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.chip, emotion === i && styles.chipActive]}
                      onPress={() => setEmotion(emotion === i ? null : i)}
                    >
                      <Text style={[styles.chipText, emotion === i && styles.chipTextActive]}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Notes">
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What went well? What went wrong?"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                value={form.notes}
                onChangeText={v => update('notes', v)}
              />
            </FormRow>
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormRow({ label, children }) {
  return (
    <View style={styles.formRow}>
      <Text style={styles.formLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderStrong,
  },
  headerTitle: { ...typography.headline },
  cancelText: { ...typography.body, color: colors.textSecondary },
  saveText: { ...typography.headline, color: colors.primary },
  
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 100,
  },
  
  livePLContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(28,28,30,0.4)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  livePLLabel: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  livePLValue: { ...typography.largeTitle, marginTop: spacing.xs },

  sectionLabel: {
    ...typography.caption, color: colors.textTertiary,
    fontWeight: '600', letterSpacing: 0.8, marginLeft: 4, marginTop: spacing.sm,
  },
  card: { overflow: 'hidden' },
  formRow: { padding: spacing.lg },
  formLabel: { ...typography.footnote, color: colors.textSecondary, fontWeight: '500', marginBottom: 6 },
  input: {
    ...typography.body,
    color: colors.text,
    paddingVertical: 8,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
    marginHorizontal: spacing.lg,
  },
  chipRow: { flexDirection: 'row', gap: spacing.sm, paddingBottom: 2 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill,
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.positiveDim, borderColor: colors.positive },
  chipBuy: { backgroundColor: 'rgba(50,215,75,0.15)', borderColor: colors.positive },
  chipSell: { backgroundColor: 'rgba(255,69,58,0.15)', borderColor: colors.negative },
  chipText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.text, fontWeight: '600' },
});
