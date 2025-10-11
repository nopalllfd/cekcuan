import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import CustomAlert from '../components/common/CustomAlert';
import BalanceCard from '../components/home/BalanceCard';
import TransactionAndCategoryModal from '../components/transaction/addModal/AddTransactionModal';
import UserHeader from '../components/home/UserHeader';
import AddTransactionButton from '../components/home/AddTransactionButton';
import TransactionSection from '../components/home/TransactionSection';
import { getTransactions, getCategories, addTransaction, getMonthlyIncome, getMonthlySpending, addMonthlyBudget, getMonthlyBudget, getDailySpending } from '../services/database';
import AddBudgetModal from '../components/wallet/AddBudgetModal';

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailySpending, setDailySpending] = useState(0);
  const [isTransactionModalVisible, setTransactionModalVisible] = useState(false);
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // --- 1. TAMBAHKAN STATE BARU UNTUK MENYIMPAN PENGELUARAN ---
  const [monthlySpending, setMonthlySpending] = useState(0);

  const fetchData = async () => {
    try {
      const totalIncome = await getMonthlyIncome();
      const totalSpending = await getMonthlySpending(); // Variabel ini hanya ada di sini
      const budget = await getMonthlyBudget();
      const allTransactions = await getTransactions();
      const allCategories = await getCategories();
      const todaySpending = await getDailySpending();

      setMonthlyIncome(totalIncome);
      setBalance(totalIncome - totalSpending);
      setMonthlyBudget(budget);
      setTransactions(allTransactions);
      setCategories(allCategories);
      setDailySpending(todaySpending);

      // --- 2. SIMPAN HASIL FETCH KE STATE ---
      setMonthlySpending(totalSpending);
    } catch (error) {
      console.error('Gagal memuat data:', error);
      Alert.alert('Error', 'Gagal memuat data.');
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
    async function loadFonts() {
      await Font.loadAsync({ 'Shoika-Regular': require('../assets/fonts/Shoika-Regular.ttf') });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };
  const handleSaveTransaction = async (amount, description, type, categoryId, details) => {
    try {
      await addTransaction(amount, description, type, categoryId, details);
      showAlert('Transaksi berhasil dicatat!', 'success');
      setTransactionModalVisible(false);
      await fetchData();
    } catch (error) {
      console.error('Gagal menambah transaksi:', error);
    }
  };
  const handleSaveBudget = async (amount) => {
    try {
      await addMonthlyBudget(amount);
      showAlert('Jatah bulanan berhasil diperbarui!', 'success');
      setBudgetModalVisible(false);
      await fetchData();
    } catch (error) {
      console.error('Gagal menambah budget:', error);
    }
  };
  const navigateToProfile = () => navigation.navigate('WalletScreen', { onDataUpdated: fetchData });
  const renderGradientBackground = () => (
    <View style={StyleSheet.absoluteFill}>
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
            y2="100%"
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

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        {renderGradientBackground()}
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
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
        backgroundColor="#010923"
        translucent={false}
      />
      <View style={styles.contentContainer}>
        <UserHeader
          onProfilePress={navigateToProfile}
          onNotificationPress={() => navigation.navigate('NotificationScreen')}
        />

        {/* --- 3. GUNAKAN STATE SAAT MENGIRIM PROP --- */}
        <BalanceCard
          balance={balance}
          dailySpending={dailySpending}
          budget={monthlyBudget}
        />

        <AddTransactionButton onPress={() => setTransactionModalVisible(true)} />

        <TransactionSection
          transactions={transactions.filter((tx) => tx && tx.type === 'pengeluaran')}
          navigation={navigation}
          sectionTitleStyle={{ fontFamily: 'Shoika-Regular' }}
        />

        <TransactionAndCategoryModal
          isVisible={isTransactionModalVisible}
          onClose={() => setTransactionModalVisible(false)}
          onSave={handleSaveTransaction}
          categories={categories.filter((cat) => cat.name !== 'Pemasukan' && cat.name !== 'Alokasi')}
          fetchData={fetchData}
        />
        <AddBudgetModal
          isVisible={isBudgetModalVisible}
          onClose={() => setBudgetModalVisible(false)}
          onSave={handleSaveBudget}
        />
        <CustomAlert
          message={alertMessage}
          type={alertType}
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  gradientContainer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  contentContainer: { flex: 1, backgroundColor: 'transparent', zIndex: 10, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#010923' },
});

export default HomeScreen;
