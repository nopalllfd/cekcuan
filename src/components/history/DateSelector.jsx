import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerWrapper from './DatePickerWrapper';

const getDayName = (date) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
};

const getMonthName = (date) => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[date.getMonth()];
};

const DateSelector = ({ selectedDate, onSelectDate }) => {
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [currentDisplayDate, setCurrentDisplayDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setCurrentDisplayDate(selectedDate);
  }, [selectedDate]);

  const changeDate = (numDays) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + numDays);
    onSelectDate(newDate);
  };

  const onMonthYearPickerChange = (event, date) => {
    setShowMonthYearPicker(false);
    if (date) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(date.getFullYear());
      newDate.setMonth(date.getMonth());
      onSelectDate(newDate);
    }
  };

  const onFullScreenDatePickerChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      onSelectDate(date);
    }
  };

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
        <Text style={[styles.dateCardMonth, isSelected && styles.selectedDateCardText]}>{getMonthName(date)}</Text>
      </TouchableOpacity>
    );
  };

  const datesToShow = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = -1; i <= 1; i++) {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() + i);
    datesToShow.push(d);
  }

  return (
    <View style={styles.dateSelectorWrapper}>
      {/* Month & Year Picker */}
      <View style={styles.monthYearPickerContainer}>
        <View style={styles.centeredPicker}>
          <TouchableOpacity
            onPress={() => setShowMonthYearPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerText}>{getMonthName(currentDisplayDate)}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
          {showMonthYearPicker && (
            <DateTimePicker
              value={currentDisplayDate}
              mode="date"
              display="spinner"
              onChange={onMonthYearPickerChange}
              maximumDate={new Date()}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowMonthYearPicker(true)}
            style={styles.pickerYearButton}
          >
            <Text style={styles.pickerYearText}>{currentDisplayDate.getFullYear()}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#343478ff"
            />
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onFullScreenDatePickerChange}
          />
        )}
      </View>

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
    backgroundColor: 'rgba(26, 26, 46, 1)',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  monthYearPickerContainer: {
    alignItems: 'center',
    marginTop: 40,
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
    backgroundColor: '#343478ff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  pickerYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b8b8d7ff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  pickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  pickerYearText: {
    color: '#343478ff',
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
    backgroundColor: '#332959',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: 88,
    marginTop: 10,
    transform: [{ scale: 0.95 }],
  },
  selectedDateCard: {
    backgroundColor: '#8B5CF6',
    transform: [{ scale: 1.1 }],
  },
  dateCardDay: {
    fontSize: 12,
    color: '#ccc',
  },
  dateCardNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateCardMonth: {
    fontSize: 12,
    color: '#ccc',
  },
  selectedDateCardText: {
    color: '#fff',
  },
});

export default DateSelector;
