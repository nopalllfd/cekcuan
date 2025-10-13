import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TransactionItem = ({ transaction }) => {
  // Menggunakan 'item' agar sesuai standar FlatList
  if (!transaction || !transaction.type) {
    return null;
  }

  // --- PERUBAHAN LOGIKA DI SINI ---
  let amountColor, sign;

  if (transaction.type === 'pemasukan') {
    amountColor = '#64F8B3'; // Warna hijau dari kode Anda
    sign = '+';
  } else if (transaction.type === 'pengeluaran') {
    amountColor = '#ffffffff'; // Warna putih dari kode Anda
    sign = '-';
  } else {
    // Ini akan menangani tipe 'alokasi'
    amountColor = '#abc9f8ff'; // Warna biru netral untuk alokasi
    sign = '';
  }

  const defaultIcon = 'help-circle-outline';
  const loopIcon = 'loop';
  const iconName = transaction.category_icon || 'autorenew';

  const transactionTime = transaction.date ? new Date(transaction.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={amountColor}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {/* Menggunakan variabel 'sign' yang dinamis */}
            {sign} Rp {transaction.amount.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.description}>{transaction.description}</Text>
        </View>
      </View>

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
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: '#65656545',
    marginBottom: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
    color: '#009688',
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
