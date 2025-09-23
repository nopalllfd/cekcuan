import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions } from '../services/database';
import TransactionItem from '../components/transaction/TransactionItem';
import DateSelector from '../components/history/DateSelector';

const formatToShortDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const HistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = async () => {
    try {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  useEffect(() => {
    const formattedSelectedDate = formatToShortDate(selectedDate);
    const filtered = transactions.filter((transaction) => formatToShortDate(transaction.date) === formattedSelectedDate);
    setFilteredTransactions(filtered);
  }, [selectedDate, transactions]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderItem = ({ item }) => <TransactionItem transaction={item} />;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#8B5CF6"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a1a2e"
      />

      <DateSelector
        selectedDate={selectedDate}
        onSelectDate={handleDateChange}
      />

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
        <Ionicons
          name="time-outline"
          size={24}
          color="#ccc"
        />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Tidak ada transaksi pada tanggal ini.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Increased padding to prevent overlap with the bottom tab bar
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#ccc',
    fontSize: 16,
  },
});

export default HistoryScreen;
