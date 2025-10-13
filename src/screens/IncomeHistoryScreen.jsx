import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions } from '../services/database';
import TransactionItem from '../components/transaction/TransactionItem';
import GradientBackground from '../components/wallet/GradientBackground';

// Helper function untuk mengubah nama bulan menjadi angka (untuk sorting)
function getMonthNumber(monthName) {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const idx = months.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());
  return idx === -1 ? '01' : String(idx + 1).padStart(2, '0');
}

// Helper function untuk mengelompokkan transaksi per bulan
function groupByMonth(transactions) {
  const groups = {};
  transactions.forEach((tx) => {
    if (!tx || !tx.date) return;
    const dateObj = new Date(tx.date);
    const month = dateObj.toLocaleString('id-ID', { month: 'long' });
    const year = dateObj.getFullYear();
    const key = `${month} ${year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  // Mengurutkan grup bulan dari yang terbaru ke terlama
  return Object.entries(groups)
    .sort((a, b) => {
      const [monthA, yearA] = a[0].split(' ');
      const [monthB, yearB] = b[0].split(' ');
      const dateA = new Date(`${yearA}-${getMonthNumber(monthA)}-01`);
      const dateB = new Date(`${yearB}-${getMonthNumber(monthB)}-01`);
      return dateB - dateA;
    })
    .map(([title, data]) => ({ title, data }));
}

const IncomeHistoryScreen = ({ navigation }) => {
  const [months, setMonths] = useState([]);
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const monthListRef = useRef(null); // Ref untuk FlatList bulan

  const loadData = async () => {
    try {
      const allTransactions = await getTransactions();
      const filtered = allTransactions.filter((tx) => tx && tx.type && tx.type.toLowerCase() === 'pemasukan');
      const grouped = groupByMonth(filtered);
      setMonths(grouped);
      setCurrentMonthIdx(0); // Selalu mulai dari bulan terbaru
    } catch (error) {
      console.error('Gagal memuat riwayat pemasukan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadData();
    }, [])
  );

  // Efek untuk auto-scroll ke bulan yang dipilih
  useEffect(() => {
    if (monthListRef.current && months.length > 0 && currentMonthIdx < months.length) {
      monthListRef.current.scrollToIndex({
        index: currentMonthIdx,
        animated: true,
        viewPosition: 0.5, // 0.5 akan mencoba menempatkan item di tengah
      });
    }
  }, [currentMonthIdx]);

  // Fungsi untuk merender setiap tombol bulan
  const renderMonthItem = ({ item, index }) => {
    const isSelected = index === currentMonthIdx;
    return (
      <TouchableOpacity
        style={[styles.monthButton, isSelected && styles.monthButtonSelected]}
        onPress={() => setCurrentMonthIdx(index)}
      >
        <Text style={styles.monthButtonText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.flexContainer}>
        <GradientBackground />
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  const currentMonth = months[currentMonthIdx];

  return (
    <View style={styles.flexContainer}>
      <GradientBackground />
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Riwayat Pemasukan</Text>
      </View>

      {/* Daftar Bulan yang Bisa Di-scroll */}
      <View style={styles.monthSelectorContainer}>
        <FlatList
          ref={monthListRef}
          data={months}
          renderItem={renderMonthItem}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthList}
          getItemLayout={(data, index) => ({
            length: 150, // Perkiraan lebar satu item + margin
            offset: 150 * index,
            index,
          })}
        />
      </View>

      {/* Daftar Transaksi untuk Bulan yang Dipilih */}
      <FlatList
        data={currentMonth ? currentMonth.data : []}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada riwayat pemasukan bulan ini.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: { flex: 1, backgroundColor: '#010923' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: 50, paddingBottom: 15 },
  backButton: { padding: 5 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginLeft: 15 },
  monthSelectorContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  monthList: {
    paddingHorizontal: 10,
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 5,
    justifyContent: 'center',
    height: 40,
  },
  monthButtonSelected: {
    backgroundColor: '#9AC2FF',
  },
  monthButtonText: {
    color: '#010923',
    fontWeight: '600',
  },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 },
});

export default IncomeHistoryScreen;
