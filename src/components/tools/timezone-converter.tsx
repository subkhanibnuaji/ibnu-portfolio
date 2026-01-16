'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Globe, ArrowRight } from 'lucide-react'

const TIMEZONES = [
  { id: 'UTC', name: 'UTC', offset: 0 },
  { id: 'America/New_York', name: 'New York (EST/EDT)', offset: -5 },
  { id: 'America/Chicago', name: 'Chicago (CST/CDT)', offset: -6 },
  { id: 'America/Denver', name: 'Denver (MST/MDT)', offset: -7 },
  { id: 'America/Los_Angeles', name: 'Los Angeles (PST/PDT)', offset: -8 },
  { id: 'America/Sao_Paulo', name: 'São Paulo (BRT)', offset: -3 },
  { id: 'Europe/London', name: 'London (GMT/BST)', offset: 0 },
  { id: 'Europe/Paris', name: 'Paris (CET/CEST)', offset: 1 },
  { id: 'Europe/Berlin', name: 'Berlin (CET/CEST)', offset: 1 },
  { id: 'Europe/Moscow', name: 'Moscow (MSK)', offset: 3 },
  { id: 'Asia/Dubai', name: 'Dubai (GST)', offset: 4 },
  { id: 'Asia/Kolkata', name: 'India (IST)', offset: 5.5 },
  { id: 'Asia/Bangkok', name: 'Bangkok (ICT)', offset: 7 },
  { id: 'Asia/Singapore', name: 'Singapore (SGT)', offset: 8 },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong (HKT)', offset: 8 },
  { id: 'Asia/Jakarta', name: 'Jakarta (WIB)', offset: 7 },
  { id: 'Asia/Tokyo', name: 'Tokyo (JST)', offset: 9 },
  { id: 'Asia/Seoul', name: 'Seoul (KST)', offset: 9 },
  { id: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)', offset: 10 },
  { id: 'Pacific/Auckland', name: 'Auckland (NZST/NZDT)', offset: 12 },
]

export function TimezoneConverter() {
  const [sourceTime, setSourceTime] = useState('')
  const [sourceDate, setSourceDate] = useState('')
  const [sourceTimezone, setSourceTimezone] = useState('UTC')
  const [targetTimezone, setTargetTimezone] = useState('Asia/Jakarta')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set current time as default
    const now = new Date()
    setSourceDate(now.toISOString().split('T')[0])
    setSourceTime(now.toTimeString().slice(0, 5))
  }, [])

  const convertedTime = useMemo(() => {
    if (!sourceTime || !sourceDate) return null

    const sourceOffset = TIMEZONES.find(tz => tz.id === sourceTimezone)?.offset || 0
    const targetOffset = TIMEZONES.find(tz => tz.id === targetTimezone)?.offset || 0

    // Parse source time
    const [hours, minutes] = sourceTime.split(':').map(Number)
    const sourceDateTime = new Date(`${sourceDate}T${sourceTime}:00`)

    // Calculate UTC time from source
    const utcTime = new Date(sourceDateTime.getTime() - sourceOffset * 60 * 60 * 1000)

    // Calculate target time from UTC
    const targetTime = new Date(utcTime.getTime() + targetOffset * 60 * 60 * 1000)

    const diffHours = targetOffset - sourceOffset
    const dayDiff = Math.floor((targetTime.getDate() - sourceDateTime.getDate()))

    return {
      time: targetTime.toTimeString().slice(0, 5),
      date: targetTime.toISOString().split('T')[0],
      dayLabel: dayDiff === 0 ? 'Same day' : dayDiff === 1 ? 'Next day' : dayDiff === -1 ? 'Previous day' : `${dayDiff} days`,
      diffHours,
    }
  }, [sourceTime, sourceDate, sourceTimezone, targetTimezone])

  const formatCurrentTime = (tzId: string) => {
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: tzId,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return '--:--'
    }
  }

  const swapTimezones = () => {
    const temp = sourceTimezone
    setSourceTimezone(targetTimezone)
    setTargetTimezone(temp)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Timezone Converter</h1>
        <p className="text-muted-foreground">Convert time between different time zones</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Source Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="time"
              value={sourceTime}
              onChange={(e) => setSourceTime(e.target.value)}
              className="px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={sourceDate}
              onChange={(e) => setSourceDate(e.target.value)}
              className="px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sourceTimezone}
            onChange={(e) => setSourceTimezone(e.target.value)}
            className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIMEZONES.map(tz => (
              <option key={tz.id} value={tz.id}>
                {tz.name} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={swapTimezones}
            className="p-3 bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Target */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">To</label>
          <select
            value={targetTimezone}
            onChange={(e) => setTargetTimezone(e.target.value)}
            className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIMEZONES.map(tz => (
              <option key={tz.id} value={tz.id}>
                {tz.name} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        {convertedTime && (
          <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">{convertedTime.time}</div>
            <div className="text-lg mb-1">{convertedTime.date}</div>
            <div className="text-sm text-muted-foreground">{convertedTime.dayLabel}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {convertedTime.diffHours >= 0 ? '+' : ''}{convertedTime.diffHours} hours difference
            </div>
          </div>
        )}

        {/* World Clocks */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Current Time Around the World
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Jakarta', 'Australia/Sydney'].map(tzId => {
              const tz = TIMEZONES.find(t => t.id === tzId)
              return (
                <div key={tzId} className="flex justify-between p-2 bg-muted/50 rounded">
                  <span className="text-muted-foreground">{tz?.name.split(' ')[0]}</span>
                  <span className="font-medium">{formatCurrentTime(tzId)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
