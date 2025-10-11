import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { addTransaction, addMonthlyBudget, getMonthlyBudget, getMonthlyIncome, getMonthlySpending, getSaving, addSaving, migrateSavingsTable, addFundsToSaving, deleteSaving } from '../services/database';
import AddIncomeModal from '../components/wallet/AddIncomeModal';
import AddBudgetModal from '../components/wallet/AddBudgetModal';
import AddSavingModal from '../components/wallet/AddSavingModal';
import IncomeCard from '../components/wallet/IncomeCard';
import BudgetCard from '../components/wallet/BudgetCard';
import SavingsSection from '../components/wallet/SavingSection';
import GradientBackground from '../components/wallet/GradientBackground';
import SavingDetailModal from '../components/wallet/SavingDetailModal';

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

  const loadFinancialData = async () => {
    try {
      const [fetchedBudget, fetchedIncome, fetchedSpending, fetchedSavingsData] = await Promise.all([getMonthlyBudget(), getMonthlyIncome(), getMonthlySpending(), getSaving()]);

      setBudget(fetchedBudget ?? 0);
      setIncome(fetchedIncome ?? 0);
      setSpending(fetchedSpending ?? 0);
      setSavings(fetchedSavingsData ?? []);
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
      console.log('Savings:', savings);
      setIsLoading(true);
      await addTransaction(newIncomeAmount, 'Pemasukan', 'pemasukan', 1);
      Alert.alert('Berhasil', 'Pemasukan baru berhasil ditambahkan.');
      loadFinancialData();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan pemasukan.');
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
  const handleSaveSaving = async (name, target, bgColor) => {
    try {
      await addSaving(name, target, bgColor);
      Alert.alert('Berhasil', 'Target tabungan baru berhasil dibuat.');
      await loadFinancialData();
      console.log('Savings:', savings);
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat target tabungan.');
    }
  };

  const handleDeleteSaving = async (savingId) => {
    try {
      await deleteSaving(savingId);
      Alert.alert('Berhasil', 'Target tabungan telah dihapus.');
      await loadFinancialData(); // Muat ulang data untuk update UI
    } catch (error) {
      Alert.alert('Error', 'Gagal menghapus target tabungan.');
    }
  };

  const handleAddToSaving = async (savingId, amountToAdd, savingName, source) => {
    try {
      // Validasi hanya dilakukan jika sumber dana dari pemasukan internal
      if (source === 'pemasukan') {
        const availableFunds = income - budget - savings;
        if (amountToAdd > availableFunds) {
          Alert.alert('Dana Tidak Cukup', 'Jumlah yang ingin ditabung melebihi dana tersedia.');
          return; // Hentikan proses jika dana tidak cukup
        }
      }

      // Panggil fungsi database dengan argumen 'source'
      await addFundsToSaving(savingId, amountToAdd, savingName, source);

      Alert.alert('Berhasil', 'Dana berhasil ditambahkan ke tabungan.');
      await loadFinancialData(); // Muat ulang semua data
    } catch (error) {
      Alert.alert('Error', 'Gagal menambah dana ke tabungan.');
    }
  };

  const availableFunds = income - budget - savings.reduce((sum, s) => sum + s.current, 0);

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
        <View style={styles.header}></View>

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
          onSelect={handleSelectSaving}
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
