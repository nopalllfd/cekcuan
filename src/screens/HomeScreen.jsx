import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, StatusBar, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';
// Import LinearGradient instead of RadialGradient
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import CustomAlert from '../components/common/CustomAlert';
import BalanceCard from '../components/home/BalanceCard';
import TransactionAndCategoryModal from '../components/transaction/addModal/AddTransactionModal';
import UserHeader from '../components/home/UserHeader';
import AddTransactionButton from '../components/home/AddTransactionButton';
import TransactionSection from '../components/home/TransactionSection';
import { getTransactions, getCategories, addTransaction, addCategory, getMonthlyBudget } from '../services/database';

const { width, height } = Dimensions.get('window');

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
      const monthlyBudget = await getMonthlyBudget();
      const allTransactions = await getTransactions();
      const allCategories = await getCategories();

      const totalSpending = allTransactions.reduce((sum, transaction) => {
        if (transaction.type.toLowerCase() === 'pengeluaran') {
          return sum + transaction.amount;
        }
        return sum;
      }, 0);

      const currentBalance = (monthlyBudget || 0) - totalSpending;

      setInitialBalance(monthlyBudget || 0);
      setBalance(currentBalance);
      setTransactions(allTransactions);
      setCategories(allCategories);
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

  // --- MODIFIED GRADIENT FUNCTION ---
  const renderGradientBackground = () => (
    <View style={styles.gradientContainer}>
      <Svg
        height="100%"
        width="100%"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          {/* Replaced RadialGradient with LinearGradient */}
          <LinearGradient
            id="grad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%" // This creates a top-to-bottom (180deg) gradient
          >
            {/* Mapped the CSS percentages and colors to Stop components */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 10,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010923',
  },
});

export default HomeScreen;
