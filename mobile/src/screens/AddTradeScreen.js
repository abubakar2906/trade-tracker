import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { Card } from '../components/shared';

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "D"];
const EMOTIONS = ["Confident", "Anxious", "FOMO", "Disciplined", "Revenge", "Neutral"];
const SETUPS = ["Breakout", "Pullback", "Reversal", "Trend"];
const BIAS = ["BULLISH", "BEARISH", "NEUTRAL"];
const WIN_LOSS = ["WIN", "LOSS", "BREAKEVEN"];

export default function AddTradeScreen({ navigation }) {
  const [form, setForm] = useState({
    symbol: '', bias: 'BULLISH', winLoss: '', profitLoss: '',
    timeframes: [], setups: [], emotions: [], comment: '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const toggleArrayItem = (key, item) => {
    setForm(f => {
      const current = f[key] || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...f, [key]: updated };
    });
  };

  const handleLogTrade = () => {
    if (!form.symbol) {
      Alert.alert('Missing Data', 'Please enter a Symbol.');
      return;
    }
    // TODO: Send to backend API
    Alert.alert('Success', 'Journal entry saved!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Trade</Text>
        <TouchableOpacity onPress={handleLogTrade}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionLabel}>BASICS</Text>
          <Card style={styles.card}>
            <FormRow label="Symbol">
              <TextInput style={styles.input} placeholder="e.g. BTCUSD" placeholderTextColor={colors.textTertiary}
                value={form.symbol} onChangeText={v => update('symbol', v)} autoCapitalize="characters" />
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Bias">
              <View style={styles.chipRow}>
                {BIAS.map((b) => (
                  <TouchableOpacity key={b} style={[styles.chip, form.bias === b && styles.chipActive]} onPress={() => update('bias', b)}>
                    <Text style={[styles.chipText, form.bias === b && styles.chipTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FormRow>
          </Card>

          <Text style={styles.sectionLabel}>RESULT</Text>
          <Card style={styles.card}>
            <FormRow label="Outcome">
              <View style={styles.chipRow}>
                {WIN_LOSS.map((w) => (
                  <TouchableOpacity key={w} style={[styles.chip, form.winLoss === w && styles.chipActive]} onPress={() => update('winLoss', w)}>
                    <Text style={[styles.chipText, form.winLoss === w && styles.chipTextActive]}>{w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Profit / Loss ($)">
              <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad" value={form.profitLoss} onChangeText={v => update('profitLoss', v)} />
            </FormRow>
          </Card>

          <Text style={styles.sectionLabel}>TAGS</Text>
          <Card style={styles.card}>
            <FormRow label="Timeframes">
              <View style={[styles.chipRow, { flexWrap: 'wrap' }]}>
                {TIMEFRAMES.map((t) => (
                  <TouchableOpacity key={t} style={[styles.chip, form.timeframes.includes(t) && styles.chipActive]} onPress={() => toggleArrayItem('timeframes', t)}>
                    <Text style={[styles.chipText, form.timeframes.includes(t) && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Setups">
              <View style={[styles.chipRow, { flexWrap: 'wrap' }]}>
                {SETUPS.map((s) => (
                  <TouchableOpacity key={s} style={[styles.chip, form.setups.includes(s) && styles.chipActive]} onPress={() => toggleArrayItem('setups', s)}>
                    <Text style={[styles.chipText, form.setups.includes(s) && styles.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FormRow>
            <View style={styles.sep} />
            <FormRow label="Emotions">
              <View style={[styles.chipRow, { flexWrap: 'wrap' }]}>
                {EMOTIONS.map((e) => (
                  <TouchableOpacity key={e} style={[styles.chip, form.emotions.includes(e) && styles.chipActive]} onPress={() => toggleArrayItem('emotions', e)}>
                    <Text style={[styles.chipText, form.emotions.includes(e) && styles.chipTextActive]}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FormRow>
          </Card>

          <Text style={styles.sectionLabel}>JOURNAL</Text>
          <Card style={styles.card}>
            <FormRow>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What did you learn from this trade?"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                value={form.comment}
                onChangeText={v => update('comment', v)}
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
      {label && <Text style={styles.formLabel}>{label}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong,
  },
  headerTitle: { ...typography.headline },
  cancelText: { ...typography.body, color: colors.textSecondary },
  saveText: { ...typography.headline, color: colors.primary },
  scrollContent: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 100 },
  sectionLabel: { ...typography.caption, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.8, marginLeft: 4, marginTop: spacing.sm },
  card: { overflow: 'hidden' },
  formRow: { padding: spacing.lg },
  formLabel: { ...typography.footnote, color: colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  input: { ...typography.body, color: colors.text, paddingVertical: 4 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong, marginHorizontal: spacing.lg },
  chipRow: { flexDirection: 'row', gap: spacing.sm, paddingBottom: 2 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill,
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.positiveDim, borderColor: colors.positive },
  chipText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.text, fontWeight: '600' },
});
