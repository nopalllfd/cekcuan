// src/screens/LockScreen.js

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authenticateWithBiometrics } from "../utils/auth";

const LockScreen = ({ onUnlock }) => {
  const handleAuthentication = async () => {
    const authenticated = await authenticateWithBiometrics();
    if (authenticated) {
      onUnlock(); // Membuka aplikasi jika berhasil
    }
  };

  // Secara otomatis memicu otentikasi saat layar pertama kali ditampilkan
  useEffect(() => {
    handleAuthentication();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="shield-lock-outline" size={80} color="#3498db" />
        <Text style={styles.title}>Cek Cuan Terkunci</Text>
        <Text style={styles.subtitle}>Gunakan biometrik untuk membuka</Text>
        <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
          <Text style={styles.buttonText}>Buka Aplikasi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 8,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LockScreen;
