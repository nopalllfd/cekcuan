import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { addMonthlyIncome, getMonthlyBudget, getMonthlyIncome } from '../services/database';

import { styles } from '../components/wallet/styles';
import AddIncomeModal from '../components/wallet/AddIncomeModal';
import IncomeCard from '../components/wallet/IncomeCard';
import BudgetCard from '../components/wallet/BudgetCard';
import SavingsSection from '../components/wallet/SavingSection';
import GradientBackground from '../components/wallet/GradientBackground';

const WalletScreen = ({ navigation }) => {
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadFinancialData = async () => {
        try {
          const fetchedBudget = await getMonthlyBudget();
          const fetchedIncome = await getMonthlyIncome();
          if (isMounted) {
            setBudget(fetchedBudget ?? 0);
            setIncome(fetchedIncome ?? 0);
          }
        } catch (error) {
          console.error('Gagal memuat data:', error);
          if (isMounted) {
            Alert.alert('Error', 'Gagal memuat data.');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      setIsLoading(true);
      loadFinancialData();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleSaveIncome = async (newIncomeAmount) => {
    try {
      const currentBudget = (await getMonthlyBudget()) ?? 0;
      if (newIncomeAmount < currentBudget) {
        Alert.alert('Peringatan', `Pemasukan baru lebih kecil dari anggaran saat ini. Harap sesuaikan anggaran Anda.`);
        return;
      }
      setIsLoading(true);
      await addMonthlyIncome(newIncomeAmount);
      setIncome(newIncomeAmount);
      Alert.alert('Berhasil', 'Pemasukan bulanan berhasil diperbarui.');
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan pemasukan.');
      console.error(error);
    } finally {
      setIncomeModalVisible(false);
      setIsLoading(false);
    }
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

  return (
    <View style={styles.flexContainer}>
      <GradientBackground />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="wallet"
            size={28}
            color="#fff"
          />
          <Text style={styles.title}>My Wallet</Text>
        </View>

        <IncomeCard income={income} />

        <TouchableOpacity
          style={styles.updateIncomeButton}
          onPress={() => setIncomeModalVisible(true)}
        >
          <Text style={styles.updateIncomeButtonText}>Tambah Pemasukan</Text>
          <Ionicons
            name="add-circle-outline"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <BudgetCard
          budget={budget}
          onUpdate={() => alert('Navigasi ke halaman Update Anggaran')}
        />

        <SavingsSection />
      </ScrollView>

      <AddIncomeModal
        isVisible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onSave={handleSaveIncome}
        navigation={navigation}
      />
    </View>
  );
};

export default WalletScreen;
