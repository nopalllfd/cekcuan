import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, onPress } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const BudgetCard = ({ budget, spending, onUpdate }) => {
  const remainingBudget = budget - spending;
  const percentageUsed = budget > 0 ? Math.min(100, (spending / budget) * 100) : 0;
  const isOverspent = remainingBudget < 0;

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate() + 1;
  const dailyAllowance = daysLeft > 0 && !isOverspent ? remainingBudget / daysLeft : 0;
  const daysLeftToEndOfMonth = daysInMonth - today.getDate();

  return (
    <View>
      <View style={[styles.card, styles.solidCardBackground]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Jatah Bulanan</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.amountText}>{isOverspent ? `- Rp ${Math.abs(remainingBudget).toLocaleString('id-ID')}` : `Rp ${remainingBudget.toLocaleString('id-ID')}`}</Text>
        </View>
        <View style={styles.count}>
          <Text style={styles.countContent}>(Sisa jatah Bulanan anda untuk {daysLeftToEndOfMonth} hari lagi)</Text>
        </View>
      </View>
      <View style={styles.buttonHeaderBackground}>
        <View style={styles.buttonContentBackground}>
          <TouchableOpacity onPress={onPress}>
            <Feather
              name="plus"
              size={200}
              color="#ffffffff"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonHeader}>
        <View style={styles.buttonContent}>
          <TouchableOpacity onPress={onUpdate}>
            <Feather
              name="plus"
              size={40}
              color="#1B2F6D"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 0, paddingVertical: 20, paddingHorizontal: 8, marginBottom: 28, marginTop: 24, borderWidth: 0.9, borderColor: 'white', paddingBottom: 50, overflow: 'hidden' },
  solidCardBackground: { backgroundColor: '#1E1E3F' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  cardTitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 },
  amountText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  progressBarContainer: { height: 8, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 4, overflow: 'hidden', marginTop: 20 },
  progressBar: { height: '100%', borderRadius: 4 },
  progressText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, marginTop: 8 },
  dailyIndicator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  dailyText: { color: '#9AC2FF', fontSize: 13, flex: 1, lineHeight: 18 },
  count: { flexDirection: 'row', paddingBottom: 8, marginTop: 4, justifyContent: 'space-between', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  countContent: { color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', fontSize: 11 },
  buttonContent: {
    width: 78,
    height: 78,
    borderWidth: 8,
    borderColor: '#1E1E3F',
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 4,
    zIndex: 10,
  },
  buttonContentBackground: {
    width: 80,
    height: 80,
    borderWidth: 0.2,
    borderColor: '#ffffffff',
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 4,
  },
  buttonHeader: {
    alignItems: 'center',
    marginTop: -79,
    zIndex: 12,
  },
  buttonHeaderBackground: {
    alignItems: 'center',
    marginTop: -70,
    zIndex: 12,
  },
});

export default BudgetCard;
