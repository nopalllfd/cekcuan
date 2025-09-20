import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Dimensions, Animated, Easing, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import CustomAlert from '../common/CustomAlert';
import { addCategory, getCategories } from '../../services/database';

const { width, height } = Dimensions.get('window');

const iconOptions = {
  Pengeluaran: ['silverware-fork-knife', 'shopping-outline', 'home-outline', 'car-sports', 'account-cash-outline', 'medical-bag', 'book-open-variant', 'food-outline', 'coffee-outline', 'cellphone', 'plane-train'],
  Pemasukan: ['cash-plus', 'trending-up', 'wallet-plus-outline', 'sack', 'chart-line', 'piggy-bank-outline', 'plus-box-outline'],
  Tabungan: ['piggy-bank', 'safe', 'sack-dollar', 'wallet-plus'],
};

const AddCategoryModal = ({ isVisible, onClose, onReturnToTransaction, fetchData }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [activeTab, setActiveTab] = useState('Pengeluaran');

  const slideAnim = useRef(new Animated.Value(height)).current;
  const resetState = () => {
    setNewCategoryName('');
    setSelectedIcon(null);
    setActiveTab('Pengeluaran');
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

  useEffect(() => {
    let timer;
    if (alertVisible && alertType === 'success') {
      timer = setTimeout(() => {
        setAlertVisible(false);
        if (onReturnToTransaction) {
          onReturnToTransaction();
        } else {
          onClose();
        }
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [alertVisible, alertType, onReturnToTransaction]);

  const handleSave = async () => {
    if (newCategoryName === '') {
      setAlertMessage('Nama kategori tidak boleh kosong.');
      setAlertType('error');
      setAlertVisible(true);
      return;
    }

    if (!selectedIcon) {
      setAlertMessage('Silakan pilih ikon.');
      setAlertType('error');
      setAlertVisible(true);
      return;
    }

    try {
      const existingCategories = await getCategories();
      const categoryExists = existingCategories.some((cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase());

      if (categoryExists) {
        setAlertMessage('Nama kategori sudah ada. Mohon gunakan nama yang berbeda.');
        setAlertType('error');
        setAlertVisible(true);
        return;
      }

      await addCategory(newCategoryName, selectedIcon);
      await fetchData();

      setAlertMessage('Kategori baru berhasil ditambahkan!');
      setAlertType('success');
      setAlertVisible(true);
    } catch (error) {
      console.error('Error saat menambah kategori:', error);
      setAlertMessage('Terjadi kesalahan saat menambah kategori. Silakan coba lagi.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  const renderContent = () => {
    // Only render the expense category content
    return (
      <>
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
          {iconOptions.Pengeluaran.map((item) => (
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
          onPress={handleSave}
          style={styles.saveButton}
        />
      </>
    );
  };

  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: slideAnim }] }]}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={onReturnToTransaction}
                    style={styles.backButton}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Tambah Kategori</Text>
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
                {renderContent()}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      <CustomAlert
        message={alertMessage}
        type={alertType}
        isVisible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </>
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
  },
  backButton: {
    padding: 5,
  },
  closeButton: {
    padding: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    color: '#ffffff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
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
  iconGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  categoryGridButton: {
    alignItems: 'center',
    margin: 8,
    width: (width - 10) / 6,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryIconContainerActive: {
    backgroundColor: 'rgba(139, 92, 246, 1)',
  },
  saveButton: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#8B5CF6',
  },
  modalSubText: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default AddCategoryModal;
