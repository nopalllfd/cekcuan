import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

import { initDB } from "./src/services/database";
import { AppProvider } from "./src/context/AppContext";
import { CurrencyProvider } from "./src/context/CurrencyContext";
import AppNavigator from "./src/navigation/AppNavigator";

// Mencegah splash screen hilang secara otomatis
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Inisialisasi database
        await initDB();
        console.log("Database siap.");
      } catch (e) {
        console.warn("Gagal mempersiapkan aplikasi:", e);
      } finally {
        // Tandai bahwa aplikasi siap dan sembunyikan splash screen
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    // Anda bisa mengembalikan komponen loading di sini jika perlu,
    // tapi splash screen sudah menangani ini.
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <CurrencyProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CurrencyProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
