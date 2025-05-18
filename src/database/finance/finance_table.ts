import * as SQLite from "expo-sqlite";
import { db } from "../database";

export async function FinanceTables() {
  try {
    if (!db) throw new Error("Database connection is null");

    const statements = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,

      // Accounts table (simplified for the UI)
      `CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,  -- 'cash', 'bank', 'digital_wallet', etc.
        current_balance REAL DEFAULT 0,
        color TEXT DEFAULT '#3498db',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Expense categories table (matches UI categories)
      `CREATE TABLE IF NOT EXISTS expense_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Income categories table (matches UI categories)
      `CREATE TABLE IF NOT EXISTS income_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        created AT DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`,

      // Expenses table (matches UI requirements)
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_id INTEGER NOT NULL,
        category_id INTEGER,
        amount REAL NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_need INTEGER DEFAULT 0,  -- 0 = want, 1 = need
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL
      );`,

      // Income table (simplified for UI)
      `CREATE TABLE IF NOT EXISTS income (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_id INTEGER NOT NULL,
        category_id INTEGER,
        amount REAL NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES income_categories(id) ON DELETE SET NULL
      );`,

      // Budgets table (matches UI requirements)
      `CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        period TEXT NOT NULL DEFAULT 'monthly',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
      );`,

      // Insert default categories (matches UI)
      `INSERT OR IGNORE INTO expense_categories (user_id, name, icon, color) VALUES
        (1, 'Food', 'fast-food', '#e74c3c'),
        (1, 'Transport', 'bus', '#f39c12'),
        (1, 'Entertainment', 'film', '#3498db'),
        (1, 'Education', 'book', '#2ecc71'),
        (1, 'Other', 'pricetag', '#9b59b6');`,

      `INSERT OR IGNORE INTO income_categories (user_id, name, icon, color) VALUES
        (1, 'Allowance', 'cash', '#27ae60'),
        (1, 'Part-time Job', 'briefcase', '#16a085'),
        (1, 'Other', 'wallet', '#1abc9c');`,

      // Create default account
      `INSERT OR IGNORE INTO accounts (user_id, name, type, current_balance, color) VALUES
        (1, 'Main Wallet', 'cash', 0, '#3498db');`,

      // Indexes for performance
      `CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);`,
      `CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, date);`,
      `CREATE INDEX IF NOT EXISTS idx_budgets_user ON budgets(user_id);`,

      // Trigger: Update account balance when income is added
      `CREATE TRIGGER IF NOT EXISTS update_account_balance_income
        AFTER INSERT ON income
        FOR EACH ROW
        BEGIN
          UPDATE accounts SET current_balance = current_balance + NEW.amount 
          WHERE id = NEW.account_id;
        END;`,

      // Trigger: Update account balance when expense is added
      `CREATE TRIGGER IF NOT EXISTS update_account_balance_expense
        AFTER INSERT ON expenses
        FOR EACH ROW
        BEGIN
          UPDATE accounts SET current_balance = current_balance - NEW.amount 
          WHERE id = NEW.account_id;
        END;`,

      // Trigger: Update transaction timestamps
      `CREATE TRIGGER IF NOT EXISTS update_income_timestamp
        AFTER UPDATE ON income
        FOR EACH ROW
        BEGIN
          UPDATE income SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;`,

      `CREATE TRIGGER IF NOT EXISTS update_expense_timestamp
        AFTER UPDATE ON expenses
        FOR EACH ROW
        BEGIN
          UPDATE expenses SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;`
    ];

    // Execute statements one-by-one
    for (const sql of statements) {
      await db.execAsync(sql);
    }

    console.log("Finance tables initialized successfully");
    return db;
  } catch (error) {
    console.error("Error setting up Finance database:", error);
    return null;
  }
}