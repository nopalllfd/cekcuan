import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles'; // Pastikan path styles Anda benar

const AddIncomeModal = ({ isVisible, onClose, onSave, navigation }) => {
  const [amount, setAmount] = useState('');

  // --- PERUBAHAN 1 ---
  // Fungsi untuk memformat angka menjadi format dengan titik, cth: '5.000.000'
  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // --- PERUBAHAN 2 ---
  // Fungsi untuk membersihkan input dari titik sebelum disimpan ke state
  const handleAmountChange = (text) => {
    const cleanText = text.replace(/\./g, '');
    if (!isNaN(cleanText)) {
      setAmount(cleanText);
    }
  };

  const handleSave = () => {
    // Fungsi ini tidak perlu diubah karena 'amount' sudah dalam format angka murni
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Input Tidak Valid', 'Silakan masukkan jumlah pemasukan yang benar.');
      return;
    }
    onSave(Number(amount));
    setAmount('');
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Pemasukan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={26}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalLabel}>Jumlah Pemasukan Bulanan</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., 5.000.000"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            // --- PERUBAHAN 3 ---
            value={formatNumber(amount)} // Tampilkan nilai yang diformat
            onChangeText={handleAmountChange} // Simpan nilai yang bersih
            autoFocus={true}
          />

          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={handleSave}
          >
            <Text style={styles.modalSaveButtonText}>Simpan Pemasukan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default React.memo(AddIncomeModal);
