'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Plus, Trash2, TrendingUp, TrendingDown,
  Calendar, Download, AlertCircle
} from 'lucide-react'

interface Reading {
  id: string
  systolic: number
  diastolic: number
  pulse: number
  date: string
  time: string
  notes: string
}

interface Category {
  name: string
  color: string
  systolicRange: [number, number]
  diastolicRange: [number, number]
}

const CATEGORIES: Category[] = [
  { name: 'Low', color: 'text-blue-400', systolicRange: [0, 90], diastolicRange: [0, 60] },
  { name: 'Normal', color: 'text-green-400', systolicRange: [90, 120], diastolicRange: [60, 80] },
  { name: 'Elevated', color: 'text-yellow-400', systolicRange: [120, 130], diastolicRange: [80, 80] },
  { name: 'High Stage 1', color: 'text-orange-400', systolicRange: [130, 140], diastolicRange: [80, 90] },
  { name: 'High Stage 2', color: 'text-red-400', systolicRange: [140, 180], diastolicRange: [90, 120] },
  { name: 'Crisis', color: 'text-red-600', systolicRange: [180, 999], diastolicRange: [120, 999] }
]

export function BloodPressureTracker() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [pulse, setPulse] = useState('')
  const [notes, setNotes] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('blood-pressure-readings')
    if (saved) {
      setReadings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('blood-pressure-readings', JSON.stringify(readings))
  }, [readings])

  const getCategory = (sys: number, dia: number): Category => {
    for (let i = CATEGORIES.length - 1; i >= 0; i--) {
      const cat = CATEGORIES[i]
      if (sys >= cat.systolicRange[0] || dia >= cat.diastolicRange[0]) {
        return cat
      }
    }
    return CATEGORIES[0]
  }

  const addReading = () => {
    if (!systolic || !diastolic) return

    const now = new Date()
    const newReading: Reading = {
      id: Date.now().toString(),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : 0,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      notes
    }

    setReadings([newReading, ...readings])
    setSystolic('')
    setDiastolic('')
    setPulse('')
    setNotes('')
    setShowForm(false)
  }

  const deleteReading = (id: string) => {
    setReadings(readings.filter(r => r.id !== id))
  }

  const getAverages = () => {
    if (readings.length === 0) return null
    const sum = readings.reduce(
      (acc, r) => ({
        systolic: acc.systolic + r.systolic,
        diastolic: acc.diastolic + r.diastolic,
        pulse: acc.pulse + (r.pulse || 0)
      }),
      { systolic: 0, diastolic: 0, pulse: 0 }
    )
    return {
      systolic: Math.round(sum.systolic / readings.length),
      diastolic: Math.round(sum.diastolic / readings.length),
      pulse: Math.round(sum.pulse / readings.filter(r => r.pulse).length) || 0
    }
  }

  const getTrend = () => {
    if (readings.length < 2) return null
    const recent = readings.slice(0, 5)
    const older = readings.slice(5, 10)
    if (older.length === 0) return null

    const recentAvg = recent.reduce((acc, r) => acc + r.systolic, 0) / recent.length
    const olderAvg = older.reduce((acc, r) => acc + r.systolic, 0) / older.length

    return recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable'
  }

  const exportData = () => {
    const csv = [
      ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Notes'].join(','),
      ...readings.map(r =>
        [r.date, r.time, r.systolic, r.diastolic, r.pulse, `"${r.notes}"`].join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blood-pressure-readings.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const averages = getAverages()
  const trend = getTrend()

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
            <Heart className="w-5 h-5 text-red-400" />
            Blood Pressure Tracker
          </h3>
          <div className="flex gap-2">
            {readings.length > 0 && (
              <button
                onClick={exportData}
                className="px-3 py-1.5 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 text-sm flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Reading
            </button>
          </div>
        </div>

        {/* Add Reading Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-white/5 rounded-xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Systolic (mmHg)</label>
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Diastolic (mmHg)</label>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Pulse (bpm)</label>
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="72"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="After exercise..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addReading}
                disabled={!systolic || !diastolic}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Save Reading
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Statistics */}
        {averages && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${getCategory(averages.systolic, averages.diastolic).color}`}>
                {averages.systolic}/{averages.diastolic}
              </div>
              <div className="text-white/50 text-sm">Average BP</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{averages.pulse || '-'}</div>
              <div className="text-white/50 text-sm">Avg Pulse</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{readings.length}</div>
              <div className="text-white/50 text-sm">Readings</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                {trend === 'up' && <TrendingUp className="w-6 h-6 text-red-400" />}
                {trend === 'down' && <TrendingDown className="w-6 h-6 text-green-400" />}
                {!trend && <span className="text-white/50">-</span>}
              </div>
              <div className="text-white/50 text-sm">Trend</div>
            </div>
          </div>
        )}

        {/* Category Guide */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <div className="text-white/70 text-sm mb-2">Blood Pressure Categories</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className={`${cat.color}`}>
                {cat.name}: {cat.systolicRange[0]}-{cat.systolicRange[1] === 999 ? '+' : cat.systolicRange[1]}/{cat.diastolicRange[0]}-{cat.diastolicRange[1] === 999 ? '+' : cat.diastolicRange[1]}
              </div>
            ))}
          </div>
        </div>

        {/* Readings List */}
        {readings.length > 0 ? (
          <div className="space-y-2">
            {readings.map(reading => {
              const category = getCategory(reading.systolic, reading.diastolic)
              return (
                <motion.div
                  key={reading.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-xl font-bold ${category.color}`}>
                      {reading.systolic}/{reading.diastolic}
                    </div>
                    <div className="text-white/50 text-sm">
                      <span className={category.color}>{category.name}</span>
                    </div>
                    {reading.pulse > 0 && (
                      <div className="text-white/50 text-sm flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {reading.pulse} bpm
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <div className="text-white/70 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {reading.date}
                      </div>
                      <div className="text-white/50">{reading.time}</div>
                    </div>
                    <button
                      onClick={() => deleteReading(reading.id)}
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
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No readings yet. Add your first blood pressure reading.</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-white/70 text-sm">
            This tool is for tracking purposes only and should not be used for medical diagnosis.
            Always consult with a healthcare professional for medical advice.
          </div>
        </div>
      </motion.div>
    </div>
  )
}
