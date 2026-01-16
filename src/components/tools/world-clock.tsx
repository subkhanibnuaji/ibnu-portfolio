'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plus, X, Globe, Sun, Moon, Sunrise, Sunset } from 'lucide-react'

interface TimeZone {
  id: string
  city: string
  country: string
  timezone: string
  offset: number
}

const TIMEZONES: TimeZone[] = [
  { id: 'local', city: 'Local Time', country: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, offset: 0 },
  { id: 'nyc', city: 'New York', country: 'USA', timezone: 'America/New_York', offset: -5 },
  { id: 'la', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', offset: -8 },
  { id: 'london', city: 'London', country: 'UK', timezone: 'Europe/London', offset: 0 },
  { id: 'paris', city: 'Paris', country: 'France', timezone: 'Europe/Paris', offset: 1 },
  { id: 'berlin', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', offset: 1 },
  { id: 'dubai', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', offset: 4 },
  { id: 'mumbai', city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5 },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
  { id: 'hong_kong', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', offset: 8 },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 9 },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', offset: 9 },
  { id: 'sydney', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 11 },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', offset: 13 },
  { id: 'jakarta', city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', offset: 7 },
]

const getTimeOfDay = (hour: number): { icon: any; bg: string } => {
  if (hour >= 6 && hour < 12) return { icon: Sunrise, bg: 'from-orange-300 to-yellow-200' }
  if (hour >= 12 && hour < 18) return { icon: Sun, bg: 'from-blue-300 to-cyan-200' }
  if (hour >= 18 && hour < 21) return { icon: Sunset, bg: 'from-orange-400 to-purple-400' }
  return { icon: Moon, bg: 'from-indigo-800 to-purple-900' }
}

export function WorldClock() {
  const [selectedZones, setSelectedZones] = useState<string[]>(['local', 'nyc', 'london', 'tokyo'])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAddMenu, setShowAddMenu] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const addTimeZone = (id: string) => {
    if (!selectedZones.includes(id)) {
      setSelectedZones([...selectedZones, id])
    }
    setShowAddMenu(false)
  }

  const removeTimeZone = (id: string) => {
    setSelectedZones(selectedZones.filter(z => z !== id))
  }

  const getTimeInZone = (timezone: string): Date => {
    const time = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }))
    return time
  }

  const formatTime = (date: Date): { time: string; seconds: string; ampm: string } => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12

    return {
      time: `${displayHours}:${minutes.toString().padStart(2, '0')}`,
      seconds: seconds.toString().padStart(2, '0'),
      ampm
    }
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeDifference = (timezone: string): string => {
    const localTime = currentTime.getTime()
    const targetTime = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }))
    const localDate = new Date(currentTime.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }))

    const diffHours = Math.round((targetTime.getTime() - localDate.getTime()) / (1000 * 60 * 60))

    if (diffHours === 0) return 'Same time'
    if (diffHours > 0) return `+${diffHours}h`
    return `${diffHours}h`
  }

  const availableZones = TIMEZONES.filter(tz => !selectedZones.includes(tz.id))

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-medium mb-4">
          <Globe className="w-4 h-4" />
          Time
        </div>
        <h2 className="text-2xl font-bold">World Clock</h2>
        <p className="text-muted-foreground mt-2">
          Track time across multiple time zones.
        </p>
      </div>

      {/* Clock Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {selectedZones.map((zoneId, index) => {
          const zone = TIMEZONES.find(tz => tz.id === zoneId)
          if (!zone) return null

          const zoneTime = getTimeInZone(zone.timezone)
          const { time, seconds, ampm } = formatTime(zoneTime)
          const hour = zoneTime.getHours()
          const { icon: TimeIcon, bg } = getTimeOfDay(hour)
          const isNight = hour < 6 || hour >= 21

          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${bg} text-white shadow-lg overflow-hidden`}
            >
              {/* Remove button */}
              {zone.id !== 'local' && (
                <button
                  onClick={() => removeTimeZone(zone.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 mb-4">
                <TimeIcon className={`w-5 h-5 ${isNight ? 'text-white' : 'text-white/80'}`} />
                <div>
                  <h3 className={`font-semibold ${isNight ? 'text-white' : 'text-white/90'}`}>
                    {zone.city}
                  </h3>
                  {zone.country && (
                    <p className={`text-sm ${isNight ? 'text-white/70' : 'text-white/60'}`}>
                      {zone.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${isNight ? 'text-white' : 'text-white/90'}`}>
                    {time}
                  </span>
                  <span className={`text-lg ${isNight ? 'text-white/80' : 'text-white/70'}`}>
                    :{seconds}
                  </span>
                  <span className={`text-lg font-medium ${isNight ? 'text-white/80' : 'text-white/70'}`}>
                    {ampm}
                  </span>
                </div>
              </div>

              {/* Date */}
              <p className={`text-sm ${isNight ? 'text-white/70' : 'text-white/60'}`}>
                {formatDate(zoneTime)}
              </p>

              {/* Time difference */}
              {zone.id !== 'local' && (
                <p className={`text-xs mt-2 ${isNight ? 'text-white/60' : 'text-white/50'}`}>
                  {getTimeDifference(zone.timezone)} from local
                </p>
              )}
            </motion.div>
          )
        })}

        {/* Add Clock Button */}
        {availableZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full h-full min-h-[180px] p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-8 h-8" />
              <span className="font-medium">Add City</span>
            </button>

            {/* Dropdown Menu */}
            {showAddMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl border border-border bg-card shadow-xl z-10 max-h-[300px] overflow-y-auto"
              >
                {availableZones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => addTimeZone(zone.id)}
                    className="w-full p-3 rounded-lg text-left hover:bg-muted transition-colors"
                  >
                    <p className="font-medium">{zone.city}</p>
                    <p className="text-sm text-muted-foreground">{zone.country}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Click "Add City" to track more time zones. Cards update in real-time.</p>
      </div>
    </div>
  )
}
