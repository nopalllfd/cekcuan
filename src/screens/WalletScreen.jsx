import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { addTransaction, addMonthlyBudget, getMonthlyBudget, getMonthlyIncome, getMonthlySpending, getMonthlySavings } from '../services/database';

import AddIncomeModal from '../components/wallet/AddIncomeModal';
import AddBudgetModal from '../components/wallet/AddBudgetModal';
import IncomeCard from '../components/wallet/IncomeCard';
import BudgetCard from '../components/wallet/BudgetCard';
import SavingsSection from '../components/wallet/SavingSection';
import GradientBackground from '../components/wallet/GradientBackground';

const WalletScreen = ({ navigation }) => {
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const [spending, setSpending] = useState(0);
  const [savings, setSavings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);

  const loadFinancialData = async () => {
    try {
      const [fetchedBudget, fetchedIncome, fetchedSpending, fetchedSavings] = await Promise.all([getMonthlyBudget(), getMonthlyIncome(), getMonthlySpending(), getMonthlySavings()]);
      setBudget(fetchedBudget ?? 0);
      setIncome(fetchedIncome ?? 0);
      setSpending(fetchedSpending ?? 0);
      setSavings(fetchedSavings ?? 0);
    } catch (error) {
      console.error('Gagal memuat data:', error);
      Alert.alert('Error', 'Gagal memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadFinancialData();
    }, [])
  );

  const handleSaveIncome = async (newIncomeAmount) => {
    try {
      setIsLoading(true);
      await addTransaction(newIncomeAmount, 'Pemasukan', 'pemasukan', 1);
      await loadFinancialData();
      Alert.alert('Berhasil', 'Pemasukan baru berhasil ditambahkan.');
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan pemasukan.');
    } finally {
      setIncomeModalVisible(false);
      setIsLoading(false);
    }
  };

  // --- PERUBAHAN UTAMA DI FUNGSI INI ---
  const handleSaveBudget = async (amountToAdd) => {
    const availableFunds = income - budget - savings;

    // 1. Lakukan validasi sebelum menyimpan
    if (amountToAdd > availableFunds) {
      Alert.alert('Dana Tidak Cukup', `Anda tidak bisa mengalokasikan Rp ${amountToAdd.toLocaleString('id-ID')} karena dana tersedia hanya Rp ${availableFunds.toLocaleString('id-ID')}.`);
      return; // 2. Hentikan proses jika dana tidak cukup
    }

    try {
      setIsLoading(true);
      // 3. Gunakan state 'budget' yang sudah ada, tidak perlu fetch lagi
      const newTotalBudget = budget + amountToAdd;
      await addMonthlyBudget(newTotalBudget);
      await loadFinancialData();
      Alert.alert('Berhasil', 'Jatah bulanan berhasil ditambahkan.');
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan jatah bulanan.');
      console.error(error);
    } finally {
      setBudgetModalVisible(false);
      setIsLoading(false);
    }
  };

  const availableFunds = income - budget - savings;

  if (isLoading) {
    /* ... kode loading ... */
  }

  return (
    <View style={styles.flexContainer}>
      <GradientBackground />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 5, marginRight: 5 }}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Alokasi Dana</Text>
        </View>

        <IncomeCard
          funds={availableFunds}
          navigation={navigation}
        />
        <TouchableOpacity
          style={styles.updateIncomeButton}
          onPress={() => setIncomeModalVisible(true)}
        >
          <Text style={styles.updateIncomeButtonText}>Tambah Modal (Pemasukan)</Text>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        <BudgetCard
          budget={budget}
          spending={spending}
          onUpdate={() => setBudgetModalVisible(true)}
        />
        <SavingsSection />
      </ScrollView>

      <AddIncomeModal
        isVisible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onSave={handleSaveIncome}
      />
      <AddBudgetModal
        isVisible={isBudgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSave={handleSaveBudget}
      />
    </View>
  );
};

// ... styles ...
const styles = StyleSheet.create({
  flexContainer: { flex: 1, backgroundColor: '#010923' },
  container: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  updateIncomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: -15,
    zIndex: -10,
    alignSelf: 'center',
    width: '90%',
  },
  updateIncomeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', lineHeight: 22 },
});

export default WalletScreen;
