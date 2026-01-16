'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Cake, Clock, Sun, Moon, Star, Heart } from 'lucide-react'

interface AgeDetails {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
  totalHours: number
  nextBirthday: number
  zodiacSign: string
  zodiacEmoji: string
  chineseZodiac: string
  chineseEmoji: string
  dayOfWeek: string
  season: string
}

const ZODIAC_SIGNS = [
  { name: 'Capricorn', emoji: '♑', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
  { name: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
  { name: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
  { name: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
]

const CHINESE_ZODIAC = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
const CHINESE_EMOJI = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖']

const getZodiacSign = (month: number, day: number): { name: string; emoji: string } => {
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start
    const [endMonth, endDay] = sign.end

    if (startMonth === 12) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return { name: sign.name, emoji: sign.emoji }
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return { name: sign.name, emoji: sign.emoji }
      }
    }
  }
  return { name: 'Unknown', emoji: '❓' }
}

const getChineseZodiac = (year: number): { name: string; emoji: string } => {
  const index = (year - 4) % 12
  return { name: CHINESE_ZODIAC[index], emoji: CHINESE_EMOJI[index] }
}

const getDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

const getSeason = (month: number): string => {
  if (month >= 3 && month <= 5) return 'Spring 🌸'
  if (month >= 6 && month <= 8) return 'Summer ☀️'
  if (month >= 9 && month <= 11) return 'Autumn 🍂'
  return 'Winter ❄️'
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const today = new Date()

    if (birth > today) {
      setAgeDetails(null)
      return
    }

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate())
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate())
    const chinese = getChineseZodiac(birth.getFullYear())

    setAgeDetails({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      nextBirthday: daysUntilBirthday,
      zodiacSign: zodiac.name,
      zodiacEmoji: zodiac.emoji,
      chineseZodiac: chinese.name,
      chineseEmoji: chinese.emoji,
      dayOfWeek: getDayOfWeek(birth),
      season: getSeason(birth.getMonth() + 1)
    })
  }

  useEffect(() => {
    if (birthDate) calculateAge()
  }, [birthDate])

  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium mb-4">
          <Cake className="w-4 h-4" />
          Calculator
        </div>
        <h2 className="text-2xl font-bold">Age Calculator</h2>
        <p className="text-muted-foreground mt-2">
          Calculate your exact age and discover fun facts about your birthday!
        </p>
      </div>

      {/* Input */}
      <div className="mb-8">
        <label className="text-sm font-medium mb-2 block">Enter Your Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={maxDate}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-lg"
        />
      </div>

      {/* Results */}
      {ageDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Age */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-2">You are</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div>
                <span className="text-5xl font-bold text-primary">{ageDetails.years}</span>
                <span className="text-lg text-muted-foreground ml-1">years</span>
              </div>
              <div>
                <span className="text-3xl font-bold">{ageDetails.months}</span>
                <span className="text-lg text-muted-foreground ml-1">months</span>
              </div>
              <div>
                <span className="text-3xl font-bold">{ageDetails.days}</span>
                <span className="text-lg text-muted-foreground ml-1">days</span>
              </div>
            </div>
          </div>

          {/* Next Birthday */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
              <Cake className="w-5 h-5" />
              <span className="font-medium">
                {ageDetails.nextBirthday === 0
                  ? 'Happy Birthday! 🎉'
                  : `${ageDetails.nextBirthday} days until your next birthday!`
                }
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{ageDetails.totalDays.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Days</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{ageDetails.totalWeeks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Weeks</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Moon className="w-5 h-5 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{ageDetails.totalMonths.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Months</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <Sun className="w-5 h-5 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{(ageDetails.totalHours / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Fun Facts
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-sm text-muted-foreground">Zodiac Sign</p>
                <p className="text-lg font-medium">{ageDetails.zodiacEmoji} {ageDetails.zodiacSign}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-sm text-muted-foreground">Chinese Zodiac</p>
                <p className="text-lg font-medium">{ageDetails.chineseEmoji} {ageDetails.chineseZodiac}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-sm text-muted-foreground">Born On</p>
                <p className="text-lg font-medium">{ageDetails.dayOfWeek}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-sm text-muted-foreground">Birth Season</p>
                <p className="text-lg font-medium">{ageDetails.season}</p>
              </div>
            </div>
          </div>

          {/* Heart Beats */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <div className="flex items-center justify-center gap-2 text-red-500">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="font-medium">
                Your heart has beaten approximately {((ageDetails.totalDays * 24 * 60 * 72) / 1000000000).toFixed(2)} billion times!
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Enter your birth date to see your exact age and fun facts!</p>
      </div>
    </div>
  )
}
