import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { saveSetting, getSetting, deleteAllData } from "../services/database";
import { useCurrency } from "../context/CurrencyContext";
// Impor ini sudah benar menggunakan kurung kurawal {}
import { useApp } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

const SettingsItem = ({ icon, label, onPress, value }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Icon name={icon} size={24} color="#555" style={styles.icon} />
    <Text style={styles.itemLabel}>{label}</Text>
    {value && <Text style={styles.itemValue}>{value}</Text>}
    <Icon name="chevron-right" size={24} color="#ccc" />
  </TouchableOpacity>
);

const DangerItem = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={[styles.itemContainer, styles.dangerItemContainer]}
    onPress={onPress}
  >
    <Icon name={icon} size={24} color="#E53935" style={styles.icon} />
    <Text style={[styles.itemLabel, styles.dangerItemLabel]}>{label}</Text>
    <Icon name="chevron-right" size={24} color="#E53935" />
  </TouchableOpacity>
);

const SettingsToggleItem = ({ icon, label, value, onValueChange }) => (
  <View style={[styles.itemContainer, { paddingVertical: 10 }]}>
    <Icon name={icon} size={24} color="#555" style={styles.icon} />
    <Text style={styles.itemLabel}>{label}</Text>
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const SettingsScreen = () => {
  const { currency, setCurrency } = useCurrency();
  const { refreshData } = useApp();
  const navigation = useNavigation();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const biometricStatus = await getSetting("isBiometricEnabled");
      setIsBiometricEnabled(biometricStatus === "true");
    };
    loadSettings();
  }, []);

  const handleBiometricToggle = async () => {
    const newValue = !isBiometricEnabled;
    try {
      await saveSetting("isBiometricEnabled", newValue.toString());
      setIsBiometricEnabled(newValue);
      Alert.alert(
        newValue ? "Sukses" : "Info",
        newValue
          ? "Kunci aplikasi dengan biometrik telah diaktifkan."
          : "Kunci aplikasi telah dinonaktifkan.",
      );
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan pengaturan.");
    }
  };

  const handleCurrencyChange = () => {
    Alert.alert("Pilih Mata Uang", "Pilih mata uang yang ingin Anda gunakan.", [
      {
        text: "IDR (Rupiah)",
        onPress: async () => {
          await saveSetting("currency", "IDR");
          setCurrency("IDR");
        },
      },
      {
        text: "USD (Dollar)",
        onPress: async () => {
          await saveSetting("currency", "USD");
          setCurrency("USD");
        },
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      "Konfirmasi Hapus Data",
      "Anda yakin ingin menghapus SEMUA data? Tindakan ini tidak dapat diurungkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllData();
              await refreshData();
              Alert.alert("Sukses", "Semua data telah dihapus.");
              navigation.navigate("Home");
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus data.");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.header}>Pengaturan</Text>

      <SectionHeader title="Keamanan" />
      <SettingsToggleItem
        icon="fingerprint"
        label="Kunci Aplikasi"
        value={isBiometricEnabled}
        onValueChange={handleBiometricToggle}
      />

      <SectionHeader title="Tampilan" />
      <SettingsToggleItem
        icon="theme-light-dark"
        label="Mode Gelap"
        value={isDarkMode}
        onValueChange={setIsDarkMode} // Placeholder, belum ada logika
      />
      <SettingsItem
        icon="currency-usd"
        label="Mata Uang"
        value={currency}
        onPress={handleCurrencyChange}
      />

      <SectionHeader title="Manajemen Data" />
      <DangerItem
        icon="trash-can-outline"
        label="Hapus Semua Data"
        onPress={handleDeleteAllData}
      />
    </ScrollView>
  );
};

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 40,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    marginTop: 25,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: { marginRight: 15 },
  itemLabel: { flex: 1, fontSize: 16, color: "#333" },
  itemValue: { fontSize: 16, color: "#888", marginRight: 10 },
  dangerItemContainer: { borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  dangerItemLabel: { color: "#E53935", fontWeight: "500" },
});

export default SettingsScreen;
