import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TransactionItem = ({ transaction }) => {
  if (!transaction) {
    return null;
  }

  const isExpense = transaction.type === 'pengeluaran';
  const amountColor = isExpense ? '#FFB86E' : '#64F8B3';

  const defaultIcon = 'help-circle-outline';
  const iconName = transaction.category_icon || defaultIcon;

  // Mengambil waktu transaksi dalam format HH:mm dari properti 'date'
  const transactionTime = transaction.date ? new Date(transaction.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <View style={styles.container}>
      {/* Konten Kiri: Icon, Jumlah, dan Deskripsi */}
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color="#fff"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.amount, { color: amountColor }]}>- Rp {transaction.amount.toLocaleString('id-ID')}</Text>
          <Text style={styles.description}>{transaction.description}</Text>
        </View>
      </View>

      {/* Konten Kanan: Waktu */}
      <View style={styles.rightContent}>
        <Text style={styles.transactionTime}>{transactionTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 9,
    borderRadius: 8,
    backgroundColor: '#663fc1f1',
    marginBottom: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
  },
  transactionTime: {
    fontSize: 18,
    color: '#f9f9f9ff',
  },
});

export default TransactionItem;
