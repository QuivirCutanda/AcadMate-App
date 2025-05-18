import { db } from "../database";
import { EventEmitter } from "events";

// Types
type Transaction = {
  id?: number;
  userId: number;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  categoryId: number;
  date: string;
  isNeed?: boolean;
  description?: string;
  accountId: number;
};

type Budget = {
  id?: number;
  userId: number;
  categoryId: number;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
};

type Category = {
  id: number;
  name: string;
  icon: string;
  type: 'income' | 'expense';
  color: string;
};

type MonthlySummary = {
  income: number;
  expenses: number;
  balance: number;
};

type BudgetProgress = {
  categoryId: number;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  progress: number;
};

export const financeEventEmitter = new EventEmitter();

// TRANSACTION OPERATIONS

export const insertTransaction = async (transaction: Transaction): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const table = transaction.type === 'income' ? 'income' : 'expenses';
    const isNeedField = transaction.type === 'expense' ? ', is_need' : '';
    const isNeedValue = transaction.type === 'expense' ? ', ?' : '';

    const result = await db.runAsync(
      `INSERT INTO ${table} 
      (user_id, account_id, category_id, amount, title, description, date${isNeedField}, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?${isNeedValue}, CURRENT_TIMESTAMP)`,
      [
        transaction.userId,
        transaction.accountId,
        transaction.categoryId,
        transaction.amount,
        transaction.title,
        transaction.description || null,
        transaction.date,
        ...(transaction.type === 'expense' ? [transaction.isNeed ? 1 : 0] : [])
      ]
    );
    
    financeEventEmitter.emit('transactionsUpdated');
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error("Error inserting transaction:", error);
    return null;
  }
};

export const updateTransaction = async (transactionId: number, transaction: Transaction): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const table = transaction.type === 'income' ? 'income' : 'expenses';
    const isNeedField = transaction.type === 'expense' ? ', is_need = ?' : '';

    const params = [
      transaction.accountId,
      transaction.categoryId,
      transaction.amount,
      transaction.title,
      transaction.description || null,
      transaction.date,
      ...(transaction.type === 'expense' ? [transaction.isNeed ? 1 : 0] : []),
      transactionId
    ];

    const result = await db.runAsync(
      `UPDATE ${table} SET 
        account_id = ?, 
        category_id = ?, 
        amount = ?, 
        title = ?, 
        description = ?, 
        date = ?,
        updated_at = CURRENT_TIMESTAMP
        ${isNeedField}
      WHERE id = ?`,
      params
    );
    
    if (result.changes > 0) {
      financeEventEmitter.emit('transactionsUpdated');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating transaction:", error);
    return false;
  }
};

export const deleteTransaction = async (transactionId: number, type: 'income' | 'expense'): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const table = type === 'income' ? 'income' : 'expenses';
    const result = await db.runAsync(
      `DELETE FROM ${table} WHERE id = ?`,
      [transactionId]
    );
    
    if (result.changes > 0) {
      financeEventEmitter.emit('transactionsUpdated');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return false;
  }
};

export const getTransactions = async (
  userId: number,
  startDate: string,
  endDate: string,
  type?: 'income' | 'expense'
): Promise<Transaction[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    let query: string;
    const params = [userId, startDate, endDate];

    if (type === 'income') {
      query = `
        SELECT 
          id, 
          user_id as userId,
          'income' as type,
          title,
          amount,
          category_id as categoryId,
          date,
          NULL as isNeed,
          description,
          account_id as accountId
        FROM income
        WHERE user_id = ? AND date BETWEEN ? AND ?
        ORDER BY date DESC
      `;
    } else if (type === 'expense') {
      query = `
        SELECT 
          id, 
          user_id as userId,
          'expense' as type,
          title,
          amount,
          category_id as categoryId,
          date,
          is_need as isNeed,
          description,
          account_id as accountId
        FROM expenses
        WHERE user_id = ? AND date BETWEEN ? AND ?
        ORDER BY date DESC
      `;
    } else {
      query = `
        SELECT 
          id, 
          user_id as userId,
          'income' as type,
          title,
          amount,
          category_id as categoryId,
          date,
          NULL as isNeed,
          description,
          account_id as accountId
        FROM income
        WHERE user_id = ? AND date BETWEEN ? AND ?

        UNION ALL

        SELECT 
          id, 
          user_id as userId,
          'expense' as type,
          title,
          amount,
          category_id as categoryId,
          date,
          is_need as isNeed,
          description,
          account_id as accountId
        FROM expenses
        WHERE user_id = ? AND date BETWEEN ? AND ?

        ORDER BY date DESC
      `;
      params.push(...params);
    }

    const results = await db.getAllAsync(query, params);
    return results as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};

export const getTransactionById = async (
  transactionId: number, 
  type: 'income' | 'expense'
): Promise<Transaction | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const table = type === 'income' ? 'income' : 'expenses';
    const isNeedField = type === 'expense' ? ', is_need as isNeed' : '';
    
    const result = await db.getFirstAsync(
      `SELECT 
        id, 
        user_id as userId,
        '${type}' as type,
        title,
        amount,
        category_id as categoryId,
        date
        ${isNeedField},
        description,
        account_id as accountId
      FROM ${table} 
      WHERE id = ?`,
      [transactionId]
    );
    
    return result as Transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
};

