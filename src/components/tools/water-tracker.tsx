'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Plus, Minus, Trophy, Target, TrendingUp, RotateCcw, Sparkles } from 'lucide-react'

interface WaterLog {
  amount: number
  timestamp: Date
}

interface DayData {
  date: string
  total: number
  logs: WaterLog[]
}

export function WaterTracker() {
  const [dailyGoal, setDailyGoal] = useState(2000) // ml
  const [todayIntake, setTodayIntake] = useState(0)
  const [logs, setLogs] = useState<WaterLog[]>([])
  const [weekData, setWeekData] = useState<DayData[]>([])
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [customAmount, setCustomAmount] = useState(250)

  const quickAmounts = [100, 200, 250, 300, 500]

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('waterTracker')
    if (savedData) {
      const data = JSON.parse(savedData)
      const today = new Date().toDateString()

      // Find today's data
      const todayData = data.find((d: DayData) => d.date === today)
      if (todayData) {
        setTodayIntake(todayData.total)
        setLogs(todayData.logs.map((l: { amount: number; timestamp: string }) => ({
          ...l,
          timestamp: new Date(l.timestamp)
        })))
      }

      // Calculate streak
      let currentStreak = 0
      const sortedData = [...data].sort((a: DayData, b: DayData) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      for (const day of sortedData) {
        if (day.total >= dailyGoal) {
          currentStreak++
        } else if (day.date !== today) {
          break
        }
      }
      setStreak(currentStreak)

      // Get last 7 days
      const last7Days = data.slice(-7)
      setWeekData(last7Days)
    }
  }, [dailyGoal])

  // Save data to localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const savedData = localStorage.getItem('waterTracker')
    let data: DayData[] = savedData ? JSON.parse(savedData) : []

    const todayIndex = data.findIndex((d: DayData) => d.date === today)
    const todayData: DayData = {
      date: today,
      total: todayIntake,
      logs
    }

    if (todayIndex >= 0) {
      data[todayIndex] = todayData
    } else {
      data.push(todayData)
    }

    // Keep only last 30 days
    data = data.slice(-30)
    localStorage.setItem('waterTracker', JSON.stringify(data))
  }, [todayIntake, logs])

  const addWater = (amount: number) => {
    const newIntake = todayIntake + amount
    setTodayIntake(newIntake)
    setLogs([...logs, { amount, timestamp: new Date() }])

    // Check if goal reached
    if (newIntake >= dailyGoal && todayIntake < dailyGoal) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const removeLastLog = () => {
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1]
      setTodayIntake(Math.max(0, todayIntake - lastLog.amount))
      setLogs(logs.slice(0, -1))
    }
  }

  const resetDay = () => {
    setTodayIntake(0)
    setLogs([])
  }

  const progress = Math.min((todayIntake / dailyGoal) * 100, 100)

  const getProgressColor = () => {
    if (progress >= 100) return 'text-green-500'
    if (progress >= 75) return 'text-blue-500'
    if (progress >= 50) return 'text-cyan-500'
    return 'text-primary'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="space-y-6">
      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="p-8 rounded-2xl bg-card text-center">
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Goal Reached!</h2>
              <p className="text-muted-foreground">Great job staying hydrated today!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{dailyGoal}ml</p>
          <p className="text-sm text-muted-foreground">Daily Goal</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{logs.length}</p>
          <p className="text-sm text-muted-foreground">Drinks Today</p>
        </div>
      </div>

      {/* Main Progress */}
      <div className="p-8 rounded-2xl border border-border bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Water Glass Effect */}
          <div className="absolute inset-0 rounded-2xl border-4 border-cyan-500/30 overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-blue-400"
              initial={{ height: 0 }}
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Bubbles */}
            {progress > 0 && (
              <>
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-white/30"
                  animate={{
                    y: [0, -100],
                    x: [0, 10, -10, 0],
                    opacity: [0.5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  style={{ bottom: '10%', left: '30%' }}
                />
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-white/30"
                  animate={{
                    y: [0, -80],
                    x: [0, -10, 10, 0],
                    opacity: [0.5, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  style={{ bottom: '10%', left: '60%' }}
                />
              </>
            )}
          </div>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets className={`w-8 h-8 mb-2 ${getProgressColor()}`} />
            <p className={`text-3xl font-bold ${getProgressColor()}`}>{todayIntake}</p>
            <p className="text-sm text-muted-foreground">/ {dailyGoal}ml</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-medium">
            {progress >= 100 ? '🎉 Goal Complete!' :
             progress >= 75 ? '💪 Almost there!' :
             progress >= 50 ? '👍 Halfway done!' :
             progress >= 25 ? '🚰 Keep going!' :
             '💧 Start drinking!'}
          </p>
          <p className="text-sm text-muted-foreground">
            {dailyGoal - todayIntake > 0 ? `${dailyGoal - todayIntake}ml remaining` : 'Excellent hydration!'}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {quickAmounts.map(amount => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addWater(amount)}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30 transition-colors"
            >
              +{amount}ml
            </motion.button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="w-24 text-center">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-center text-lg font-bold bg-transparent"
            />
            <p className="text-xs text-muted-foreground">ml</p>
          </div>
          <button
            onClick={() => setCustomAmount(customAmount + 50)}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWater(customAmount)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
          >
            Add
          </motion.button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={removeLastLog}
          disabled={logs.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors disabled:opacity-50"
        >
          <Minus className="w-5 h-5" />
          Undo Last
        </button>
        <button
          onClick={resetDay}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Day
        </button>
      </div>

      {/* Goal Setting */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <p className="text-sm font-medium mb-3">Daily Goal (ml)</p>
        <div className="flex gap-2 flex-wrap">
          {[1500, 2000, 2500, 3000, 3500].map(goal => (
            <button
              key={goal}
              onClick={() => setDailyGoal(goal)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dailyGoal === goal
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {goal}ml
            </button>
          ))}
        </div>
      </div>

      {/* Today's Logs */}
      {logs.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-3">Today&apos;s Log</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...logs].reverse().map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span className="font-medium">{log.amount}ml</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week Overview */}
      {weekData.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-3">This Week</h3>
          <div className="flex gap-2 justify-between">
            {weekData.map((day, index) => {
              const dayProgress = Math.min((day.total / dailyGoal) * 100, 100)
              return (
                <div key={index} className="flex-1 text-center">
                  <div className="h-24 bg-muted rounded-lg relative overflow-hidden mb-2">
                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all ${
                        dayProgress >= 100 ? 'bg-green-500' : 'bg-cyan-500'
                      }`}
                      style={{ height: `${dayProgress}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium">{getDayName(day.date)}</p>
                  <p className="text-xs text-muted-foreground">{day.total}ml</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-3">Hydration Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Drink a glass of water first thing in the morning</li>
          <li>• Keep a water bottle with you throughout the day</li>
          <li>• Set reminders to drink water every hour</li>
          <li>• Eat water-rich foods like fruits and vegetables</li>
        </ul>
      </div>
    </div>
  )
}
