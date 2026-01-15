'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Plus, Play, Pause, RotateCcw, Trash2, Bell, BellOff } from 'lucide-react'

interface CountdownEvent {
  id: string
  title: string
  targetDate: string
  color: string
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
]

const calculateTimeLeft = (targetDate: string) => {
  const difference = new Date(targetDate).getTime() - new Date().getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    total: difference
  }
}

export function CountdownTimer() {
  const [events, setEvents] = useState<CountdownEvent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const saved = localStorage.getItem('countdownEvents')
    if (saved) {
      setEvents(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const saveEvents = (updated: CountdownEvent[]) => {
    setEvents(updated)
    localStorage.setItem('countdownEvents', JSON.stringify(updated))
  }

  const addEvent = () => {
    if (!title.trim() || !targetDate) return

    const newEvent: CountdownEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      targetDate,
      color
    }

    saveEvents([...events, newEvent])
    setTitle('')
    setTargetDate('')
    setColor(COLORS[0])
    setShowForm(false)
  }

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(e => e.id !== id))
  }

  // Sort events by target date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  )

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 text-sm font-medium mb-4">
          <Timer className="w-4 h-4" />
          Countdown
        </div>
        <h2 className="text-2xl font-bold">Countdown Timer</h2>
        <p className="text-muted-foreground mt-2">
          Track important dates and events.
        </p>
      </div>

      {/* Add Event Button */}
      {!showForm && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="w-full mb-6 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Countdown
        </motion.button>
      )}

      {/* Add Event Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-6 rounded-xl border border-border bg-card"
          >
            <h3 className="font-semibold mb-4">New Countdown</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Birthday, Vacation, Project Deadline"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target Date & Time</label>
                <input
                  type="datetime-local"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={minDate}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addEvent}
                  disabled={!title.trim() || !targetDate}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
                >
                  Add Countdown
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setTitle('')
                    setTargetDate('')
                  }}
                  className="px-4 py-2 bg-muted rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events Grid */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No countdowns yet. Add your first event!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sortedEvents.map(event => {
            const timeLeft = calculateTimeLeft(event.targetDate)
            const isExpired = timeLeft.total <= 0

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative p-6 rounded-2xl text-white shadow-lg ${
                  isExpired ? 'opacity-60' : ''
                }`}
                style={{ backgroundColor: event.color }}
              >
                {/* Delete button */}
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 pr-8">{event.title}</h3>

                {/* Target date */}
                <p className="text-sm text-white/70 mb-4">
                  {new Date(event.targetDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                {isExpired ? (
                  <p className="text-2xl font-bold">Event passed!</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/20 rounded-lg p-2">
                      <p className="text-2xl font-bold">{timeLeft.days}</p>
                      <p className="text-xs text-white/70">Days</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2">
                      <p className="text-2xl font-bold">{timeLeft.hours}</p>
                      <p className="text-xs text-white/70">Hours</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2">
                      <p className="text-2xl font-bold">{timeLeft.minutes}</p>
                      <p className="text-xs text-white/70">Mins</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2">
                      <p className="text-2xl font-bold">{timeLeft.seconds}</p>
                      <p className="text-xs text-white/70">Secs</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Countdowns are saved in your browser and update in real-time.</p>
      </div>
    </div>
  )
}
