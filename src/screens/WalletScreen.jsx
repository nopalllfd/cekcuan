import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { addMonthlyBudget, getMonthlyBudget, addMonthlyIncome, getMonthlyIncome } from '../services/database';

const WalletScreen = ({ navigation, route }) => {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(0);

  const onDataUpdated = route.params?.onDataUpdated;

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);
      const budget = await getMonthlyBudget();
      const income = await getMonthlyIncome();

      if (budget !== null) {
        setBudgetAmount(budget.toString());
      }
      if (income !== null) {
        setIncomeAmount(income.toString());
        setCurrentIncome(income);
      }
    } catch (error) {
      console.error('Gagal memuat data keuangan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    if (!budgetAmount || isNaN(Number(budgetAmount))) {
      Alert.alert('Error', 'Silakan masukkan jumlah anggaran yang valid.');
      return;
    }

    const budgetValue = Number(budgetAmount);

    if (budgetValue > currentIncome) {
      Alert.alert(
        'Peringatan',
        `Anggaran tidak boleh lebih dari pemasukan bulanan!\n\nPemasukan Anda: Rp. ${currentIncome.toLocaleString('id-ID')}\nAnggaran yang diinput: Rp. ${budgetValue.toLocaleString('id-ID')}\n\nSilakan sesuaikan anggaran Anda.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (budgetValue <= 0) {
      Alert.alert('Error', 'Anggaran harus lebih dari 0.');
      return;
    }

    try {
      setIsLoading(true);
      await addMonthlyBudget(budgetValue);
      Alert.alert('Berhasil', `Anggaran bulanan berhasil disimpan!\n\nAnggaran: Rp. ${budgetValue.toLocaleString('id-ID')}\nSisa dari pemasukan: Rp. ${(currentIncome - budgetValue).toLocaleString('id-ID')}`);

      if (onDataUpdated) {
        onDataUpdated();
      }
    } catch (error) {
      console.error('Gagal menyimpan anggaran bulanan:', error);
      Alert.alert('Error', 'Gagal menyimpan anggaran.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIncome = async () => {
    if (!incomeAmount || isNaN(Number(incomeAmount))) {
      Alert.alert('Error', 'Silakan masukkan jumlah pemasukan yang valid.');
      return;
    }

    const incomeValue = Number(incomeAmount);

    if (incomeValue <= 0) {
      Alert.alert('Error', 'Pemasukan harus lebih dari 0.');
      return;
    }

    const currentBudget = await getMonthlyBudget();

    if (currentBudget && incomeValue < currentBudget) {
      Alert.alert(
        'Peringatan',
        `Pemasukan baru (Rp. ${incomeValue.toLocaleString('id-ID')}) lebih kecil dari anggaran yang sudah diset (Rp. ${currentBudget.toLocaleString(
          'id-ID'
        )}).\n\nAnda perlu mengubah anggaran terlebih dahulu agar sesuai dengan pemasukan baru.`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Lanjutkan & Reset Anggaran',
            onPress: async () => {
              try {
                setIsLoading(true);
                await addMonthlyIncome(incomeValue);
                await addMonthlyBudget(incomeValue);
                setCurrentIncome(incomeValue);
                setBudgetAmount(incomeValue.toString());
                Alert.alert('Berhasil', `Pemasukan berhasil disimpan dan anggaran otomatis disesuaikan menjadi Rp. ${incomeValue.toLocaleString('id-ID')}.`);
                if (onDataUpdated) onDataUpdated();
              } catch (error) {
                console.error('Gagal menyimpan:', error);
                Alert.alert('Error', 'Gagal menyimpan data.');
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
      return;
    }

    try {
      setIsLoading(true);
      await addMonthlyIncome(incomeValue);
      setCurrentIncome(incomeValue);
      Alert.alert('Berhasil', `Pemasukan bulanan berhasil disimpan!\n\nPemasukan: Rp. ${incomeValue.toLocaleString('id-ID')}`);

      if (onDataUpdated) {
        onDataUpdated();
      }
    } catch (error) {
      console.error('Gagal menyimpan pemasukan bulanan:', error);
      Alert.alert('Error', 'Gagal menyimpan pemasukan.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestBudget = () => {
    if (currentIncome > 0) {
      const suggested = Math.floor(currentIncome * 0.8);
      setBudgetAmount(suggested.toString());
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flexContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Atur Keuangan Bulanan Anda</Text>
        <Text style={styles.subText}>Tetapkan pemasukan dan anggaran Anda untuk bulan ini.</Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#a486c4ff"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            {/* Bagian Pemasukan dengan Card Component */}
            <Card
              title="Total Pemasukan"
              value={currentIncome}
              color="#0E9F6E"
            >
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 5000000"
                value={incomeAmount}
                onChangeText={setIncomeAmount}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={[styles.saveButton, styles.buttonIncome]}
                onPress={handleSaveIncome}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>Simpan Pemasukan</Text>
              </TouchableOpacity>
            </Card>

            <View style={{ height: 30 }} />

            {/* Bagian Anggaran dengan Card Component */}
            <Card
              title="Jumlah Anggaran"
              value={Number(budgetAmount) || 0}
              color="#F59E0B"
            >
              <View style={styles.labelRow}>
                <Text style={styles.label}>Jumlah Anggaran (IDR)</Text>
                {currentIncome > 0 && (
                  <TouchableOpacity
                    onPress={suggestBudget}
                    style={styles.suggestionButton}
                  >
                    <Text style={styles.suggestionText}>Saran: 80%</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 3000000"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                placeholderTextColor="#aaa"
              />
              {currentIncome > 0 && <Text style={styles.maxBudgetText}>Maksimal anggaran: Rp. {currentIncome.toLocaleString('id-ID')}</Text>}
              <TouchableOpacity
                style={[styles.saveButton, styles.buttonBudget, currentIncome === 0 && styles.disabledButton]}
                onPress={handleSaveBudget}
                disabled={isLoading || currentIncome === 0}
              >
                <Text style={styles.saveButtonText}>Simpan Anggaran</Text>
              </TouchableOpacity>
              {currentIncome === 0 && <Text style={styles.warningText}>* Silakan set pemasukan terlebih dahulu sebelum mengatur anggaran</Text>}
            </Card>
          </>
        )}

        <Text style={styles.infoText}>Catatan: Anggaran tidak boleh melebihi pemasukan bulanan Anda.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Card = ({ title, value, color, children }) => {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>Rp. {value.toLocaleString('id-ID')}</Text>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#2e2e4a',
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContent: {
    marginTop: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#ccc',
  },
  suggestionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4a4a6e',
  },
  maxBudgetText: {
    color: '#a486c4ff',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonIncome: {
    backgroundColor: '#0E9F6E',
  },
  buttonBudget: {
    backgroundColor: '#F59E0B',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  warningText: {
    color: '#ff8a60ff',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default WalletScreen;
