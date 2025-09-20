import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const BalanceCard = ({ balance, initialBalance }) => {
  const navigation = useNavigation();

  // Perhitungan persentase penggunaan saldo
  const usedAmount = initialBalance - balance;
  const percentageUsed = Math.min(100, Math.max(0, (usedAmount / initialBalance) * 100));

  // Format date as string
  const dateString = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <LinearGradient
      colors={['#66418eff', '#7059e3ff', '#7947c5ff', '#b97836b2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <Text style={styles.balanceLabel}>Jatah uang anda hari ini</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceText}>Rp. {balance.toLocaleString('id-ID')}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${percentageUsed}%`,
              backgroundColor: percentageUsed >= 100 ? '#ff8a60ff' : '#a486c4ff',
            },
          ]}
        />
      </View>
      {balance >= 0 ? (
        <Text style={styles.textWhite}>Jatah anda masih tersisa Rp. {balance.toLocaleString('id-ID')}</Text>
      ) : (
        <Text style={[styles.textWhite, styles.overspentText]}>Jatah anda terlewat Rp. {Math.abs(balance).toLocaleString('id-ID')}</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    margin: 20,
    marginTop: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 10,
    marginTop: 10,
  },
  balanceText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textWhite: {
    color: '#efefefff',
    fontSize: 12,
    marginTop: 5,
  },
  arrow: {
    color: '#ffffff',
    fontSize: 20,
  },
  date: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.8,
  },
});

export default BalanceCard;
