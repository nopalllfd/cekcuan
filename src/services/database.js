import * as SQLite from 'expo-sqlite';

let db;

const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cekcuan.db');
  }
  return db;
};

// --- Inisialisasi Database dan Tabel ---
export const initDB = async () => {
  try {
    const database = await initializeDatabase();

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        icon TEXT
      );
      
      CREATE TABLE IF NOT EXISTS savings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target REAL NOT NULL,
        current REAL DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        description TEXT,
        details TEXT,
        type TEXT NOT NULL,
        category_id INTEGER,
        saving_id INTEGER,
        date TEXT NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories(id),
        FOREIGN KEY(saving_id) REFERENCES savings(id)
      );
      
      -- Tabel untuk Anggaran Bulanan
      CREATE TABLE IF NOT EXISTS monthly_budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        amount REAL NOT NULL,
        UNIQUE(month, year)
      );

      -- Tabel untuk Pemasukan Bulanan (Target)
      CREATE TABLE IF NOT EXISTS monthly_incomes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        amount REAL NOT NULL,
        UNIQUE(month, year)
      );
    `);
    console.log('Semua tabel berhasil dibuat atau sudah ada.');

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
    console.log('Kategori default berhasil ditambahkan.');
  } catch (error) {
    console.error('Gagal menginisialisasi database:', error);
    throw error;
  }
};

// --- Fungsi Pemasukan & Anggaran (Target) ---
export const addMonthlyBudget = async (amount) => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    await database.runAsync(`INSERT OR REPLACE INTO monthly_budgets (month, year, amount) VALUES (?, ?, ?);`, month, year, amount);
    console.log('Anggaran bulanan berhasil ditambahkan atau diperbarui.');
  } catch (error) {
    console.error('Gagal menambahkan anggaran bulanan:', error);
    throw error;
  }
};

export const getMonthlyBudget = async () => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const result = await database.getFirstAsync(`SELECT amount FROM monthly_budgets WHERE month = ? AND year = ?;`, month, year);
    return result ? result.amount : null;
  } catch (error) {
    console.error('Gagal mengambil anggaran bulanan:', error);
    throw error;
  }
};

export const addMonthlyIncome = async (amount) => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    await database.runAsync(`INSERT OR REPLACE INTO monthly_incomes (month, year, amount) VALUES (?, ?, ?);`, month, year, amount);
    console.log('Pemasukan bulanan berhasil ditambahkan atau diperbarui.');
  } catch (error) {
    console.error('Gagal menambahkan pemasukan bulanan:', error);
    throw error;
  }
};

// Ganti fungsi getMonthlyIncome yang lama dengan yang ini:

export const getMonthlyIncome = async () => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const result = await database.getFirstAsync(`SELECT amount FROM monthly_incomes WHERE month = ? AND year = ?;`, month, year);
    return result ? result.amount : 0; // Return 0 instead of null if no data
  } catch (error) {
    console.error('Gagal mengambil pemasukan bulanan:', error);
    throw error;
  }
};

// Jika Anda ingin mendapatkan total pemasukan dari transaksi, buat fungsi terpisah:
export const getMonthlyIncomeFromTransactions = async () => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const result = await database.getFirstAsync(`SELECT SUM(amount) AS total_income FROM transactions WHERE type = 'pemasukan' AND date BETWEEN ? AND ?;`, startOfMonth, endOfMonth);
    return result.total_income || 0;
  } catch (error) {
    console.error('Gagal mengambil total pemasukan bulanan dari transaksi:', error);
    throw error;
  }
};

// Perbaiki juga getMonthlySpending untuk konsistensi case
export const getMonthlySpending = async () => {
  try {
    const database = await initializeDatabase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const result = await database.getFirstAsync(`SELECT SUM(amount) AS total_spending FROM transactions WHERE type = 'pengeluaran' AND date BETWEEN ? AND ?;`, startOfMonth, endOfMonth);
    return result.total_spending || 0;
  } catch (error) {
    console.error('Gagal mengambil total pengeluaran bulanan:', error);
    throw error;
  }
};

// --- Fungsi Transaksi & Kategori ---
export const addCategory = async (name, icon) => {
  try {
    const database = await initializeDatabase();
    await database.runAsync(`INSERT INTO categories (name, icon) VALUES (?, ?);`, name, icon);
    console.log('Kategori berhasil ditambahkan.');
  } catch (error) {
    console.error('Gagal menambahkan kategori:', error);
    throw error;
  }
};

export const addTransaction = async (amount, description, type, categoryId, savingId = null, details) => {
  try {
    const database = await initializeDatabase();
    await database.runAsync(`INSERT INTO transactions (amount, description, details, type, category_id, saving_id, date) VALUES (?, ?, ?, ?, ?, ?, ?);`, amount, description, details, type, categoryId, savingId, new Date().toISOString());
  } catch (error) {
    console.error('Gagal menambahkan transaksi:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const database = await initializeDatabase();
    const result = await database.getAllAsync(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, s.name as saving_name 
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN savings s ON t.saving_id = s.id
      ORDER BY t.date DESC;
    `);
    return result;
  } catch (error) {
    console.error('Gagal mengambil transaksi:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const database = await initializeDatabase();
    const result = await database.getAllAsync(`SELECT * FROM categories;`);
    return result;
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);
    throw error;
  }
};

export const getCurrentBalance = async () => {
  try {
    const database = await initializeDatabase();
    const result = await database.getFirstAsync(`
      SELECT SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) AS total_income,
      			SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) AS total_expense
      FROM transactions;
    `);
    const { total_income, total_expense } = result || { total_income: 0, total_expense: 0 };
    return (total_income || 0) - (total_expense || 0);
  } catch (error) {
    console.error('Gagal mengambil saldo:', error);
    throw error;
  }
};

export const deleteAllCategories = async () => {
  const database = await initializeDatabase();
  await database.runAsync('DELETE FROM categories;');
};
