import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

const CustomButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity
    style={[styles.buttonBase, style]}
    onPress={onPress}
  >
    <Text style={[styles.buttonTextBase, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default CustomButton;
