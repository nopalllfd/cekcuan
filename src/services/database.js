import * as SQLite from 'expo-sqlite';

// --- BAGIAN YANG HILANG ---
// Variabel untuk menyimpan koneksi database
let db;

// Fungsi untuk membuat atau membuka koneksi database
const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cekcuan.db');
  }
  return db;
};
// --------------------------

export const initDB = async () => {
  try {
    const database = await initializeDatabase();

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, icon TEXT
      );
      CREATE TABLE IF NOT EXISTS savings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, target REAL NOT NULL, current REAL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, description TEXT, details TEXT, type TEXT NOT NULL,
        category_id INTEGER, saving_id INTEGER, date TEXT NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories(id), FOREIGN KEY(saving_id) REFERENCES savings(id)
      );
      CREATE TABLE IF NOT EXISTS monthly_budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, month INTEGER NOT NULL, year INTEGER NOT NULL, amount REAL NOT NULL, UNIQUE(month, year)
      );
    `);

    await database.runAsync(
      `INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?);`,
      'Pemasukan',
      'cash',
      'Pengeluaran',
      'cash-minus',
      'Makanan',
      'silverware-fork-knife',
      'Belanja',
      'shopping-outline',
      'Tabungan',
      'piggy-bank'
    );
  } catch (error) {
    console.error('Gagal inisialisasi DB:', error);
    throw error;
  }
};

// --- FUNGSI ANGGARAN ---
export const addMonthlyBudget = async (amount) => {
  const database = await initializeDatabase();
  const now = new Date();
  await database.runAsync(`INSERT OR REPLACE INTO monthly_budgets (month, year, amount) VALUES (?, ?, ?);`, now.getMonth() + 1, now.getFullYear(), amount);
};

export const getMonthlyBudget = async () => {
  const database = await initializeDatabase();
  const now = new Date();
  const result = await database.getFirstAsync(`SELECT amount FROM monthly_budgets WHERE month = ? AND year = ?;`, now.getMonth() + 1, now.getFullYear());
  return result ? result.amount : 0;
};

// --- FUNGSI PERHITUNGAN TRANSAKSI ---
const getMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { startOfMonth, endOfMonth };
};

export const getMonthlyIncome = async () => {
  const database = await initializeDatabase();
  const { startOfMonth, endOfMonth } = getMonthRange();
  const result = await database.getFirstAsync(`SELECT SUM(amount) AS total FROM transactions WHERE type = 'pemasukan' AND date BETWEEN ? AND ?;`, startOfMonth, endOfMonth);
  return result?.total || 0;
};

export const getMonthlySpending = async () => {
  const database = await initializeDatabase();
  const { startOfMonth, endOfMonth } = getMonthRange();
  const result = await database.getFirstAsync(`SELECT SUM(amount) AS total FROM transactions WHERE type = 'pengeluaran' AND date BETWEEN ? AND ?;`, startOfMonth, endOfMonth);
  return result?.total || 0;
};

// Tambahkan fungsi ini di dalam file database.js Anda

export const getMonthlySavings = async () => {
  try {
    const database = await initializeDatabase();
    const { startOfMonth, endOfMonth } = getMonthRange(); // Gunakan fungsi getMonthRange yang sudah ada

    // Query ini menjumlahkan semua transaksi yang kategorinya 'Tabungan'
    const result = await database.getFirstAsync(
      `
      SELECT SUM(t.amount) AS total 
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE c.name = 'Tabungan' AND t.date BETWEEN ? AND ?;
    `,
      startOfMonth,
      endOfMonth
    );

    return result?.total || 0;
  } catch (error) {
    console.error('Gagal mengambil total tabungan:', error);
    throw error;
  }
};

export const getCurrentBalance = async () => {
  try {
    const database = await initializeDatabase();
    const result = await database.getFirstAsync(`
        SELECT SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END) AS balance FROM transactions;
      `);
    return result.balance || 0;
  } catch (error) {
    console.error('Gagal mengambil saldo:', error);
    throw error;
  }
};

// --- FUNGSI MANAJEMEN TRANSAKSI & KATEGORI ---
export const addTransaction = async (amount, description, type, categoryId, details) => {
  const database = await initializeDatabase();
  await database.runAsync(`INSERT INTO transactions (amount, description, details, type, category_id, date) VALUES (?, ?, ?, ?, ?, ?);`, amount, description, details, type, categoryId, new Date().toISOString());
};

export const getTransactions = async () => {
  const database = await initializeDatabase();
  return await database.getAllAsync(`
    SELECT t.*, c.name as category_name, c.icon as category_icon 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    ORDER BY t.date DESC;
  `);
};

export const getCategories = async () => {
  const database = await initializeDatabase();
  return await database.getAllAsync(`SELECT * FROM categories;`);
};

export const addCategory = async (name, icon) => {
  const database = await initializeDatabase();
  await database.runAsync(`INSERT INTO categories (name, icon) VALUES (?, ?);`, name, icon);
};

// Tambahkan fungsi ini di dalam file database.js

export const getDailySpending = async () => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    // Mengatur waktu ke awal dan akhir HARI INI
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    const result = await database.getFirstAsync(`SELECT SUM(amount) AS total FROM transactions WHERE type = 'pengeluaran' AND date BETWEEN ? AND ?;`, startOfDay, endOfDay);
    return result?.total || 0;
  } catch (error) {
    console.error('Gagal mengambil pengeluaran harian:', error);
    throw error;
  }
};
