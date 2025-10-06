import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BalanceCard = ({ balance, initialBalance }) => {
  const usedAmount = initialBalance - balance;
  const percentageUsed = initialBalance > 0 ? Math.min(100, Math.max(0, (usedAmount / initialBalance) * 100)) : 0;
  const isOverspent = balance < 0;

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        // Updated gradient colors and locations based on your request
        colors={['#9AC2FF', '#1B2F6D']}
        locations={[0, 0.75]} // Corresponds to -16.59% and 74.84% stops
        start={{ x: 0.5, y: 0 }} // Starts at the top
        end={{ x: 0.5, y: 1 }} // Ends at the bottom (approx. 182 degrees)
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Sisa Saldo Anda</Text>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>Rp {balance.toLocaleString('id-ID')}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentageUsed}%`,
                backgroundColor: percentageUsed >= 100 ? '#F97316' : 'rgba(74, 42, 233, 1)',
              },
            ]}
          />
        </View>

        {isOverspent ? (
          <Text style={[styles.summaryText, styles.overspentText]}>Anda telah boros Rp {Math.abs(balance).toLocaleString('id-ID')} dari budget!</Text>
        ) : (
          <Text style={styles.summaryText}>
            Terpakai Rp {usedAmount.toLocaleString('id-ID')} dari Rp {initialBalance.toLocaleString('id-ID')}
          </Text>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    // Shadow for depth (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for depth (Android)
    elevation: 10,
  },
  balanceCard: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 20,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    color: '#F97316',
    fontWeight: 'bold',
  },
});

export default BalanceCard;
