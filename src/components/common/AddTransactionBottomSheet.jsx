import React, { useMemo, useState, forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from './Button';
import { addTransaction, getCategories, addCategory } from '../../services/database';
import { FlatList } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const iconOptions = ['silverware-fork-knife', 'shopping-outline', 'home-outline', 'car-sports', 'account-cash-outline', 'medical-bag', 'book-open-variant', 'food-outline', 'coffee-outline', 'cellphone', 'plane-train'];

const AddTransactionBottomSheet = forwardRef(({ onSave, categories, onAddCategory }, ref) => {
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [modalStep, setModalStep] = useState('category_select');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleSave = async () => {
    if (amount === '' || isNaN(parseFloat(amount))) {
      Alert.alert('Gagal', 'Harga harus diisi dengan angka.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Gagal', 'Silakan pilih kategori.');
      return;
    }
    if (description === '') {
      Alert.alert('Gagal', 'Nama pengeluaran harus diisi.');
      return;
    }

    try {
      await addTransaction(parseFloat(amount), description, 'pengeluaran', selectedCategoryId, null);
      Alert.alert('Sukses', 'Transaksi berhasil dicatat!');
      ref.current.close();
      onSave();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mencatat transaksi.');
    }
  };

  const renderContent = () => {
    if (modalStep === 'category_select') {
      const expenseCategories = categories.filter((cat) => ['Pemasukan', 'Pengeluaran', 'Tabungan'].indexOf(cat.name) === -1);
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.modalTitle}>Pilih Kategori</Text>
          <FlatList
            data={expenseCategories}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryGridButton}
                onPress={() => {
                  setSelectedCategoryId(item.id);
                  setModalStep('input_form');
                }}
              >
                <View style={styles.categoryIconContainer}>
                  <MaterialCommunityIcons
                    name={item.icon || 'help-circle-outline'}
                    size={24}
                    color="#8B5CF6"
                  />
                </View>
                <Text style={styles.categoryGridText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoryGridContainer}
          />
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => {
              ref.current.close();
              onAddCategory();
            }}
          >
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={30}
              color="#fff"
            />
            <Text style={styles.addCategoryText}>Tambah Kategori</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.modalTitle}>Masukkan Pengeluaran</Text>
        <Text style={styles.label}>Nama</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Nama..."
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
          />
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
        </View>
        <Text style={styles.label}>Harga</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan Harga..."
            placeholderTextColor="#888"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.inputCurrency}>$</Text>
        </View>
        <Button
          title="SIMPAN"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    );
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={{ backgroundColor: '#fff' }}
      enablePanDownToClose
      onClose={() => setModalStep('category_select')}
    >
      <BottomSheetView style={styles.sheetContainer}>{renderContent()}</BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sheetContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a40',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#404060',
    width: '100%',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  inputIcon: { marginLeft: 10 },
  inputCurrency: { color: '#888', fontSize: 18, marginLeft: 5 },
  saveButton: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#8B5CF6',
  },
  categoryGridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  categoryGridButton: {
    alignItems: 'center',
    margin: 8,
    width: (width - 40) / 4 - 16,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryGridText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    width: 60,
  },
  addCategoryButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  addCategoryText: {
    color: '#ffffff',
    marginTop: 5,
  },
});

export default AddTransactionBottomSheet;
