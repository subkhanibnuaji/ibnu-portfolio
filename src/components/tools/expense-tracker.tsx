'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusCircle,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Download,
  PieChart,
  BarChart3,
} from 'lucide-react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
}

type TimeFilter = 'all' | 'week' | 'month' | 'year'

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#ef4444' },
  { id: 'transport', name: 'Transportation', color: '#f97316' },
  { id: 'shopping', name: 'Shopping', color: '#eab308' },
  { id: 'bills', name: 'Bills & Utilities', color: '#22c55e' },
  { id: 'entertainment', name: 'Entertainment', color: '#3b82f6' },
  { id: 'health', name: 'Healthcare', color: '#8b5cf6' },
  { id: 'education', name: 'Education', color: '#ec4899' },
  { id: 'other', name: 'Other', color: '#6b7280' },
]

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: '#22c55e' },
  { id: 'freelance', name: 'Freelance', color: '#3b82f6' },
  { id: 'investment', name: 'Investment', color: '#8b5cf6' },
  { id: 'gift', name: 'Gift', color: '#ec4899' },
  { id: 'other_income', name: 'Other', color: '#6b7280' },
]

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('expenseTrackerData')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenseTrackerData', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      type,
      date,
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses]

    // Time filter
    const now = new Date()
    if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(e => new Date(e.date) >= weekAgo)
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      filtered = filtered.filter(e => new Date(e.date) >= monthAgo)
    } else if (timeFilter === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      filtered = filtered.filter(e => new Date(e.date) >= yearAgo)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(e => e.category === categoryFilter)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, timeFilter, categoryFilter])

  const stats = useMemo(() => {
    const income = filteredExpenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0)
    const expense = filteredExpenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)
    const balance = income - expense

    return { income, expense, balance }
  }, [filteredExpenses])

  const categoryStats = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}
    filteredExpenses
      .filter(e => e.type === 'expense')
      .forEach(e => {
        expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount
      })

    return EXPENSE_CATEGORIES
      .map(cat => ({
        ...cat,
        amount: expensesByCategory[cat.id] || 0,
        percentage: stats.expense > 0 ? ((expensesByCategory[cat.id] || 0) / stats.expense) * 100 : 0,
      }))
      .filter(cat => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount)
  }, [filteredExpenses, stats.expense])

  const exportData = () => {
    const csv = [
      ['Date', 'Description', 'Type', 'Category', 'Amount'],
      ...expenses.map(e => [e.date, e.description, e.type, e.category, e.amount.toString()]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'expenses.csv'
    link.click()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getCategoryInfo = (categoryId: string, isIncome: boolean) => {
    const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    return categories.find(c => c.id === categoryId) || { name: categoryId, color: '#6b7280' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
        <p className="text-muted-foreground">Track your income and expenses</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-xl font-bold text-green-500">{formatCurrency(stats.income)}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-xl font-bold text-red-500">{formatCurrency(stats.expense)}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stats.balance >= 0 ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                <DollarSign className={`w-5 h-5 ${stats.balance >= 0 ? 'text-blue-500' : 'text-yellow-500'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-blue-500' : 'text-yellow-500'}`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form */}
        <div className="lg:col-span-1 bg-card rounded-xl p-6 border h-fit">
          <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
          <form onSubmit={addExpense} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setType('expense'); setCategory('food'); }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'expense' ? 'bg-red-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => { setType('income'); setCategory('salary'); }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === 'income' ? 'bg-green-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Income
              </button>
            </div>

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border">
          {/* Filters */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <div className="flex items-center gap-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="px-3 py-1 bg-muted rounded-lg text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={() => setShowChart(!showChart)}
                className={`p-2 rounded-lg transition-colors ${
                  showChart ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <PieChart className="w-4 h-4" />
              </button>
              <button
                onClick={exportData}
                className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Breakdown Chart */}
          <AnimatePresence>
            {showChart && categoryStats.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">Expense Breakdown</h3>
                  <div className="space-y-2">
                    {categoryStats.map(cat => (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{cat.name}</span>
                          <span>{formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.percentage}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Add your first one!
              </div>
            ) : (
              filteredExpenses.map(expense => {
                const catInfo = getCategoryInfo(expense.category, expense.type === 'income')
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: catInfo.color }}
                      />
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {catInfo.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        expense.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
