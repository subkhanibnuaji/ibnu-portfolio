'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Smile, Frown, Meh, Heart, Sun, Cloud, CloudRain,
  Moon, Coffee, Dumbbell, Users, Book, Music, Trash2,
  Calendar, TrendingUp, Plus
} from 'lucide-react'

interface MoodEntry {
  id: string
  mood: number
  activities: string[]
  notes: string
  date: string
  time: string
}

const MOODS = [
  { value: 1, emoji: '😢', label: 'Very Bad', color: 'bg-red-500' },
  { value: 2, emoji: '😔', label: 'Bad', color: 'bg-orange-500' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-500' },
  { value: 4, emoji: '😊', label: 'Good', color: 'bg-lime-500' },
  { value: 5, emoji: '😄', label: 'Great', color: 'bg-green-500' }
]

const ACTIVITIES = [
  { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'reading', label: 'Reading', icon: Book },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'sleep', label: 'Good Sleep', icon: Moon },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'nature', label: 'Nature', icon: Sun },
  { id: 'relaxing', label: 'Relaxing', icon: Cloud }
]

export function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    const saved = localStorage.getItem('mood-entries')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mood-entries', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    if (selectedMood === null) return

    const now = new Date()
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      activities: selectedActivities,
      notes,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    }

    setEntries([newEntry, ...entries])
    setSelectedMood(null)
    setSelectedActivities([])
    setNotes('')
    setShowForm(false)
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId]
    )
  }

  const getAverageMood = () => {
    if (entries.length === 0) return null
    const sum = entries.reduce((acc, e) => acc + e.mood, 0)
    return (sum / entries.length).toFixed(1)
  }

  const getMoodStreak = () => {
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    const dates = new Set(entries.map(e => e.date))

    for (let i = 0; i < 365; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      if (dates.has(dateStr)) {
        streak++
      } else if (dateStr !== today) {
        break
      }
    }

    return streak
  }

  const getWeekMoods = () => {
    const week: { date: string; mood: number | null }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const entry = entries.find(e => e.date === dateStr)
      week.push({
        date: date.toLocaleDateString('en', { weekday: 'short' }),
        mood: entry?.mood || null
      })
    }
    return week
  }

  const avgMood = getAverageMood()
  const streak = getMoodStreak()
  const weekMoods = getWeekMoods()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Smile className="w-5 h-5 text-yellow-400" />
            Mood Tracker
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Mood
          </button>
        </div>

        {/* Add Mood Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-white/5 rounded-xl"
          >
            {/* Mood Selection */}
            <div className="mb-4">
              <label className="text-white/70 text-sm mb-2 block">How are you feeling?</label>
              <div className="flex justify-center gap-2">
                {MOODS.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedMood === mood.value
                        ? `${mood.color} scale-110`
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-white">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="mb-4">
              <label className="text-white/70 text-sm mb-2 block">Activities (optional)</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map(activity => {
                  const Icon = activity.icon
                  return (
                    <button
                      key={activity.id}
                      onClick={() => toggleActivity(activity.id)}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
                        selectedActivities.includes(activity.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {activity.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-white/70 text-sm mb-2 block">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your day?"
                className="w-full h-24 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={addEntry}
                disabled={selectedMood === null}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Save Entry
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setSelectedMood(null)
                  setSelectedActivities([])
                  setNotes('')
                }}
                className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {avgMood ? MOODS[Math.round(parseFloat(avgMood)) - 1]?.emoji : '-'}
            </div>
            <div className="text-white/50 text-sm">Average Mood</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{streak}</div>
            <div className="text-white/50 text-sm">Day Streak</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{entries.length}</div>
            <div className="text-white/50 text-sm">Total Entries</div>
          </div>
        </div>

        {/* Week Overview */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">This Week</label>
          <div className="flex justify-between gap-2">
            {weekMoods.map((day, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="text-white/50 text-xs mb-1">{day.date}</div>
                <div className={`h-12 rounded-lg flex items-center justify-center ${
                  day.mood ? MOODS[day.mood - 1].color : 'bg-white/5'
                }`}>
                  {day.mood ? (
                    <span className="text-xl">{MOODS[day.mood - 1].emoji}</span>
                  ) : (
                    <span className="text-white/20">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entries List */}
        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.slice(0, 10).map(entry => {
              const mood = MOODS[entry.mood - 1]
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${mood.color} flex items-center justify-center text-2xl`}>
                      {mood.emoji}
                    </div>
                    <div>
                      <div className="text-white font-medium">{mood.label}</div>
                      {entry.activities.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {entry.activities.map(actId => {
                            const activity = ACTIVITIES.find(a => a.id === actId)
                            if (!activity) return null
                            const Icon = activity.icon
                            return (
                              <Icon key={actId} className="w-3 h-3 text-white/50" />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <div className="text-white/70 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </div>
                      <div className="text-white/50">{entry.time}</div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-white/30">
            <Smile className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No mood entries yet. Log your first mood!</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
