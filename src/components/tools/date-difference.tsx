'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

export function DateDifference() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const difference = useMemo(() => {
    if (!startDate || !endDate) return null

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null

    const diffMs = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30.44)
    const diffYears = Math.floor(diffDays / 365.25)
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffSeconds = Math.floor(diffMs / 1000)

    // Detailed breakdown
    const years = Math.floor(diffDays / 365)
    const remainingAfterYears = diffDays % 365
    const months = Math.floor(remainingAfterYears / 30)
    const days = remainingAfterYears % 30

    const isPast = end < start

    return {
      totalDays: diffDays,
      totalWeeks: diffWeeks,
      totalMonths: diffMonths,
      totalYears: diffYears,
      totalHours: diffHours,
      totalMinutes: diffMinutes,
      totalSeconds: diffSeconds,
      years,
      months,
      days,
      isPast,
      weekdays: countWeekdays(start, end),
      weekends: diffDays - countWeekdays(start, end),
    }
  }, [startDate, endDate])

  function countWeekdays(start: Date, end: Date): number {
    let count = 0
    const current = new Date(Math.min(start.getTime(), end.getTime()))
    const endDate = new Date(Math.max(start.getTime(), end.getTime()))

    while (current <= endDate) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) count++
      current.setDate(current.getDate() + 1)
    }
    return count
  }

  const setToday = (field: 'start' | 'end') => {
    const today = new Date().toISOString().split('T')[0]
    if (field === 'start') setStartDate(today)
    else setEndDate(today)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Date Difference Calculator</h1>
        <p className="text-muted-foreground">Calculate the difference between two dates</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Start Date</label>
              <button
                onClick={() => setToday('start')}
                className="text-xs text-blue-500 hover:underline"
              >
                Today
              </button>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">End Date</label>
              <button
                onClick={() => setToday('end')}
                className="text-xs text-blue-500 hover:underline"
              >
                Today
              </button>
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {difference && (
          <>
            {/* Main Result */}
            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-center mb-6">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold mb-2">
                {difference.years > 0 && `${difference.years} year${difference.years > 1 ? 's' : ''}, `}
                {difference.months > 0 && `${difference.months} month${difference.months > 1 ? 's' : ''}, `}
                {difference.days} day{difference.days !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-muted-foreground">
                {difference.totalDays.toLocaleString()} days total
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xl font-bold">{difference.totalYears}</div>
                <div className="text-xs text-muted-foreground">Years</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xl font-bold">{difference.totalMonths}</div>
                <div className="text-xs text-muted-foreground">Months</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xl font-bold">{difference.totalWeeks}</div>
                <div className="text-xs text-muted-foreground">Weeks</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xl font-bold">{difference.totalDays.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xl font-bold">{difference.totalHours.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xl font-bold">{difference.totalMinutes.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
            </div>

            {/* Work Days */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Weekdays</div>
                <div className="text-xl font-bold text-green-500">{difference.weekdays}</div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Weekend Days</div>
                <div className="text-xl font-bold text-orange-500">{difference.weekends}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
