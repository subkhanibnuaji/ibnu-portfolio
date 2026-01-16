'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Plus, Check, X, Flame, Trophy, Calendar,
  ChevronLeft, ChevronRight, Trash2, Edit2
} from 'lucide-react'

interface Habit {
  id: string
  name: string
  color: string
  completedDates: string[]
  createdAt: string
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
]

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitColor, setNewHabitColor] = useState(COLORS[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('habitTracker')
    if (saved) {
      setHabits(JSON.parse(saved))
    }
  }, [])

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated)
    localStorage.setItem('habitTracker', JSON.stringify(updated))
  }

  const addHabit = () => {
    if (!newHabitName.trim()) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      color: newHabitColor,
      completedDates: [],
      createdAt: formatDate(new Date())
    }

    saveHabits([...habits, newHabit])
    setNewHabitName('')
    setNewHabitColor(COLORS[0])
    setShowAddForm(false)
  }

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id))
  }

  const toggleHabitDay = (habitId: string, date: string) => {
    const updated = habits.map(habit => {
      if (habit.id !== habitId) return habit

      const isCompleted = habit.completedDates.includes(date)
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
      }
    })

    saveHabits(updated)
  }

  const calculateStreak = (habit: Habit): number => {
    const today = new Date()
    let streak = 0
    let currentDate = new Date(today)

    while (true) {
      const dateStr = formatDate(currentDate)
      if (habit.completedDates.includes(dateStr)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (dateStr === formatDate(today)) {
        // Today not completed yet, check yesterday
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getMonthlyCompletion = (habit: Habit): number => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const today = new Date()

    let completedDays = 0
    let countableDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDate(date)

      if (date <= today && date >= new Date(habit.createdAt)) {
        countableDays++
        if (habit.completedDates.includes(dateStr)) {
          completedDays++
        }
      }
    }

    return countableDays > 0 ? Math.round((completedDays / countableDays) * 100) : 0
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const todayStr = formatDate(new Date())

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4">
          <Target className="w-4 h-4" />
          Productivity
        </div>
        <h2 className="text-2xl font-bold">Habit Tracker</h2>
        <p className="text-muted-foreground mt-2">
          Track your daily habits and build consistency.
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Add Habit Button */}
      <AnimatePresence>
        {!showAddForm && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Habit
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add Habit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-xl border border-border bg-card"
          >
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Exercise, Read, Meditate"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex gap-1">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewHabitColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        newHabitColor === color ? 'scale-110 ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addHabit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Add Habit
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewHabitName('')
                }}
                className="px-4 py-2 bg-muted rounded-lg"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No habits yet. Add your first habit to start tracking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => {
            const streak = calculateStreak(habit)
            const completion = getMonthlyCompletion(habit)

            return (
              <div
                key={habit.id}
                className="p-4 rounded-xl border border-border bg-card"
              >
                {/* Habit Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h4 className="font-medium">{habit.name}</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span>{completion}%</span>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Week day headers */}
                  {weekDays.map(day => (
                    <div key={day} className="text-xs text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                  {/* Blank days */}
                  {blanks.map(i => (
                    <div key={`blank-${i}`} />
                  ))}
                  {/* Days */}
                  {days.map(day => {
                    const dateStr = formatDate(new Date(year, month, day))
                    const isCompleted = habit.completedDates.includes(dateStr)
                    const isToday = dateStr === todayStr
                    const isFuture = new Date(year, month, day) > new Date()
                    const isBeforeCreated = new Date(year, month, day) < new Date(habit.createdAt)

                    return (
                      <button
                        key={day}
                        onClick={() => !isFuture && !isBeforeCreated && toggleHabitDay(habit.id, dateStr)}
                        disabled={isFuture || isBeforeCreated}
                        className={`
                          aspect-square rounded-lg text-xs transition-all
                          ${isToday ? 'ring-2 ring-primary' : ''}
                          ${isFuture || isBeforeCreated ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}
                          ${isCompleted ? 'text-white' : 'bg-muted'}
                        `}
                        style={{
                          backgroundColor: isCompleted ? habit.color : undefined
                        }}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Click on days to mark them complete. Build streaks by completing habits daily!</p>
      </div>
    </div>
  )
}
