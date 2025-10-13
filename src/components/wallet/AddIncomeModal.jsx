import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddIncomeModal = ({ isVisible, onClose, onSave, navigation }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Gaji');
  const [customSource, setCustomSource] = useState(''); // Untuk input 'Lainnya'

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
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Input Tidak Valid', 'Silakan masukkan jumlah pemasukan yang benar.');
      return;
    }

    // Tentukan deskripsi final berdasarkan pilihan sumber
    let finalDescription = source;
    if (source === 'Lainnya') {
      if (!customSource.trim()) {
        Alert.alert('Input Tidak Valid', 'Silakan isi sumber pemasukan lainnya.');
        return;
      }
      finalDescription = customSource.trim();
    }

    // Kirim jumlah dan deskripsi sumbernya
    onSave(Number(amount), finalDescription);

    // Reset semua state ke awal
    setAmount('');
    setSource('Gaji');
    setCustomSource('');
    onClose();
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
            <Text style={styles.modalTitle}>Tambah Pemasukan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={26}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>Jumlah Pemasukan</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., 5.000.000"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={formatNumber(amount)}
            onChangeText={handleAmountChange}
            autoFocus={true}
          />

          {/* --- FITUR BARU: PILIHAN SUMBER DANA --- */}
          <Text style={styles.modalLabel}>Sumber Pemasukan</Text>
          <View style={styles.sourceContainer}>
            <TouchableOpacity
              style={[styles.sourceButton, source === 'Gaji' && styles.sourceButtonActive]}
              onPress={() => setSource('Gaji')}
            >
              <Text style={[styles.sourceButtonText, source === 'Gaji' && styles.sourceButtonTextActive]}>Gaji</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sourceButton, source === 'Bonus' && styles.sourceButtonActive]}
              onPress={() => setSource('Bonus')}
            >
              <Text style={[styles.sourceButtonText, source === 'Bonus' && styles.sourceButtonTextActive]}>Bonus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sourceButton, source === 'Lainnya' && styles.sourceButtonActive]}
              onPress={() => setSource('Lainnya')}
            >
              <Text style={[styles.sourceButtonText, source === 'Lainnya' && styles.sourceButtonTextActive]}>Lainnya</Text>
            </TouchableOpacity>
          </View>

          {/* Input teks akan muncul jika 'Lainnya' dipilih */}
          {source === 'Lainnya' && (
            <TextInput
              style={[styles.modalInput, { marginTop: 10 }]}
              placeholder="Tulis sumber pemasukan..."
              placeholderTextColor="#6b7280"
              value={customSource}
              onChangeText={setCustomSource}
            />
          )}

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

// Style diperbarui untuk mendukung fitur baru
const styles = StyleSheet.create({
  sourceContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  sourceButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#374151', alignItems: 'center' },
  sourceButtonActive: { backgroundColor: '#3b82f6', borderColor: '#6c6c6cff' },
  sourceButtonText: { color: '#d1d5db' },
  sourceButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { width: '90%', backgroundColor: '#1f2937', borderRadius: 12, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: '#f9fafb', fontSize: 18, fontWeight: 'bold' },
  modalLabel: { color: '#d1d5db', fontSize: 14, marginBottom: 8 },
  modalInput: { backgroundColor: '#374151', color: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
  modalSaveButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center' },
  modalSaveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default React.memo(AddIncomeModal);
