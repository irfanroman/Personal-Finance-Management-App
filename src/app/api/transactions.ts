/**
 * Transaction API Service
 * Handles all transaction-related API calls to the backend
 */
import { Transaction, TransactionFormData } from '../types/transaction';
import { projectId } from '../../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

/**
 * Get authorization header with current session token
 */
async function getAuthHeader(): Promise<{ Authorization: string } | {}> {
  // Get token from Supabase session
  const { supabase } = await import('../lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
}

/**
 * Fetch all transactions for the current user
 */
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transactions');
    }

    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

/**
 * Create a new transaction
 */
export async function createTransaction(transaction: Transaction): Promise<Transaction> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }

    const data = await response.json();
    return data.transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(id: string, updates: Partial<TransactionFormData>): Promise<Transaction> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update transaction');
    }

    const data = await response.json();
    return data.transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete transaction');
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
