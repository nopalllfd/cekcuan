import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BudgetCard = ({ budget, spending, onUpdate }) => {
  const remainingBudget = budget - spending;
  const percentageUsed = budget > 0 ? Math.min(100, (spending / budget) * 100) : 0;
  const isOverspent = remainingBudget < 0;

  // Logika untuk indikator harian
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate() + 1;
  const dailyAllowance = daysLeft > 0 && !isOverspent ? remainingBudget / daysLeft : 0;

  return (
    <TouchableOpacity
      onPress={onUpdate}
      style={[styles.card, styles.solidCardBackground]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Sisa Jatah Bulanan</Text>
        <Ionicons
          name="add-circle-outline"
          size={22}
          color="rgba(255, 255, 255, 0.7)"
        />
      </View>
      <Text style={styles.amountText}>{isOverspent ? `- Rp ${Math.abs(remainingBudget).toLocaleString('id-ID')}` : `Rp ${remainingBudget.toLocaleString('id-ID')}`}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentageUsed}%`, backgroundColor: isOverspent ? '#ef4444' : '#5E72E4' }]} />
      </View>
      <Text style={styles.progressText}>
        Terpakai Rp {(spending || 0).toLocaleString('id-ID')} dari Rp {(budget || 0).toLocaleString('id-ID')}
      </Text>
      <View style={styles.dailyIndicator}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color="#9AC2FF"
        />
        <Text style={styles.dailyText}>
          {budget > 0 && !isOverspent
            ? `Jatah harian Anda ~Rp ${Math.floor(dailyAllowance).toLocaleString('id-ID')} untuk ${daysLeft} hari ke depan.`
            : isOverspent
            ? 'Anda sudah melebihi jatah bulan ini.'
            : 'Atur jatah untuk melihat indikator harian.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 20, marginBottom: 20 },
  solidCardBackground: { backgroundColor: '#1E1E3F' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 },
  amountText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  progressBarContainer: { height: 8, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 4, overflow: 'hidden', marginTop: 20 },
  progressBar: { height: '100%', borderRadius: 4 },
  progressText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, marginTop: 8 },
  dailyIndicator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  dailyText: { color: '#9AC2FF', fontSize: 13, flex: 1, lineHeight: 18 },
});

export default BudgetCard;
