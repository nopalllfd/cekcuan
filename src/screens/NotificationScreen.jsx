import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Komponen untuk satu item notifikasi
const NotificationItem = ({ title, body, time }) => {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="person-circle-outline"
          size={40}
          color="#8B5CF6"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationBody}>{body}</Text>
      </View>
      <Text style={styles.notificationTime}>{time}</Text>
    </View>
  );
};

// Data notifikasi statis untuk sementara
const notificationsData = [
  {
    id: '1',
    title: 'Jangan lupa isi pengeluaran harianmu!',
    body: 'CekCuan dapat mencatat pengeluaranmu tiap harinya, sehingga kamu dapat melihat total pengeluaranmu dalam Mingguan maupun Bulanan.',
    time: '12.34pm',
  },
  {
    id: '2',
    title: 'Pengeluaran bulan ini sudah mencapai batas!',
    body: 'Total pengeluaranmu di bulan September sudah mencapai Rp 5.000.000. Kendalikan pengeluaranmu!',
    time: '10.00am',
  },
  {
    id: '3',
    title: 'Selamat datang di CekCuan!',
    body: 'Mulai kelola keuanganmu sekarang juga.',
    time: '09.00am',
  },
];

const NotificationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a1a2e"
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {notificationsData.map((item) => (
          <NotificationItem
            key={item.id}
            title={item.title}
            body={item.body}
            time={item.time}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#332959',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: '#ccc',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
});

export default NotificationScreen;
