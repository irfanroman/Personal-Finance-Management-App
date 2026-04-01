/**
 * Financial calculation utilities
 */
import { Transaction } from '../types/transaction';

/**
 * Get the start and end dates for a given month
 */
export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return { start, end };
}

/**
 * Check if a date string falls within a given month
 */
export function isInMonth(dateString: string, year: number, month: number): boolean {
  const date = new Date(dateString);
  return date.getFullYear() === year && date.getMonth() === month;
}

/**
 * Calculate total for transactions in a specific month
 */
export function calculateMonthlyTotal(
  transactions: Transaction[],
  year: number,
  month: number,
  type?: 'income' | 'expense'
): number {
  return transactions
    .filter((t) => {
      const matchesMonth = isInMonth(t.date, year, month);
      const matchesType = type ? t.type === type : true;
      return matchesMonth && matchesType;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get previous month's year and month
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
}

/**
 * Calculate the percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get unique months from transactions (sorted by date, newest first)
 */
export function getAvailableMonths(transactions: Transaction[]): Array<{ year: number; month: number; label: string }> {
  const monthsSet = new Set<string>();
  
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthsSet.add(key);
  });

  const months = Array.from(monthsSet).map((key) => {
    const [year, month] = key.split('-').map(Number);
    const date = new Date(year, month, 1);
    const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    return { year, month, label, sortKey: year * 12 + month };
  });

  // Sort by date, newest first
  months.sort((a, b) => b.sortKey - a.sortKey);
  
  return months;
}