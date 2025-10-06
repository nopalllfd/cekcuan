import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions } from '../services/database';
import TransactionItem from '../components/transaction/TransactionItem';
import DateSelector from '../components/history/DateSelector';
// Import komponen SVG
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

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

  // --- Fungsi renderGradientBackground yang sama seperti HomeScreen ---
  const renderGradientBackground = () => (
    <View style={styles.gradientContainer}>
      <Svg
        height="100%"
        width="100%"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <LinearGradient
            id="grad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%" // This creates a top-to-bottom (180deg) gradient
          >
            <Stop
              offset="17.79%"
              stopColor="#010923"
            />
            <Stop
              offset="59.13%"
              stopColor="#9AC2FF"
            />
            <Stop
              offset="100%"
              stopColor="#010923"
            />
          </LinearGradient>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {renderGradientBackground()}
        <ActivityIndicator
          size="large"
          color="#FFFFFF" // Sesuaikan warna indicator agar terlihat di atas gradient
          style={{ zIndex: 10 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderGradientBackground()}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#010923" // Sesuaikan dengan warna paling gelap gradient
        translucent={false}
      />
      <View style={styles.contentContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Penting untuk penempatan gradient
    backgroundColor: 'transparent', // Ubah menjadi transparan
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // Pastikan gradient di paling bawah
  },
  contentContainer: {
    // Wrapper untuk semua konten di atas gradient
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1, // Pastikan konten di atas gradient
    paddingTop: 20, // Sesuaikan padding sesuai kebutuhan UI
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Ubah menjadi transparan
    position: 'relative',
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
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#ccc',
    fontSize: 16,
  },
});

export default HistoryScreen;
