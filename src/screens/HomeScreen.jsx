import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';
import CustomAlert from '../components/common/CustomAlert';
import BalanceCard from '../components/home/BalanceCard';
import TransactionAndCategoryModal from '../components/transaction/AddTransactionModal'; // Import komponen gabungan
import UserHeader from '../components/home/UserHeader';
import AddTransactionButton from '../components/home/AddTransactionButton';
import TransactionSection from '../components/home/TransactionSection';
import { getTransactions, getCategories, addTransaction, addCategory, getMonthlyIncome, getMonthlySpending, getMonthlyBudget } from '../services/database';

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [initialBalance, setInitialBalance] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const fetchData = async () => {
    try {
      const monthlyBudget = await getMonthlyBudget(); // Ambil anggaran bulanan
      const allTransactions = await getTransactions();
      const allCategories = await getCategories();

      // Hitung total spending dari transaksi
      const totalSpending = allTransactions.reduce((sum, transaction) => {
        if (transaction.type.toLowerCase() === 'pengeluaran') {
          return sum + transaction.amount;
        }
        return sum;
      }, 0);

      // Saldo = Anggaran - Total Pengeluaran
      const currentBalance = (monthlyBudget || 0) - totalSpending;

      setInitialBalance(monthlyBudget || 0); // Set initial balance ke anggaran bulanan
      setBalance(currentBalance);
      setTransactions(allTransactions);
      setCategories(allCategories);

      // Debug log
      console.log('Monthly Budget:', monthlyBudget);
      console.log('Total Spending:', totalSpending);
      console.log('Current Balance:', currentBalance);
    } catch (error) {
      console.error('Gagal memuat data:', error);
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
    async function loadResources() {
      try {
        await Font.loadAsync({
          'Shoika-Regular': require('../assets/fonts/Shoika-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }
    loadResources();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const ShowAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleSaveTransaction = async (amount, description, type, categoryId, details) => {
    try {
      await addTransaction(amount, description, type, categoryId, null, details);
      ShowAlert('Transaksi berhasil dicatat!', 'success');
      setModalVisible(false);
      await fetchData();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mencatat transaksi.');
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('WalletScreen', { onDataUpdated: fetchData });
  };

  if (!fontsLoaded || loading) {
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
      <UserHeader
        onProfilePress={navigateToProfile}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
      />
      <BalanceCard
        balance={balance}
        initialBalance={initialBalance}
      />
      <AddTransactionButton onPress={handleOpenModal} />
      <TransactionSection
        transactions={transactions}
        navigation={navigation}
        sectionTitleStyle={{ fontFamily: 'Shoika-Regular' }}
      />
      {/* Menggunakan satu komponen modal saja */}
      <TransactionAndCategoryModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        fetchData={fetchData}
      />
      <CustomAlert
        message={alertMessage}
        type={alertType}
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
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
});

export default HomeScreen;
