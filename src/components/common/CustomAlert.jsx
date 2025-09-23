import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text, View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        }, 1500);
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
const styles = StyleSheet.create({
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

export default CustomAlert;
