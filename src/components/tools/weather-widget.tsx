'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Cloud, Sun, CloudRain, CloudSnow, CloudLightning,
  Wind, Droplets, Thermometer, MapPin, RefreshCw, CloudFog
} from 'lucide-react'

interface WeatherData {
  city: string
  country: string
  temp: number
  feels_like: number
  humidity: number
  wind_speed: number
  condition: string
  description: string
  forecast: ForecastDay[]
}

interface ForecastDay {
  day: string
  high: number
  low: number
  condition: string
}

const WEATHER_CONDITIONS: Record<string, { icon: any; color: string; bg: string }> = {
  sunny: { icon: Sun, color: 'text-yellow-500', bg: 'from-yellow-400 to-orange-500' },
  cloudy: { icon: Cloud, color: 'text-gray-500', bg: 'from-gray-400 to-gray-600' },
  rainy: { icon: CloudRain, color: 'text-blue-500', bg: 'from-blue-400 to-blue-600' },
  snowy: { icon: CloudSnow, color: 'text-sky-300', bg: 'from-sky-200 to-sky-400' },
  stormy: { icon: CloudLightning, color: 'text-purple-500', bg: 'from-purple-600 to-gray-800' },
  foggy: { icon: CloudFog, color: 'text-gray-400', bg: 'from-gray-300 to-gray-500' }
}

const CITIES = [
  { name: 'Jakarta', country: 'Indonesia', temp: 31, condition: 'cloudy' },
  { name: 'Tokyo', country: 'Japan', temp: 18, condition: 'sunny' },
  { name: 'New York', country: 'USA', temp: 12, condition: 'rainy' },
  { name: 'London', country: 'UK', temp: 8, condition: 'foggy' },
  { name: 'Sydney', country: 'Australia', temp: 25, condition: 'sunny' },
  { name: 'Moscow', country: 'Russia', temp: -5, condition: 'snowy' },
  { name: 'Singapore', country: 'Singapore', temp: 30, condition: 'stormy' },
  { name: 'Dubai', country: 'UAE', temp: 35, condition: 'sunny' }
]

function generateWeatherData(cityInfo: typeof CITIES[0]): WeatherData {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()
  const conditions = Object.keys(WEATHER_CONDITIONS)

  const forecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => ({
    day: days[(today + i + 1) % 7],
    high: cityInfo.temp + Math.floor(Math.random() * 5) - 2,
    low: cityInfo.temp - Math.floor(Math.random() * 8) - 3,
    condition: conditions[Math.floor(Math.random() * conditions.length)]
  }))

  return {
    city: cityInfo.name,
    country: cityInfo.country,
    temp: cityInfo.temp,
    feels_like: cityInfo.temp + Math.floor(Math.random() * 4) - 2,
    humidity: 40 + Math.floor(Math.random() * 40),
    wind_speed: 5 + Math.floor(Math.random() * 20),
    condition: cityInfo.condition,
    description: cityInfo.condition.charAt(0).toUpperCase() + cityInfo.condition.slice(1),
    forecast
  }
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [selectedCity, setSelectedCity] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [unit, setUnit] = useState<'C' | 'F'>('C')

  useEffect(() => {
    loadWeather()
  }, [selectedCity])

  const loadWeather = () => {
    setIsLoading(true)
    setTimeout(() => {
      setWeather(generateWeatherData(CITIES[selectedCity]))
      setIsLoading(false)
    }, 500)
  }

  const convertTemp = (celsius: number): number => {
    if (unit === 'F') return Math.round((celsius * 9/5) + 32)
    return celsius
  }

  const weatherInfo = weather ? WEATHER_CONDITIONS[weather.condition] : null
  const WeatherIcon = weatherInfo?.icon || Sun

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-500 text-sm font-medium mb-4">
          <Cloud className="w-4 h-4" />
          Weather
        </div>
        <h2 className="text-2xl font-bold">Weather Widget</h2>
        <p className="text-muted-foreground mt-2">
          Check weather conditions for cities around the world.
        </p>
      </div>

      {/* City Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {CITIES.map((city, index) => (
          <button
            key={city.name}
            onClick={() => setSelectedCity(index)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCity === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Weather Card */}
      {weather && (
        <motion.div
          key={weather.city}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl bg-gradient-to-br ${weatherInfo?.bg} text-white p-8 shadow-2xl`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 text-white/80 mb-1">
                <MapPin className="w-4 h-4" />
                <span>{weather.city}, {weather.country}</span>
              </div>
              <p className="text-sm text-white/60">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-sm"
              >
                °{unit}
              </button>
              <button
                onClick={loadWeather}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Main Weather */}
          <div className="flex items-center gap-8 mb-8">
            <WeatherIcon className="w-24 h-24" />
            <div>
              <div className="text-7xl font-light mb-2">
                {convertTemp(weather.temp)}°
              </div>
              <p className="text-xl text-white/80">{weather.description}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/10">
            <div className="text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-1 text-white/70" />
              <p className="text-sm text-white/70">Feels Like</p>
              <p className="font-semibold">{convertTemp(weather.feels_like)}°</p>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 mx-auto mb-1 text-white/70" />
              <p className="text-sm text-white/70">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-1 text-white/70" />
              <p className="text-sm text-white/70">Wind</p>
              <p className="font-semibold">{weather.wind_speed} km/h</p>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-white/70 mb-3">5-Day Forecast</h3>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day, index) => {
                const DayIcon = WEATHER_CONDITIONS[day.condition]?.icon || Cloud
                return (
                  <div
                    key={index}
                    className="text-center p-3 rounded-xl bg-white/10"
                  >
                    <p className="text-sm font-medium mb-2">{day.day}</p>
                    <DayIcon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">
                      <span className="font-semibold">{convertTemp(day.high)}°</span>
                      <span className="text-white/60"> / {convertTemp(day.low)}°</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Note */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground text-center">
        <p>Demo widget with simulated data. Select a city to see weather conditions.</p>
      </div>
    </div>
  )
}
