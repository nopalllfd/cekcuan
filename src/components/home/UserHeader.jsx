import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const UserHeader = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Timer ini sekarang diperbarui setiap detik untuk menunjukkan detik
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Hapus timer saat komponen dilepas
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(currentDateTime, 'EEEE, dd MMMM', { locale: id });
  const hour = currentDateTime.getHours();
  const minute = currentDateTime.getMinutes();
  const second = currentDateTime.getSeconds(); // Tambahkan detik

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.clockIconContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color="#fff"
          />
        </View>
        <View>
          <Text style={styles.dateText}>{formattedDate}</Text>
          {/* Tampilkan jam, menit, dan detik */}
          <Text style={styles.timeText}>{`${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}`}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.notificationButton}>
        <MaterialIcons
          name="notifications"
          size={24}
          color="#d5d5d5ff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
    gap: 10,
  },
  clockIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserHeader;
