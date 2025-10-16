import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Alert } from "react-native";
import {
  getTransactions,
  getCategories,
  getCurrentBalance,
  getMonthlyIncome,
  getMonthlySpending,
  getSaving,
  getDailySpending,
  getMonthlyBudget,
} from "../services/database";

const AppContext = createContext();

// This is the correct, full version of the AppProvider
export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [spending, setSpending] = useState(0);
  const [savings, setSavings] = useState([]);
  const [dailySpending, setDailySpending] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [
        fetchedTransactions,
        fetchedCategories,
        fetchedBalance,
        fetchedIncome,
        fetchedSpending,
        fetchedSavings,
        fetchedDailySpending,
        fetchedMonthlyBudget,
      ] = await Promise.all([
        getTransactions(),
        getCategories(),
        getCurrentBalance(),
        getMonthlyIncome(),
        getMonthlySpending(),
        getSaving(),
        getDailySpending(),
        getMonthlyBudget(),
      ]);

      setTransactions(fetchedTransactions || []);
      setCategories(fetchedCategories || []);
      setBalance(fetchedBalance || 0);
      setIncome(fetchedIncome || 0);
      setSpending(fetchedSpending || 0);
      setSavings(fetchedSavings || []);
      setDailySpending(fetchedDailySpending || 0);
      setMonthlyBudget(fetchedMonthlyBudget || 0);
    } catch (error) {
      console.error("Gagal me-refresh data di AppContext:", error);
      Alert.alert("Error", "Gagal menyegarkan data aplikasi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Panggil refreshData saat provider pertama kali dimuat
    refreshData();
  }, []); // Dependensi kosong agar hanya berjalan sekali di awal

  const value = {
    transactions,
    categories,
    balance,
    income,
    spending,
    savings,
    dailySpending,
    monthlyBudget,
    isLoading,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// This custom hook makes it easy for other components to access the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp harus digunakan di dalam AppProvider");
  }
  return context;
};
