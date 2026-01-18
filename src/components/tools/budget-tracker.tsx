'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, Plus, Trash2, TrendingUp, TrendingDown,
  PieChart, Calendar, Filter, Download, Wallet
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Date
}

interface Budget {
  category: string
  limit: number
}

const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Health', 'Education', 'Travel', 'Other'
]

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'
]

const CATEGORY_COLORS: { [key: string]: string } = {
  'Food & Dining': '#ef4444',
  'Transportation': '#f97316',
  'Shopping': '#eab308',
  'Entertainment': '#22c55e',
  'Bills & Utilities': '#14b8a6',
  'Health': '#3b82f6',
  'Education': '#8b5cf6',
  'Travel': '#ec4899',
  'Other': '#6b7280',
  'Salary': '#10b981',
  'Freelance': '#06b6d4',
  'Investments': '#8b5cf6',
  'Gifts': '#f43f5e',
  'Other Income': '#6b7280'
}

export function BudgetTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showBudgetSettings, setShowBudgetSettings] = useState(false)
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))

  // Form state
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-transactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      })))
    }
    const savedBudgets = localStorage.getItem('budgets')
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
  }, [])

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions)
    localStorage.setItem('budget-transactions', JSON.stringify(newTransactions))
  }

  const saveBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets)
    localStorage.setItem('budgets', JSON.stringify(newBudgets))
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionMonth = t.date.toISOString().slice(0, 7)
      return transactionMonth === filterMonth
    })
  }, [transactions, filterMonth])

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expenses

    const expensesByCategory: { [key: string]: number } = {}
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
      })

    return { income, expenses, balance, expensesByCategory }
  }, [filteredTransactions])

  const addTransaction = () => {
    if (!amount || !category) {
      alert('Please fill in all required fields')
      return
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date)
    }

    saveTransactions([transaction, ...transactions])

    // Reset form
    setAmount('')
    setCategory('')
    setDescription('')
    setDate(new Date().toISOString().slice(0, 10))
    setShowAddTransaction(false)
  }

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id))
  }

  const updateBudget = (categoryName: string, limit: number) => {
    const existing = budgets.find(b => b.category === categoryName)
    if (existing) {
      saveBudgets(budgets.map(b => b.category === categoryName ? { ...b, limit } : b))
    } else {
      saveBudgets([...budgets, { category: categoryName, limit }])
    }
  }

  const getBudgetUsage = (categoryName: string) => {
    const budget = budgets.find(b => b.category === categoryName)
    const spent = stats.expensesByCategory[categoryName] || 0
    if (!budget || budget.limit === 0) return null
    return {
      spent,
      limit: budget.limit,
      percentage: Math.min(100, (spent / budget.limit) * 100)
    }
  }

  const exportData = () => {
    const data = {
      transactions,
      budgets,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget-export-${filterMonth}.json`
    a.click()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Header */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBudgetSettings(!showBudgetSettings)}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20"
              title="Budget Settings"
            >
              <PieChart className="w-5 h-5" />
            </button>
            <button
              onClick={exportData}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20"
              title="Export Data"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAddTransaction(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Income</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.income)}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm">Expenses</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.expenses)}</div>
          </div>
          <div className={`${stats.balance >= 0 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-yellow-500/10 border-yellow-500/30'} border rounded-xl p-4`}>
            <div className={`flex items-center gap-2 ${stats.balance >= 0 ? 'text-blue-400' : 'text-yellow-400'} mb-2`}>
              <Wallet className="w-5 h-5" />
              <span className="text-sm">Balance</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.balance)}</div>
          </div>
        </div>

        {/* Budget Settings */}
        <AnimatePresence>
          {showBudgetSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Budget Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXPENSE_CATEGORIES.map(cat => {
                    const budget = budgets.find(b => b.category === cat)
                    const usage = getBudgetUsage(cat)
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">{cat}</span>
                          <input
                            type="number"
                            value={budget?.limit || ''}
                            onChange={(e) => updateBudget(cat, parseFloat(e.target.value) || 0)}
                            placeholder="Set limit"
                            className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        </div>
                        {usage && (
                          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${usage.percentage >= 90 ? 'bg-red-500' : usage.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${usage.percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expense Breakdown */}
        {Object.keys(stats.expensesByCategory).length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Expense Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(stats.expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amount]) => {
                  const usage = getBudgetUsage(cat)
                  return (
                    <div
                      key={cat}
                      className="bg-white/5 rounded-lg p-3"
                      style={{ borderLeft: `4px solid ${CATEGORY_COLORS[cat] || '#6b7280'}` }}
                    >
                      <div className="text-white/70 text-sm">{cat}</div>
                      <div className="text-white font-medium">{formatCurrency(amount)}</div>
                      {usage && (
                        <div className="text-xs text-white/50">
                          {usage.percentage.toFixed(0)}% of {formatCurrency(usage.limit)}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div>
          <h3 className="text-white font-medium mb-3">Transactions</h3>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No transactions this month
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 bg-white/5 rounded-lg p-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{transaction.category}</div>
                      <div className="text-white/50 text-sm">
                        {transaction.description || 'No description'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-white/50 text-sm">
                        {transaction.date.toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Add Transaction Modal */}
        <AnimatePresence>
          {showAddTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddTransaction(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Add Transaction</h3>

                {/* Type selector */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => { setTransactionType('expense'); setCategory(''); }}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      transactionType === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => { setTransactionType('income'); setCategory(''); }}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      transactionType === 'income'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    Income
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Amount *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="" className="bg-slate-800">Select category</option>
                      {(transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                        <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddTransaction(false)}
                    className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTransaction}
                    className={`flex-1 py-2 text-white rounded-lg ${
                      transactionType === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
