import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SavingDetailModal = ({ isVisible, onClose, onSave, onDelete, savingItem }) => {
  const [amountToAdd, setAmountToAdd] = useState('');
  const [source, setSource] = useState('pemasukan');

  if (!savingItem) {
    return null;
  }

  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // --- PERUBAHAN UTAMA DI SINI ---
  // Fungsi ini sekarang akan memvalidasi input secara real-time
  const handleAmountChange = (text) => {
    const cleanText = text.replace(/\./g, '');
    if (!isNaN(cleanText)) {
      // 1. Hitung berapa sisa yang dibutuhkan untuk mencapai target
      const amountNeeded = savingItem.target - savingItem.current;

      // Jika target sudah tercapai, jangan biarkan input
      if (amountNeeded <= 0) {
        setAmountToAdd('');
        return;
      }

      const inputNumber = Number(cleanText);

      // 2. Jika input melebihi sisa yang dibutuhkan...
      if (inputNumber > amountNeeded) {
        // ...secara otomatis perbaiki nilainya ke jumlah maksimum yang dibutuhkan
        setAmountToAdd(amountNeeded.toString());
      } else {
        // Jika tidak, perbarui seperti biasa
        setAmountToAdd(cleanText);
      }
    }
  };

  const handleSave = () => {
    if (!amountToAdd || isNaN(Number(amountToAdd)) || Number(amountToAdd) <= 0) {
      Alert.alert('Input Tidak Valid', 'Silakan masukkan jumlah dana yang ingin ditambahkan.');
      return;
    }
    onSave(savingItem.id, Number(amountToAdd), savingItem.name, source);
    setAmountToAdd('');
    onClose();
  };

  const handleDelete = () => {
    /* ... (fungsi ini tidak berubah) ... */
  };

  const progress = savingItem.target > 0 ? (savingItem.current / savingItem.target) * 100 : 0;
  const clampedProgress = Math.min(100, progress);
  const isComplete = clampedProgress >= 100;

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
            <Text style={styles.modalTitle}>{savingItem.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={26}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressTextLarge}>{Math.floor(clampedProgress)}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${clampedProgress}%` }]} />
            </View>
            <Text style={styles.progressTextSmall}>
              Terkumpul Rp {(savingItem.current || 0).toLocaleString('id-ID')} / {(savingItem.target || 0).toLocaleString('id-ID')}
            </Text>
          </View>

          {isComplete ? (
            <View style={styles.completedContainer}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#22c55e"
              />
              <Text style={styles.completedText}>Selamat! Target tabungan ini sudah tercapai.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.modalLabel}>Tambah Dana</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., 100.000"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={formatNumber(amountToAdd)}
                onChangeText={handleAmountChange}
                autoFocus={true}
              />

              <Text style={styles.modalLabel}>Sumber Dana</Text>
              <View style={styles.sourceContainer}>
                <TouchableOpacity
                  style={[styles.sourceButton, source === 'pemasukan' && styles.sourceButtonActive]}
                  onPress={() => setSource('pemasukan')}
                >
                  <Text style={[styles.sourceButtonText, source === 'pemasukan' && styles.sourceButtonTextActive]}>Dari Pemasukan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sourceButton, source === 'luar' && styles.sourceButtonActive]}
                  onPress={() => setSource('luar')}
                >
                  <Text style={[styles.sourceButtonText, source === 'luar' && styles.sourceButtonTextActive]}>Dari Luar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.modalSaveButton, isComplete && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isComplete}
          >
            <Text style={styles.modalSaveButtonText}>Tambah Dana</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Hapus Target</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContainer: { width: '90%', backgroundColor: '#1E1E3F', borderRadius: 20, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#f9fafb', fontSize: 20, fontWeight: 'bold' },
  progressSection: { alignItems: 'center', marginBottom: 15 },
  progressTextLarge: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  progressBarContainer: { width: '100%', height: 10, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 5, marginTop: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#6DD5FA', borderRadius: 5 },
  progressTextSmall: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 13, marginTop: 8 },
  modalLabel: { color: '#d1d5db', fontSize: 14, marginBottom: 8, marginTop: 10 },
  modalInput: { backgroundColor: '#374151', color: '#f9fafb', borderRadius: 10, padding: 12, fontSize: 16 },
  sourceContainer: { flexDirection: 'row', gap: 10 },
  sourceButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#374151', alignItems: 'center' },
  sourceButtonActive: { backgroundColor: '#5E72E4', borderColor: '#5E72E4' },
  sourceButtonText: { color: '#d1d5db' },
  sourceButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  modalSaveButton: { backgroundColor: '#5E72E4', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  modalSaveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { marginTop: 10, padding: 10, alignItems: 'center' },
  deleteButtonText: { color: '#ef4444', fontSize: 14 },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginVertical: 10,
  },
  completedText: { color: '#22c55e', fontWeight: '600', flex: 1 },
  buttonDisabled: { backgroundColor: '#374151', opacity: 0.6 },
});

export default React.memo(SavingDetailModal);
