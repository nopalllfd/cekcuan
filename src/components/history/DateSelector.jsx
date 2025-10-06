import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Helper functions
const getDayName = (date) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
};

const getMonthName = (date) => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[date.getMonth()];
};

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const DateSelector = ({ selectedDate, onSelectDate }) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Fungsi untuk maju/mundur tanggal
  const changeDate = (numDays) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + numDays);
    onSelectDate(newDate);
  };

  // Handler untuk Month Selection
  const handleMonthSelect = (monthIndex) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setMonth(monthIndex);
    onSelectDate(updatedDate);
    setShowMonthPicker(false);
  };

  // Handler untuk Year Selection
  const handleYearSelect = (year) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(year);
    onSelectDate(updatedDate);
    setShowYearPicker(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2025 + 1 }, (_, i) => 2025 + i);

  // Fungsi render kartu tanggal
  const renderDateCard = (date) => {
    const isSelected = selectedDate.toDateString() === date.toDateString();
    return (
      <TouchableOpacity
        key={date.toDateString()}
        style={[styles.dateCard, isSelected && styles.selectedDateCard]}
        onPress={() => onSelectDate(date)}
      >
        <Text style={[styles.dateCardDay, isSelected && styles.selectedDateCardText]}>{getDayName(date)}</Text>
        <Text style={[styles.dateCardNumber, isSelected && styles.selectedDateCardText]}>{date.getDate()}</Text>
        <Text style={[styles.dateCardMonth, isSelected && styles.selectedDateCardText]}>{getMonthName(date).substring(0, 3)}</Text>
      </TouchableOpacity>
    );
  };

  const datesToShow = [-1, 0, 1].map((i) => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() + i);
    return d;
  });

  return (
    <View style={styles.dateSelectorWrapper}>
      {/* Month & Year Picker Buttons */}
      <View style={styles.monthYearPickerContainer}>
        <View style={styles.centeredPicker}>
          <TouchableOpacity
            onPress={() => setShowMonthPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerText}>{getMonthName(selectedDate)}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowYearPicker(true)}
            style={styles.pickerYearButton}
          >
            <Text style={styles.pickerYearText}>{selectedDate.getFullYear()}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="rgba(255, 255, 255, 1)"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Bulan</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {MONTHS.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.pickerItem, selectedDate.getMonth() === index && styles.selectedPickerItem]}
                  onPress={() => handleMonthSelect(index)}
                >
                  <Text style={[styles.pickerItemText, selectedDate.getMonth() === index && styles.selectedPickerItemText]}>{month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Tahun</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.pickerItem, selectedDate.getFullYear() === year && styles.selectedPickerItem]}
                  onPress={() => handleYearSelect(year)}
                >
                  <Text style={[styles.pickerItemText, selectedDate.getFullYear() === year && styles.selectedPickerItemText]}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Cards */}
      <View style={styles.dateCarouselContainer}>
        <TouchableOpacity
          onPress={() => changeDate(-1)}
          style={[styles.arrowButton, styles.leftArrow]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.dateCardsGroup}>{datesToShow.map(renderDateCard)}</View>
        <TouchableOpacity
          onPress={() => changeDate(1)}
          style={[styles.arrowButton, styles.rightArrow]}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateSelectorWrapper: {
    backgroundColor: 'rgba(57, 57, 78, 0)',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  monthYearPickerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  centeredPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#040824F2',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'white',
    paddingHorizontal: 40,
    textAlign: 'left',
    paddingVertical: 8,
  },
  pickerYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#040824F2',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  pickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  pickerYearText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  dateCarouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    position: 'relative',
  },
  dateCardsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  arrowButton: {
    position: 'absolute',
    padding: 10,
    zIndex: 1,
  },
  leftArrow: {
    left: 0,
  },
  rightArrow: {
    right: 0,
  },
  dateCard: {
    backgroundColor: '#7C7C7D2B',
    borderRadius: 10,

    color: '#9AC2FF',
    paddingHorizontal: 15,
    alignItems: 'center',
    width: 80,
    height: 100,
    marginHorizontal: 3,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#9AC2FF',
    marginTop: 10,
    transform: [{ scale: 0.95 }],
  },
  selectedDateCard: {
    backgroundColor: '#1a2b63ff',
    transform: [{ scale: 1.1 }],
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  dateCardDay: {
    fontSize: 12,
    color: '#9AC2FF',
  },
  dateCardNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#9AC2FF',
  },
  dateCardMonth: {
    fontSize: 12,
    color: '#9AC2FF',
  },
  selectedDateCardText: {
    color: '#fff',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    width: '80%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  selectedPickerItem: {
    backgroundColor: '#1a2b63',
  },
  pickerItemText: {
    color: '#9AC2FF',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedPickerItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DateSelector;
