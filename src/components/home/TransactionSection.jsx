import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TransactionItem from '../transaction/TransactionItem';

const TransactionSection = ({ transactions, navigation, sectionTitleStyle }) => {
  const renderItem = ({ item }) => <TransactionItem transaction={item} />;

  // Dapatkan tanggal hari ini tanpa waktu
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter transaksi yang tanggalnya sama dengan hari ini
  const todaysTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date); // Asumsikan 'date' adalah properti di objek transaksi
    transactionDate.setHours(0, 0, 0, 0);
    return transactionDate.getTime() === today.getTime();
  });

  return (
    <View style={styles.transactionsSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, sectionTitleStyle]}>Pengeluaran Hari Ini</Text>
        <View style={styles.historyButton}>
          <TouchableOpacity
            style={styles.historyLink}
            onPress={() => navigation.navigate('Riwayat')}
          >
            <Text style={styles.historyText}>Lihat History ›</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={todaysTransactions} // Ganti dengan data yang sudah difilter
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Belum ada pengeluaran hari ini. Tambahkan yang pertama!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionsList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#ccc',
  },
  historyText: {
    color: '#ffffff',
    fontSize: 12,
    marginRight: 5,
    marginTop: 4,
    marginBottom: 15,
  },
  historyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default TransactionSection;
