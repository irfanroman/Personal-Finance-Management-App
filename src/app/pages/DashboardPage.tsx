/**
 * DashboardPage Component
 * Main finance dashboard (protected route) with Supabase integration
 */
import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '../types/transaction';
import {
  calculateMonthlyTotal,
  getPreviousMonth,
  getAvailableMonths,
  isInMonth,
} from '../utils/calculations';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactions';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { SummaryCards } from '../components/SummaryCards';
import { ExpenseChart } from '../components/ExpenseChart';
import { MonthFilter } from '../components/MonthFilter';
import { Button } from '../components/ui/button';
import { Plus, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load transactions from Supabase on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  /**
   * Load transactions from backend
   */
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error: any) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh transactions
   */
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadTransactions();
      toast.success('Transactions refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get current date info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Calculate previous month
  const { year: prevYear, month: prevMonth } = getPreviousMonth(currentYear, currentMonth);

  // Calculate totals
  const currentMonthIncome = calculateMonthlyTotal(transactions, currentYear, currentMonth, 'income');
  const currentMonthExpenses = calculateMonthlyTotal(transactions, currentYear, currentMonth, 'expense');
  const previousMonthExpenses = calculateMonthlyTotal(transactions, prevYear, prevMonth, 'expense');

  // Calculate total balance (all-time income - expenses)
  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  // Get available months for filtering
  const availableMonths = getAvailableMonths(transactions);

  // Filter transactions based on selected month
  const filteredTransactions = selectedMonth
    ? transactions.filter((t) => isInMonth(t.date, selectedMonth.year, selectedMonth.month))
    : transactions;

  /**
   * Handle adding a new transaction
   */
  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...data,
      };
      
      await createTransaction(newTransaction);
      setTransactions([...transactions, newTransaction]);
      toast.success('Transaction added successfully!');
    } catch (error: any) {
      console.error('Failed to add transaction:', error);
      toast.error(error.message || 'Failed to add transaction');
    }
  };

  /**
   * Handle editing an existing transaction
   */
  const handleEditTransaction = async (data: TransactionFormData) => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, data);
      
      const updatedTransactions = transactions.map((t) =>
        t.id === editingTransaction.id ? { ...t, ...data } : t
      );
      setTransactions(updatedTransactions);
      setEditingTransaction(undefined);
      toast.success('Transaction updated successfully!');
    } catch (error: any) {
      console.error('Failed to update transaction:', error);
      toast.error(error.message || 'Failed to update transaction');
    }
  };

  /**
   * Handle deleting a transaction
   */
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete transaction:', error);
      toast.error(error.message || 'Failed to delete transaction');
    }
  };

  /**
   * Open form for editing
   */
  const handleOpenEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  /**
   * Close form and reset editing state
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
    toast.success('Logged out successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Personal Finance Manager</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, <span className="font-semibold">{user?.name}</span>!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleRefresh} variant="outline" size="lg" disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsFormOpen(true)} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Transaction
              </Button>
              <Button onClick={handleLogout} variant="outline" size="lg">
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards
            currentMonthIncome={currentMonthIncome}
            currentMonthExpenses={currentMonthExpenses}
            previousMonthExpenses={previousMonthExpenses}
            totalBalance={totalBalance}
          />

          {/* Chart */}
          <ExpenseChart transactions={transactions} />

          {/* Month Filter */}
          {availableMonths.length > 0 && (
            <MonthFilter
              availableMonths={availableMonths}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          )}

          {/* Transaction List */}
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </main>

      {/* Transaction Form Dialog */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
}
