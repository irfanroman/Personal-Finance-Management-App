/**
 * SummaryCards Component
 * Displays summary statistics including total expenses, income, and monthly comparison
 */
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpDown } from 'lucide-react';

interface SummaryCardsProps {
  currentMonthIncome: number;
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  totalBalance: number;
}

export function SummaryCards({
  currentMonthIncome,
  currentMonthExpenses,
  previousMonthExpenses,
  totalBalance,
}: SummaryCardsProps) {
  // Calculate expense change
  const expenseChange = currentMonthExpenses - previousMonthExpenses;
  const expenseChangePercent =
    previousMonthExpenses > 0 ? ((expenseChange / previousMonthExpenses) * 100).toFixed(1) : '0.0';
  const isExpenseIncreased = expenseChange > 0;

  // Calculate net (income - expenses)
  const netAmount = currentMonthIncome - currentMonthExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      {/* Current Month Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(currentMonthIncome)}</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>

      {/* Current Month Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(currentMonthExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">vs Last Month</CardTitle>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div
              className={`text-2xl font-bold ${
                isExpenseIncreased ? 'text-red-600' : expenseChange < 0 ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              {isExpenseIncreased ? '+' : ''}
              {formatCurrency(Math.abs(expenseChange))}
            </div>
            {expenseChange !== 0 && (
              <div
                className={`flex items-center text-xs ${
                  isExpenseIncreased ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {isExpenseIncreased ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(Number(expenseChangePercent))}%
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isExpenseIncreased
              ? 'Spending increased'
              : expenseChange < 0
              ? 'Spending decreased'
              : 'No change'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
