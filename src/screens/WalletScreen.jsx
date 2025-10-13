import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { addTransaction, addMonthlyBudget, getMonthlyBudget, getMonthlyIncome, getMonthlySpending, getSaving, addSaving, addFundsToSaving, deleteSaving } from '../services/database';

import CustomAlert from '../components/common/CustomAlert';
import AddIncomeModal from '../components/wallet/AddIncomeModal';
import AddBudgetModal from '../components/wallet/AddBudgetModal';
import AddSavingModal from '../components/wallet/AddSavingModal';
import SavingDetailModal from '../components/wallet/SavingDetailModal';
import IncomeCard from '../components/wallet/IncomeCard';
import BudgetCard from '../components/wallet/BudgetCard';
import SavingsSection from '../components/wallet/SavingSection';
import GradientBackground from '../components/wallet/GradientBackground';

const WalletScreen = ({ navigation }) => {
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const [spending, setSpending] = useState(0);
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);
  const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);
  const [isSavingModalVisible, setSavingModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const loadFinancialData = async () => {
    try {
      const [fetchedBudget, fetchedIncome, fetchedSpending, fetchedSavingsData] = await Promise.all([getMonthlyBudget(), getMonthlyIncome(), getMonthlySpending(), getSaving()]);

      setBudget(fetchedBudget ?? 0);
      setIncome(fetchedIncome ?? 0);
      setSpending(fetchedSpending ?? 0);
      setSavings(fetchedSavingsData ?? []);
    } catch (error) {
      console.error('Gagal memuat data:', error);
      showAlert('Gagal memuat data.', 'error');
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

  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleSaveIncome = async (newIncomeAmount, description) => {
    try {
      setIsLoading(true);
      await addTransaction(newIncomeAmount, description, 'pemasukan', 1);
      await loadFinancialData();
      showAlert('Pemasukan baru berhasil ditambahkan.');
    } catch (error) {
      showAlert('Gagal menyimpan pemasukan.', 'error');
    } finally {
      setIncomeModalVisible(false);
      setIsLoading(false);
    }
  };

  const handleSelectSaving = (savingItem) => {
    setSelectedSaving(savingItem);
    setDetailModalVisible(true);
  };

  const handleSaveBudget = async (amountToAdd) => {
    const totalCurrentSavings = savings.reduce((sum, s) => sum + s.current, 0);
    const availableFunds = income - budget - totalCurrentSavings;

    if (amountToAdd > availableFunds) {
      showAlert(`Dana tersedia hanya Rp ${availableFunds.toLocaleString('id-ID')}.`, 'error');
      return;
    }

    try {
      setIsLoading(true);
      const newTotalBudget = budget + amountToAdd;
      await addMonthlyBudget(newTotalBudget);
      await addTransaction(amountToAdd, 'Alokasi ke Jatah Bulanan', 'alokasi', 6);
      await loadFinancialData();
      showAlert('Jatah bulanan berhasil ditambahkan.');
    } catch (error) {
      showAlert('Gagal menyimpan jatah bulanan.', 'error');
    } finally {
      setBudgetModalVisible(false);
      setIsLoading(false);
    }
  };

  const handleSaveSaving = async (name, target) => {
    try {
      await addSaving(name, target);
      showAlert('Target tabungan baru berhasil dibuat.');
      await loadFinancialData();
    } catch (error) {
      showAlert('Gagal membuat target tabungan.', 'error');
    }
  };

  const handleDeleteSaving = async (savingId) => {
    try {
      await deleteSaving(savingId);
      showAlert('Target tabungan telah dihapus.');
      await loadFinancialData();
    } catch (error) {
      showAlert('Gagal menghapus target tabungan.', 'error');
    }
  };

  const handleAddToSaving = async (savingId, amountToAdd, savingName, source) => {
    if (source === 'pemasukan') {
      const totalCurrentSavings = savings.reduce((sum, s) => sum + s.current, 0);
      const availableFunds = income - budget - totalCurrentSavings;
      if (amountToAdd > availableFunds) {
        showAlert(`Dana tersedia hanya Rp ${availableFunds.toLocaleString('id-ID')}.`, 'error');
        return;
      }
    }
    try {
      await addFundsToSaving(savingId, amountToAdd, savingName, source);
      showAlert('Dana berhasil ditambahkan ke tabungan.');
      await loadFinancialData();
    } catch (error) {
      showAlert('Gagal menambah dana ke tabungan.', 'error');
    }
  };

  const totalCurrentSavings = savings.reduce((sum, s) => sum + s.current, 0);
  const availableFunds = income - budget - totalCurrentSavings;

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

        <SavingsSection
          savings={[...savings].reverse()}
          onAddSaving={() => setSavingModalVisible(true)}
          navigation={navigation}
          onSelectSaving={handleSelectSaving}
        />
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
      <AddSavingModal
        isVisible={isSavingModalVisible}
        onClose={() => setSavingModalVisible(false)}
        onSave={handleSaveSaving}
      />
      <SavingDetailModal
        isVisible={isDetailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        onSave={handleAddToSaving}
        onDelete={handleDeleteSaving}
        savingItem={selectedSaving}
      />
      <CustomAlert
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: { flex: 1, backgroundColor: '#010923' },
  container: { padding: 20, paddingBottom: 100, marginTop: 24 },
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: -10,
    alignSelf: 'center',
    width: '100%',
  },
  updateIncomeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', lineHeight: 22 },
});

export default WalletScreen;
