// src/utils/auth.js

import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

/**
 * Handles the biometric authentication process.
 * @returns {Promise<boolean>} - True if authentication is successful, false otherwise.
 */
export const authenticateWithBiometrics = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert(
        "Error",
        "Perangkat Anda tidak mendukung otentikasi biometrik.",
      );
      return false;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(
        "Belum Terdaftar",
        "Anda belum mendaftarkan sidik jari atau Face ID di perangkat ini.",
      );
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login ke Cek Cuan",
      cancelLabel: "Batal",
      disableDeviceFallback: true,
    });

    return result.success;
  } catch (error) {
    Alert.alert(
      "Error Otentikasi",
      "Terjadi kesalahan saat proses otentikasi.",
    );
    console.error("Authentication error:", error);
    return false;
  }
};
