import * as SQLite from "expo-sqlite";

let db;

// Fungsi untuk membuat atau membuka koneksi database
const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("cekcuan.db");
  }
  return db;
};

// --- Inisialisasi Database dan Tabel ---
export const initDB = async () => {
  try {
    const database = await initializeDatabase();
    await database.withTransactionAsync(async () => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, icon TEXT);

        -- --- PERBAIKAN DI SINI ---
        -- Menambahkan kolom 'bgColor TEXT' ke dalam definisi tabel savings
        CREATE TABLE IF NOT EXISTS savings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          target REAL NOT NULL,
          current REAL DEFAULT 0,
          bgColor TEXT
        );
        -- --- AKHIR DARI PERBAIKAN ---

        CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, description TEXT, details TEXT, type TEXT NOT NULL, category_id INTEGER, saving_id INTEGER, date TEXT NOT NULL, FOREIGN KEY(category_id) REFERENCES categories(id), FOREIGN KEY(saving_id) REFERENCES savings(id));
        CREATE TABLE IF NOT EXISTS monthly_budgets (id INTEGER PRIMARY KEY AUTOINCREMENT, month INTEGER NOT NULL, year INTEGER NOT NULL, amount REAL NOT NULL, UNIQUE(month, year));
        CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
      `);
      await database.runAsync(
        `INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?);`,
        [
          "Pemasukan",
          "cash",
          "Pengeluaran",
          "cash-minus",
          "Makanan",
          "silverware-fork-knife",
          "Belanja",
          "shopping-outline",
          "Tabungan",
          "piggy-bank",
          "Alokasi",
          "arrow-down-bold-box-outline",
        ],
      );
    });
    console.log("Database dan semua tabel berhasil diinisialisasi.");
  } catch (error) {
    console.error("Gagal inisialisasi DB:", error);
    throw error;
  }
};

// --- FUNGSI PENGATURAN (SETTINGS) ---
export const saveSetting = async (key, value) => {
  try {
    const database = await initializeDatabase();
    await database.runAsync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);`,
      [key, value.toString()],
    );
  } catch (error) {
    console.error(`Gagal menyimpan pengaturan untuk key: ${key}`, error);
    throw error;
  }
};

export const getSetting = async (key) => {
  try {
    const database = await initializeDatabase();
    const result = await database.getFirstAsync(
      `SELECT value FROM settings WHERE key = ?;`,
      [key],
    );
    return result?.value || null;
  } catch (error) {
    console.error(`Gagal mengambil pengaturan untuk key: ${key}`, error);
    throw error;
  }
};

// --- FUNGSI-FUNGSI LAINNYA ---
const getMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString();
  return { startOfMonth, endOfMonth };
};

export const addMonthlyBudget = async (amount) => {
  const database = await initializeDatabase();
  const now = new Date();
  await database.runAsync(
    `INSERT OR REPLACE INTO monthly_budgets (month, year, amount) VALUES (?, ?, ?);`,
    [now.getMonth() + 1, now.getFullYear(), amount],
  );
};

export const getMonthlyBudget = async () => {
  const database = await initializeDatabase();
  const now = new Date();
  const result = await database.getFirstAsync(
    `SELECT amount FROM monthly_budgets WHERE month = ? AND year = ?;`,
    [now.getMonth() + 1, now.getFullYear()],
  );
  return result?.amount || 0;
};

export const getMonthlyIncome = async () => {
  const database = await initializeDatabase();
  const { startOfMonth, endOfMonth } = getMonthRange();
  const result = await database.getFirstAsync(
    `SELECT SUM(amount) AS total FROM transactions WHERE type = 'pemasukan' AND date BETWEEN ? AND ?;`,
    [startOfMonth, endOfMonth],
  );
  return result?.total || 0;
};

export const getMonthlySpending = async () => {
  const database = await initializeDatabase();
  const { startOfMonth, endOfMonth } = getMonthRange();
  const result = await database.getFirstAsync(
    `SELECT SUM(amount) AS total FROM transactions WHERE type = 'pengeluaran' AND date BETWEEN ? AND ?;`,
    [startOfMonth, endOfMonth],
  );
  return result?.total || 0;
};

export const getDailySpending = async () => {
  const database = await initializeDatabase();
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  ).toISOString();
  const result = await database.getFirstAsync(
    `SELECT SUM(amount) AS total FROM transactions WHERE type = 'pengeluaran' AND date BETWEEN ? AND ?;`,
    [startOfDay, endOfDay],
  );
  return result?.total || 0;
};

export const getCurrentBalance = async () => {
  const database = await initializeDatabase();
  const result = await database.getFirstAsync(
    `SELECT SUM(CASE WHEN type = 'pemasukan' THEN amount WHEN type = 'pengeluaran' THEN -amount ELSE 0 END) AS balance FROM transactions;`,
  );
  return result?.balance || 0;
};

export const addTransaction = async (
  amount,
  description,
  type,
  categoryId,
  details,
) => {
  const database = await initializeDatabase();
  await database.runAsync(
    `INSERT INTO transactions (amount, description, details, type, category_id, date) VALUES (?, ?, ?, ?, ?, ?);`,
    [amount, description, details, type, categoryId, new Date().toISOString()],
  );
};

export const getTransactions = async () => {
  const database = await initializeDatabase();
  return await database.getAllAsync(
    `SELECT t.*, c.name as category_name, c.icon as category_icon FROM transactions t LEFT JOIN categories c ON t.category_id = c.id ORDER BY t.date DESC;`,
  );
};

export const getCategories = async () => {
  const database = await initializeDatabase();
  return await database.getAllAsync(`SELECT * FROM categories;`);
};

export const addSaving = async (name, target, bgColor) => {
  const database = await initializeDatabase();
  // Kode ini sekarang akan bekerja dengan benar karena kolomnya sudah ada
  await database.runAsync(
    `INSERT INTO savings (name, target, bgColor, current) VALUES (?, ?, ?, 0);`,
    [name, target, bgColor],
  );
};

export const getSaving = async () => {
  const database = await initializeDatabase();
  return await database.getAllAsync(`SELECT * FROM savings`);
};

export const addFundsToSaving = async (savingId, amountToAdd) => {
  const database = await initializeDatabase();
  await database.withTransactionAsync(async () => {
    await database.runAsync(
      `INSERT INTO transactions (amount, description, type, category_id, date) VALUES (?, ?, ?, ?, ?);`,
      [
        amountToAdd,
        `Menabung ke target ID: ${savingId}`,
        "alokasi",
        5,
        new Date().toISOString(),
      ],
    );
    await database.runAsync(
      `UPDATE savings SET current = current + ? WHERE id = ?;`,
      [amountToAdd, savingId],
    );
  });
};

export const deleteSaving = async (savingId) => {
  const database = await initializeDatabase();
  await database.runAsync(`DELETE FROM savings WHERE id = ?;`, [savingId]);
};

export const deleteAllData = async () => {
  const database = await initializeDatabase();
  await database.withTransactionAsync(async () => {
    await database.runAsync("DELETE FROM transactions;");
    await database.runAsync("DELETE FROM savings;");
    await database.runAsync("DELETE FROM monthly_budgets;");
    await database.runAsync("DELETE FROM categories;");
    await database.runAsync(
      `INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?);`,
      [
        "Pemasukan",
        "cash",
        "Pengeluaran",
        "cash-minus",
        "Makanan",
        "silverware-fork-knife",
        "Belanja",
        "shopping-outline",
        "Tabungan",
        "piggy-bank",
        "Alokasi",
        "arrow-down-bold-box-outline",
      ],
    );
  });
};