// BUDGET OPERATIONS

export const insertBudget = async (budget: Budget): Promise<number | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      `INSERT INTO budgets 
      (user_id, category_id, amount, period, created_at) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        budget.userId,
        budget.categoryId,
        budget.amount,
        budget.period
      ]
    );
    
    financeEventEmitter.emit('budgetsUpdated');
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error("Error inserting budget:", error);
    return null;
  }
};

export const updateBudget = async (budgetId: number, budget: Budget): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      `UPDATE budgets SET 
        category_id = ?, 
        amount = ?, 
        period = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`,
      [
        budget.categoryId,
        budget.amount,
        budget.period,
        budgetId,
        budget.userId
      ]
    );
    
    if (result.changes > 0) {
      financeEventEmitter.emit('budgetsUpdated');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating budget:", error);
    return false;
  }
};

export const deleteBudget = async (budgetId: number, userId: number): Promise<boolean> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.runAsync(
      `DELETE FROM budgets WHERE id = ? AND user_id = ?`,
      [budgetId, userId]
    );
    
    if (result.changes > 0) {
      financeEventEmitter.emit('budgetsUpdated');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting budget:", error);
    return false;
  }
};

export const getBudgets = async (userId: number): Promise<Budget[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const results = await db.getAllAsync(
      `SELECT 
        id, 
        user_id as userId,
        category_id as categoryId,
        amount,
        period
      FROM budgets 
      WHERE user_id = ?`,
      [userId]
    );
    
    return results as Budget[];
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return null;
  }
};

export const getBudgetById = async (budgetId: number, userId: number): Promise<Budget | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const result = await db.getFirstAsync(
      `SELECT 
        id, 
        user_id as userId,
        category_id as categoryId,
        amount,
        period
      FROM budgets 
      WHERE id = ? AND user_id = ?`,
      [budgetId, userId]
    );
    
    return result as Budget;
  } catch (error) {
    console.error("Error fetching budget:", error);
    return null;
  }
};

// CATEGORY OPERATIONS

export const getCategories = async (type: 'income' | 'expense'): Promise<Category[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const table = type === 'income' ? 'income_categories' : 'expense_categories';
    const results = await db.getAllAsync(
      `SELECT 
        id, 
        name,
        icon,
        '${type}' as type,
        color
      FROM ${table}
      WHERE user_id = 1`  // Assuming user_id 1 for simplicity
    );
    
    return results as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

// SUMMARY OPERATIONS

export const getMonthlySummary = async (
  userId: number, 
  month: number, 
  year: number
): Promise<MonthlySummary | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const incomeResult = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM income 
       WHERE user_id = ? AND date BETWEEN ? AND ?`,
      [userId, startDate, endDate]
    );

    const expenseResult = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = ? AND date BETWEEN ? AND ?`,
      [userId, startDate, endDate]
    );

    const accountResult = await db.getFirstAsync<{ balance: number }>(
      `SELECT current_balance as balance 
       FROM accounts 
       WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    return {
      income: incomeResult?.total || 0,
      expenses: expenseResult?.total || 0,
      balance: accountResult?.balance || 0
    };
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    return null;
  }
};

export const getBudgetProgress = async (
  userId: number, 
  month: number, 
  year: number
): Promise<BudgetProgress[] | null> => {
  try {
    if (!db) throw new Error("Database connection is null");

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const results = await db.getAllAsync(
      `SELECT 
        b.category_id as categoryId,
        ec.name as categoryName,
        b.amount as budgetAmount,
        COALESCE((
          SELECT SUM(e.amount) 
          FROM expenses e 
          WHERE e.category_id = b.category_id 
          AND e.user_id = b.user_id 
          AND e.date BETWEEN ? AND ?
        ), 0) as spentAmount,
        COALESCE((
          SELECT (SUM(e.amount) / b.amount) * 100
          FROM expenses e 
          WHERE e.category_id = b.category_id 
          AND e.user_id = b.user_id 
          AND e.date BETWEEN ? AND ?
        ), 0) as progress
      FROM budgets b
      JOIN expense_categories ec ON b.category_id = ec.id
      WHERE b.user_id = ? 
      AND b.period = 'monthly'`,
      [startDate, endDate, startDate, endDate, userId]
    );
    
    return results as BudgetProgress[];
  } catch (error) {
    console.error("Error fetching budget progress:", error);
    return null;
  }
};

// SUBSCRIPTIONS

export const subscribeToTransactionsUpdates = (callback: () => void) => {
  financeEventEmitter.on('transactionsUpdated', callback);
  return () => {
    financeEventEmitter.off('transactionsUpdated', callback);
  };
};

export const subscribeToBudgetsUpdates = (callback: () => void) => {
  financeEventEmitter.on('budgetsUpdated', callback);
  return () => {
    financeEventEmitter.off('budgetsUpdated', callback);
  };
};