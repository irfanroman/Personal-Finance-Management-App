/**
 * Transaction Type Definition
 * Represents a financial transaction (income or expense)
 */
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string (YYYY-MM-DD)
  type: 'income' | 'expense';
}

export type TransactionFormData = Omit<Transaction, 'id'>;
