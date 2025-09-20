import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions, getCurrentBalance, getCategories, addTransaction, addCategory } from '../services/database';
import * as Font from 'expo-font';
import BalanceCard from '../components/home/BalanceCard';
import AddTransactionModal from '../components/transaction/AddTransactionModal';
import AddCategoryModal from '../components/category/AddCategoryModal';
import UserHeader from '../components/home/UserHeader';
import AddTransactionButton from '../components/home/AddTransactionButton';
import TransactionSection from '../components/home/TransactionSection';

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [initialBalance, setInitialBalance] = useState(100000);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const currentBalance = await getCurrentBalance();
      const allTransactions = await getTransactions();
      const spendingTransactions = allTransactions.filter((item) => item.type === 'pengeluaran');
      const allCategories = await getCategories();

      setBalance(currentBalance);
      setTransactions(spendingTransactions);
      setCategories(allCategories);
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

  const handleSaveTransaction = async (amount, description, type, categoryId, details) => {
    try {
      await addTransaction(amount, description, type, categoryId, null, details);
      Alert.alert('Sukses', 'Transaksi berhasil dicatat!');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mencatat transaksi.');
    }
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
      <UserHeader />
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
      <AddTransactionModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        onAddCategoryPress={() => {
          setModalVisible(false);
          setTimeout(() => {
            setAddCategoryModalVisible(true);
          }, 350);
        }}
      />
      <AddCategoryModal
        isVisible={isAddCategoryModalVisible}
        onClose={() => setAddCategoryModalVisible(false)}
        onSave={addCategory}
        onReturnToTransaction={() => {
          setAddCategoryModalVisible(false);
          setTimeout(() => {
            setModalVisible(true);
          }, 350);
        }}
        fetchData={fetchData}
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
