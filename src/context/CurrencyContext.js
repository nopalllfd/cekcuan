import React, { createContext, useState, useContext, useEffect } from "react";
import { getSetting, saveSetting } from "../services/database"; // Kita butuh saveSetting juga

// URL API untuk mendapatkan kurs terbaru dengan IDR sebagai mata uang dasar
const API_URL = "https://open.er-api.com/v6/latest/IDR";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // State untuk menyimpan mata uang pilihan (misal: 'IDR' atau 'USD')
  const [currency, setCurrencyState] = useState("IDR");

  // State untuk menyimpan semua data kurs yang diambil dari API
  const [rates, setRates] = useState(null);

  // State untuk menandakan apakah kurs sedang dimuat
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // Efek ini berjalan sekali saat aplikasi pertama kali dimuat
  useEffect(() => {
    const loadInitialSettings = async () => {
      try {
        // 1. Ambil kurs mata uang dari API
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Gagal mengambil data kurs dari API.");
        }
        const data = await response.json();
        setRates(data.rates); // Simpan semua kurs (misal: { "USD": 0.000061, "EUR": ... })

        // 2. Ambil pengaturan mata uang terakhir yang disimpan pengguna
        const savedCurrency = await getSetting("currency");
        if (savedCurrency) {
          setCurrencyState(savedCurrency);
        }
      } catch (error) {
        console.error("Error in CurrencyContext:", error);
        // Jika API gagal, setidaknya kita punya data default
        setRates({ USD: 0.000061 }); // Fallback rate
      } finally {
        setIsLoadingRates(false);
      }
    };

    loadInitialSettings();
  }, []); // Array dependensi kosong berarti hanya berjalan sekali

  // Fungsi baru untuk mengganti mata uang dan menyimpannya
  const setCurrency = async (newCurrency) => {
    try {
      await saveSetting("currency", newCurrency);
      setCurrencyState(newCurrency);
    } catch (error) {
      console.error("Gagal menyimpan pengaturan mata uang:", error);
    }
  };

  // --- FUNGSI FORMATTER YANG TELAH DIPERBARUI ---
  // Sekarang fungsi ini melakukan konversi SEBELUM memformat
  const formatCurrency = (amountInIDR) => {
    // Jika amount null atau undefined, tampilkan format default
    const amount = amountInIDR || 0;

    // Jika kurs belum siap, tampilkan format IDR sebagai default
    if (isLoadingRates || !rates) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    }

    // Logika Konversi dan Format
    if (currency === "USD") {
      const convertedAmount = amount * rates.USD;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2, // Dolar biasanya pakai 2 desimal
      }).format(convertedAmount);
    }

    // Default-nya adalah IDR (tanpa konversi)
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Nilai yang akan dibagikan ke seluruh aplikasi
  const value = {
    currency,
    setCurrency, // Fungsi yang diperbarui
    formatCurrency, // Fungsi yang diperbarui
    isLoadingRates, // Bagikan status loading jika diperlukan di UI
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook tidak perlu diubah
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency harus digunakan di dalam CurrencyProvider");
  }
  return context;
};
