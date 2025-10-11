import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddSavingModal = ({ isVisible, onClose, onSave }) => {
  // State untuk nama dan target jumlah tabungan
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [bgColor, setBgColor] = useState('#6DD5FA'); // default warna

  const colorOptions = ['#6DD5FA', '#2980B9', '#F9D423', '#FF4E50', '#43CEA2'];

  // Fungsi untuk memformat angka dengan titik ribuan
  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Fungsi untuk membersihkan input jumlah sebelum disimpan ke state
  const handleAmountChange = (text) => {
    const cleanText = text.replace(/\./g, '');
    if (!isNaN(cleanText)) {
      setTargetAmount(cleanText);
    }
  };

  const handleSave = async () => {
    // Validasi untuk memastikan nama dan jumlah sudah diisi dengan benar
    if (!name.trim() || !targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      Alert.alert('Input Tidak Valid', 'Nama dan target jumlah tabungan harus diisi dengan benar.');
      return;
    }
    // Kirim nama dan jumlah ke fungsi onSave di parent component
    await onSave(name.trim(), Number(targetAmount), bgColor); // kirim warna
    // Reset state dan tutup modal
    setName('');
    setTargetAmount('');
    setBgColor(bgColor);
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
            <Text style={styles.modalTitle}>Tambah Target Tabungan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={26}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          {/* Input untuk Nama Tabungan */}
          <Text style={styles.modalLabel}>Nama Tabungan</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., Motor Baru, Liburan"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            autoFocus={true}
          />

          {/* Input untuk Target Jumlah */}
          <Text style={styles.modalLabel}>Target Jumlah</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g., 20.000.000"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={formatNumber(targetAmount)}
            onChangeText={handleAmountChange}
          />

          {/* Pilihan Warna */}
          <Text style={styles.modalLabel}>Pilih Warna Kartu</Text>
          <View style={{ flexDirection: 'row', marginVertical: 12, justifyContent: 'center' }}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setBgColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color,
                  marginHorizontal: 6,
                  borderWidth: bgColor === color ? 3 : 1,
                  borderColor: bgColor === color ? '#fff' : '#ccc',
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={handleSave}
          >
            <Text style={styles.modalSaveButtonText}>Simpan Target</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Style ini bisa Anda pindahkan ke file styles.js terpisah jika mau
const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { width: '90%', backgroundColor: '#1f2937', borderRadius: 12, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#f9fafb', fontSize: 18, fontWeight: 'bold' },
  modalLabel: { color: '#d1d5db', fontSize: 14, marginBottom: 8, marginTop: 10 },
  modalInput: { backgroundColor: '#374151', color: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 16 },
  modalSaveButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  modalSaveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default React.memo(AddSavingModal);
