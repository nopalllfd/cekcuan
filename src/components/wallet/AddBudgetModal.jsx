import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { width: '90%', backgroundColor: '#1f2937', borderRadius: 12, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: '#f9fafb', fontSize: 18, fontWeight: 'bold' },
  modalLabel: { color: '#d1d5db', fontSize: 14, marginBottom: 8 },
  modalInput: { backgroundColor: '#374151', color: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
  modalSaveButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center' },
  modalSaveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

const AddBudgetModal = ({ isVisible, onClose, onSave }) => {
  const [amount, setAmount] = useState('');

  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text) => {
    const cleanText = text.replace(/\./g, '');
    if (!isNaN(cleanText)) {
      setAmount(cleanText);
    }
  };

  const handleSave = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
      Alert.alert('Input Tidak Valid', 'Silakan masukkan jumlah jatah yang benar.');
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
            <Text style={styles.modalTitle}>Tambah Jatah Bulanan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={26}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalLabel}>Jumlah Jatah Pengeluaran Bulanan</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., 3.000.000"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={formatNumber(amount)}
            onChangeText={handleAmountChange}
            autoFocus={true}
          />
          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={handleSave}
          >
            <Text style={styles.modalSaveButtonText}>Simpan Jatah</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default React.memo(AddBudgetModal);
