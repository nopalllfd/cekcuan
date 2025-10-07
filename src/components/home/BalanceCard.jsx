import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BalanceCard = ({ budget, dailySpending }) => {
  console.log('JATAH BULANAN DITERIMA:', budget);
  console.log('PENGELUARAN HARI INI DITERIMA:', dailySpending);
  // --- LOGIKA FOKUS HARIAN ---
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // 1. Jatah harian rata-rata dari budget bulanan
  const dailyBudget = budget > 0 ? budget / daysInMonth : 0;

  // 2. Sisa jatah untuk HARI INI
  const amountSpentToday = dailySpending || 0;
  const remainingDailyBudget = dailyBudget - amountSpentToday;

  // 3. Progress bar untuk HARI INI
  const percentageUsedToday = dailyBudget > 0 ? Math.min(100, Math.max(0, (amountSpentToday / dailyBudget) * 100)) : 0;

  const isOverspentToday = amountSpentToday > dailyBudget;

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#9AC2FF', '#1B2F6D']}
        locations={[0, 0.75]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Sisa Jatah Hari Ini</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>{isOverspentToday ? `- Rp ${Math.abs(remainingDailyBudget).toLocaleString('id-ID')}` : `Rp ${Math.floor(remainingDailyBudget).toLocaleString('id-ID')}`}</Text>
        </View>

        {/* --- INDIKATOR SESUAI PERMINTAAN ANDA --- */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentageUsedToday}%`,

                backgroundColor: isOverspentToday ? '#F97316' : 'rgba(74, 42, 233, 1)',
              },
            ]}
          />
        </View>

        {isOverspentToday ? (
          <Text style={[styles.summaryText, styles.overspentText]}>Anda telah boros Rp {Math.abs(remainingDailyBudget).toLocaleString('id-ID')} dari jatah harian!</Text>
        ) : (
          <Text style={styles.summaryText}>
            Terpakai Rp {amountSpentToday.toLocaleString('id-ID')} dari Rp {Math.floor(dailyBudget).toLocaleString('id-ID')}
          </Text>
        )}
        {/* ------------------------------------ */}
      </LinearGradient>
    </View>
  );
};

// Style disesuaikan dengan permintaan
const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  balanceCard: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 20,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6, // Sedikit lebih tipis dari versi sebelumnya
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Background progress bar disesuaikan
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  summaryText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 4,
  },
  overspentText: {
    color: '#F97316', // Warna oranye sesuai permintaan
    fontWeight: 'bold',
  },
});

export default BalanceCard;
