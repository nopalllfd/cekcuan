import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addCategory, getCategories } from '../../../services/database';
import CustomAlert from '../../common/CustomAlert';

import { styles } from './styles';
import CategorySelectionStep from './CategorySelectionStep';
import TransactionInputStep from './TransactionInputStep';
import AddCategoryStep from './AddCategoryStep';

const AddTransactionModal = ({ isVisible, onClose, onSave, categories, fetchData }) => {
  const [modalStep, setModalStep] = useState('category_select');
  // ... state lainnya tetap sama ...
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('pengeluaran');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // 1. Buat state lokal untuk kontrol visibilitas Modal
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const resetState = () => {
    setModalStep('category_select');
    setAmount('');
    setDescription('');
    setDetails('');
    setSelectedCategoryId(null);
    setNewCategoryName('');
    setSelectedIcon(null);
  };

  // 2. Modifikasi useEffect untuk menggunakan state lokal
  useEffect(() => {
    if (isVisible) {
      // Jika prop isVisible true, tampilkan modal lalu jalankan animasi fade-in
      setShowModal(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Jika prop isVisible false, jalankan animasi fade-out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Setelah animasi selesai, baru sembunyikan modal dan reset state
        setShowModal(false);
        resetState();
      });
    }
  }, [isVisible]);

  const handleClose = () => {
    onClose();
  };

  // ... semua fungsi lain tetap sama ...
  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleNextStep = () => {
    if (!selectedCategoryId) {
      showAlert('Silakan pilih salah satu kategori.', 'error');
      return;
    }
    setModalStep('input_form');
  };

  const handleSaveTransaction = () => {
    if (!description.trim() || !amount.trim() || isNaN(parseFloat(amount))) {
      showAlert('Nama dan Harga (angka) harus diisi.', 'error');
      return;
    }
    onSave(parseFloat(amount), description, type, selectedCategoryId, details);
    handleClose();
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim() || !selectedIcon) {
      showAlert('Nama kategori dan ikon harus diisi.', 'error');
      return;
    }
    try {
      const existing = await getCategories();
      if (existing.some((cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        showAlert('Nama kategori sudah ada.', 'error');
        return;
      }
      await addCategory(newCategoryName.trim(), selectedIcon);
      await fetchData();
      showAlert('Kategori baru berhasil ditambahkan!', 'success');
      setModalStep('category_select');
      setNewCategoryName('');
      setSelectedIcon(null);
    } catch (error) {
      console.error('Error saat menambah kategori:', error);
      showAlert('Gagal menambah kategori.', 'error');
    }
  };

  const renderModalContent = () => {
    switch (modalStep) {
      case 'category_select':
        return (
          <CategorySelectionStep
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onAddCategory={() => setModalStep('add_category')}
            onNext={handleNextStep}
          />
        );
      case 'input_form':
        return (
          <TransactionInputStep
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            description={description}
            onDescriptionChange={setDescription}
            amount={amount}
            onAmountChange={setAmount}
            onSave={handleSaveTransaction}
          />
        );
      case 'add_category':
        return (
          <AddCategoryStep
            newCategoryName={newCategoryName}
            onCategoryNameChange={setNewCategoryName}
            selectedIcon={selectedIcon}
            onIconSelect={setSelectedIcon}
            onSave={handleSaveCategory}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalStep) {
      case 'category_select':
        return 'Pilih Kategori';
      case 'input_form':
        return 'Masukkan Pengeluaran';
      case 'add_category':
        return 'Tambah Kategori';
      default:
        return '';
    }
  };

  return (
    // 3. Gunakan state lokal 'showModal' untuk prop 'visible'
    <Modal
      animationType="none"
      transparent
      visible={showModal}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            activeOpacity={1}
          />
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {modalStep !== 'category_select' ? (
                  <TouchableOpacity
                    onPress={() => setModalStep('category_select')}
                    style={styles.headerButton}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.headerButton} />
                )}
                <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.headerButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>{renderModalContent()}</ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </KeyboardAvoidingView>
      <CustomAlert
        message={alertMessage}
        type={alertType}
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
};

export default AddTransactionModal;
