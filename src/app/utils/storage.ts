/**
 * LocalStorage utilities for persisting transactions
 */
import { Transaction } from '../types/transaction';

const STORAGE_KEY = 'finance_transactions';

/**
 * Load transactions from localStorage
 */
export function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
  return [];
}

/**
 * Save transactions to localStorage
 */
export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}
