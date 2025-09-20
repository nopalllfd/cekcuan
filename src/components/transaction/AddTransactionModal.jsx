import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Dimensions, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { addCategory, getCategories } from '../../services/database';

const { width, height } = Dimensions.get('window');

const iconOptions = ['silverware-fork-knife', 'shopping-outline', 'home-outline', 'car-sports', 'account-cash-outline', 'medical-bag', 'book-open-variant', 'food-outline', 'coffee-outline', 'cellphone', 'plane-train'];

const CustomAlert = ({ message, type, isVisible, onClose }) => {
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#663fc1f1' };
      case 'error':
        return { backgroundColor: '#FFB86E' };
      default:
        return { backgroundColor: '#663fc1f1' };
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle-outline';
      case 'error':
        return 'alert-circle-outline';
      default:
        return 'information-outline';
    }
  };

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(animatedValue, {
              toValue: -100,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => onClose());
        }, 3000);
      });
    }
  }, [isVisible, animatedValue, opacityValue, onClose]);

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.alertContainer, { transform: [{ translateY: animatedValue }], opacity: opacityValue }]}>
        <View style={[styles.alertContent, getAlertStyle()]}>
          <MaterialCommunityIcons
            name={getIconName()}
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const TransactionAndCategoryModal = ({ isVisible, onClose, onSave, categories, fetchData }) => {
  const [modalStep, setModalStep] = useState('category_select');
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

  const slideAnim = useRef(new Animated.Value(height)).current;

  const resetState = () => {
    setModalStep('category_select');
    setAmount('');
    setDescription('');
    setDetails('');
    setSelectedCategoryId(null);
    setNewCategoryName('');
    setSelectedIcon(null);
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        resetState();
      });
    }
  }, [isVisible, slideAnim, height]);

  const showAlert = (message, type) => {
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
    if (description === '' && amount === '') {
      showAlert('Silahkan lengkapi form', 'error');
      return;
    }
    if (amount === '' || isNaN(parseFloat(amount))) {
      showAlert('Harga harus diisi dengan angka.', 'error');
      return;
    }
    if (description === '') {
      showAlert('Nama pengeluaran harus diisi.', 'error');
      return;
    }
    onSave(parseFloat(amount), description, type, selectedCategoryId, details);
    onClose();
  };

  const handleSaveCategory = async () => {
    if (newCategoryName === '') {
      showAlert('Nama kategori tidak boleh kosong.', 'error');
      return;
    }
    if (!selectedIcon) {
      showAlert('Silakan pilih ikon.', 'error');
      return;
    }
    try {
      const existingCategories = await getCategories();
      const categoryExists = existingCategories.some((cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase());
      if (categoryExists) {
        showAlert('Nama kategori sudah ada. Mohon gunakan nama yang berbeda.', 'error');
        return;
      }
      await addCategory(newCategoryName, selectedIcon);
      await fetchData();
      showAlert('Kategori baru berhasil ditambahkan!', 'success');
      setModalStep('category_select');
    } catch (error) {
      console.error('Error saat menambah kategori:', error);
      showAlert('Terjadi kesalahan saat menambah kategori. Silakan coba lagi.', 'error');
    }
  };

  const renderModalContent = () => {
    if (modalStep === 'category_select') {
      if (!categories || !Array.isArray(categories)) {
        return (
          <View style={[styles.modalContent, styles.loadingContainer]}>
            <Text style={styles.modalTitle}>Memuat Kategori...</Text>
            <Text style={styles.modalSubText}>Pastikan Anda terhubung ke internet.</Text>
          </View>
        );
      }
      const expenseCategories = categories.filter((cat) => ['Pemasukan', 'Pengeluaran', 'Tabungan'].indexOf(cat.name) === -1);
      return (
        <View style={styles.modalBody}>
          <View style={styles.categoryGridContainer}>
            {expenseCategories.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.categoryGridButton}
                onPress={() => setSelectedCategoryId(item.id)}
              >
                <View style={[styles.categoryIconContainer, selectedCategoryId === item.id && styles.categoryIconContainerActive]}>
                  <MaterialCommunityIcons
                    name={item.icon || 'help-circle-outline'}
                    size={24}
                    color="#fff"
                  />
                </View>
                <Text style={styles.categoryGridText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              key="add-category-button"
              style={styles.categoryGridButton}
              onPress={() => setModalStep('add_category')}
            >
              <View style={styles.addCategoryIconContainer}>
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={styles.categoryGridText}>Tambah Kategori</Text>
            </TouchableOpacity>
          </View>
          <Button
            title="Next →"
            onPress={handleNextStep}
            style={styles.nextButton}
          />
        </View>
      );
    } else if (modalStep === 'input_form') {
      return (
        <View style={styles.modalBody}>
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
            onPress={handleSaveTransaction}
            style={styles.saveButton}
          />
        </View>
      );
    } else if (modalStep === 'add_category') {
      return (
        <View style={styles.modalBody}>
          <Text style={styles.label}>Nama Kategori</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Kategori..."
              placeholderTextColor="#888"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color="#888"
              style={styles.inputIcon}
            />
          </View>
          <Text style={styles.label}>Pilih Icon</Text>
          <View style={styles.iconGridContainer}>
            {iconOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.categoryGridButton}
                onPress={() => setSelectedIcon(item)}
              >
                <View style={[styles.categoryIconContainer, selectedIcon === item && styles.categoryIconContainerActive]}>
                  <MaterialCommunityIcons
                    name={item}
                    size={24}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title="SIMPAN"
            onPress={handleSaveCategory}
            style={styles.saveButton}
          />
        </View>
      );
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {modalStep !== 'category_select' ? (
                <TouchableOpacity
                  onPress={() => setModalStep('category_select')}
                  style={styles.backButton}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.invisibleButton} />
              )}
              <Text style={[styles.modalTitle, modalStep === 'category_select' ? styles.centerTitle : null, modalStep === 'category_select' && styles.categoryTitleMargin]}>
                {modalStep === 'category_select' ? 'Pilih Kategori' : modalStep === 'input_form' ? 'Masukkan Pengeluaran' : 'Tambah Kategori'}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              {renderModalContent()}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
      <CustomAlert
        message={alertMessage}
        type={alertType}
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  animatedContainer: {
    maxHeight: '85%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    elevation: 5,
    alignItems: 'center',
    paddingTop: 30,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubText: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginStart: 5,
  },
  centerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  categoryTitleMargin: {
    marginLeft: -10,
  },
  closeButton: {
    padding: 5,
  },
  backButton: {
    padding: 5,
  },
  invisibleButton: {
    width: 24,
    height: 24,
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
  inputIcon: {
    marginLeft: 10,
  },
  inputCurrency: {
    color: '#888',
    fontSize: 18,
    marginLeft: 5,
  },
  saveButton: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#8B5CF6',
  },
  categoryGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
    marginStart: 5,
  },
  iconGridContainer: {
    flexDirection: 'row', // Agar item-item berada dalam satu baris
    flexWrap: 'wrap', // Membuat item pindah ke baris berikutnya jika ruang habis
    justifyContent: 'start', // Rata tengah antara ikon-ikon
    paddingHorizontal: 10,

    marginTop: 10,
    width: '100%',
  },
  categoryGridButton: {
    alignItems: 'center',
    margin: 10,
    width: (width - 40) / 6, // Ukuran ikon yang lebih kecil dan dengan beberapa ikon dalam satu baris
    justifyContent: 'between', // Agar ikon berada di tengah
  },

  categoryIconContainer: {
    width: 60, // Pastikan lebar dan tinggi sesuai
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  addCategoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryIconContainerActive: {
    backgroundColor: 'rgba(139, 92, 246, 1)',
  },
  categoryGridText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    width: 60,
  },
  addCategoryText: {
    color: '#ffffff',
    marginTop: 5,
  },
  nextButton: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#8B5CF6',
  },
  modalBody: {
    width: '100%',
  },
  alertContainer: {
    paddingTop: 40,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});

export default TransactionAndCategoryModal;
