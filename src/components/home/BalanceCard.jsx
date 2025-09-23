import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const BalanceCard = ({ balance, initialBalance }) => {
  const navigation = useNavigation();

  const usedAmount = initialBalance - balance;
  const percentageUsed = initialBalance > 0 ? Math.min(100, Math.max(0, (usedAmount / initialBalance) * 100)) : 0;

  return (
    <LinearGradient
      colors={['#66418eff', '#7059e3ff', '#7947c5ff', '#b97836b2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <Text style={styles.balanceLabel}>Sisa Saldo Anda Saat Ini</Text>
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
        <Text style={styles.textWhite}>
          Anda telah menggunakan Rp. {usedAmount.toLocaleString('id-ID')} dari total pemasukan Rp. {initialBalance.toLocaleString('id-ID')}
        </Text>
      ) : (
        <Text style={[styles.textWhite, styles.overspentText]}>
          Anda telah mengeluarkan Rp. {Math.abs(usedAmount).toLocaleString('id-ID')} lebih banyak dari total pemasukan Rp. {initialBalance.toLocaleString('id-ID')}
        </Text>
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
  overspentText: {
    color: '#ff8a60ff',
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
