import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { Card } from '../components/shared';

const STATS = [
  { label: 'Total Trades', value: '0',    icon: 'bar-chart-outline' },
  { label: 'Win Rate',     value: '0.0%', icon: 'pie-chart-outline' },
  { label: 'Profit Factor',value: '0.00', icon: 'trending-up-outline' },
  { label: 'Total Profit', value: '$0.00',icon: 'cash-outline', valueColor: colors.text },
];

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={16} color={colors.textSecondary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={value ? styles.infoValue : styles.infoEmpty}>
          {value || 'Not set'}
        </Text>
      </View>
    </View>
  );
}

const TRADING_STYLES = ['Scalper', 'Day Trader', 'Swing Trader', 'Position Trader'];
const MARKETS = ['Forex', 'Crypto', 'Stocks', 'Futures', 'Options', 'Commodities'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: 'abu',
    email: 'abu@gmail.com',
    phone: '',
    location: '',
    tradingStyle: '',
    preferredMarkets: [],
  });
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const initials = profile.name?.[0]?.toUpperCase() || '?';

  const saveEdit = () => {
    setProfile(editForm);
    setShowEdit(false);
  };

  const toggleMarket = (market) => {
    setEditForm(f => ({
      ...f,
      preferredMarkets: f.preferredMarkets.includes(market)
        ? f.preferredMarkets.filter(m => m !== market)
        : [...f.preferredMarkets, market],
    }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{profile.name}</Text>
            <Text style={styles.heroEmail}>{profile.email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => { setEditForm(profile); setShowEdit(true); }}>
            <Ionicons name="pencil-outline" size={16} color={colors.text} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statsItem}>
              <Text style={[styles.statsValue, s.valueColor && { color: s.valueColor }]}>{s.value}</Text>
              <Text style={styles.statsLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Personal Info */}
        <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
        <Card style={styles.infoCard}>
          <InfoRow icon="person-outline"   label="Full Name" value={profile.name} />
          <View style={styles.sep} />
          <InfoRow icon="mail-outline"     label="Email"     value={profile.email} />
          <View style={styles.sep} />
          <InfoRow icon="call-outline"     label="Phone"     value={profile.phone} />
          <View style={styles.sep} />
          <InfoRow icon="location-outline" label="Location"  value={profile.location} />
        </Card>

        {/* Trading Profile */}
        <Text style={styles.sectionLabel}>TRADING PROFILE</Text>
        <Card style={styles.infoCard}>
          <InfoRow icon="trending-up-outline" label="Trading Style"      value={profile.tradingStyle} />
          <View style={styles.sep} />
          <InfoRow icon="bar-chart-outline"   label="Preferred Markets"
            value={profile.preferredMarkets.length ? profile.preferredMarkets.join(', ') : ''} />
        </Card>

        {/* Settings links */}
        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <Card style={styles.infoCard}>
          {[
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'shield-outline',         label: 'Privacy & Security' },
            { icon: 'help-circle-outline',    label: 'Help & Support' },
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

        <TouchableOpacity style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={18} color={colors.negative} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={showEdit} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: colors.background }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowEdit(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={[styles.modalCancel, { color: colors.primary, fontWeight: '700' }]}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
              <View>
                <Text style={styles.inputLabel}>PERSONAL</Text>
                <Card>
                  {[
                    { key: 'name',     label: 'Full Name',  placeholder: 'Your name' },
                    { key: 'email',    label: 'Email',       placeholder: 'you@example.com' },
                    { key: 'phone',    label: 'Phone',       placeholder: '+1 555 000 0000' },
                    { key: 'location', label: 'Location',    placeholder: 'City, Country' },
                  ].map((field, i, arr) => (
                    <React.Fragment key={field.key}>
                      <View style={styles.editFieldWrap}>
                        <Text style={styles.editFieldLabel}>{field.label}</Text>
                        <TextInput
                          style={styles.editField}
                          placeholder={field.placeholder}
                          placeholderTextColor={colors.textTertiary}
                          value={editForm[field.key]}
                          onChangeText={v => setEditForm(f => ({ ...f, [field.key]: v }))}
                        />
                      </View>
                      {i < arr.length - 1 && <View style={styles.sep} />}
                    </React.Fragment>
                  ))}
                </Card>
              </View>

              <View>
                <Text style={styles.inputLabel}>TRADING STYLE</Text>
                <View style={styles.chipRow}>
                  {TRADING_STYLES.map((s, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.chip, editForm.tradingStyle === s && styles.chipActive]}
                      onPress={() => setEditForm(f => ({ ...f, tradingStyle: f.tradingStyle === s ? '' : s }))}
                    >
                      <Text style={[styles.chipText, editForm.tradingStyle === s && styles.chipTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={styles.inputLabel}>PREFERRED MARKETS</Text>
                <View style={styles.chipRow}>
                  {MARKETS.map((m, i) => {
                    const active = editForm.preferredMarkets.includes(m);
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => toggleMarket(m)}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{m}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
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
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  hero: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#000' },
  heroInfo: { flex: 1 },
  heroName: { ...typography.title2, fontSize: 22 },
  heroEmail: { ...typography.footnote, marginTop: 2 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, borderRadius: radius.pill,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  editBtnText: { fontSize: 14, fontWeight: '600', color: colors.text },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.cardBorder,
    paddingVertical: spacing.lg,
  },
  statsItem: { flex: 1, alignItems: 'center' },
  statsValue: { fontSize: 20, fontWeight: '700', color: colors.text },
  statsLabel: { ...typography.caption, marginTop: 4, textAlign: 'center' },

  sectionLabel: {
    ...typography.caption, color: colors.textTertiary,
    fontWeight: '600', letterSpacing: 0.8, marginLeft: 4, marginTop: spacing.sm,
  },
  infoCard: { overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  infoIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500' },
  infoValue: { ...typography.callout, marginTop: 2 },
  infoEmpty: { ...typography.callout, fontStyle: 'italic', color: colors.textTertiary, marginTop: 2 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: spacing.lg },

  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  settingLabel: { ...typography.callout, flex: 1 },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: 'rgba(255,69,58,0.1)',
    borderRadius: radius.lg, paddingVertical: 16,
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,69,58,0.2)',
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: colors.negative },

  // Modal
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  modalTitle: { ...typography.headline },
  modalCancel: { ...typography.callout, color: colors.blue },
  inputLabel: { ...typography.caption, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.8, marginBottom: spacing.sm, marginLeft: 4 },
  editFieldWrap: { padding: spacing.lg },
  editFieldLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500', marginBottom: 6 },
  editField: { ...typography.body, color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.positiveDim, borderColor: colors.positive },
  chipText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.text, fontWeight: '600' },
});
