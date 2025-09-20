import * as SQLite from 'expo-sqlite';

let db;

const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cekcuan.db');
  }
  return db;
};

export const initDB = async () => {
  try {
    const database = await initializeDatabase();

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        icon TEXT
      );
    `);
    console.log('Tabel `categories` berhasil dibuat.');

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS savings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target REAL NOT NULL,
        current REAL DEFAULT 0
      );
    `);
    console.log('Tabel `savings` berhasil dibuat.');

    await database.execAsync(`
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
    `);
    console.log('Tabel `transactions` berhasil dibuat.');

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

    try {
      await database.runAsync(`ALTER TABLE transactions ADD COLUMN details TEXT;`);
      console.log('Kolom `details` berhasil ditambahkan.');
    } catch (e) {
      console.log('Kolom `details` sudah ada.');
    }
  } catch (error) {
    console.error('Gagal menginisialisasi database:', error);
    throw error;
  }
};

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
