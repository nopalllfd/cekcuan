import React, { useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerWrapper = ({ children, date, onDateChange, mode = 'date' }) => {
  const [show, setShow] = useState(false);

  const handlePress = () => {
    setShow(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DatePickerWrapper;
