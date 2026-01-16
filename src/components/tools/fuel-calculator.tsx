'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Fuel, Car, Route, DollarSign } from 'lucide-react'

type Unit = 'metric' | 'imperial'

export function FuelCalculator() {
  const [mode, setMode] = useState<'cost' | 'consumption' | 'distance'>('cost')
  const [unit, setUnit] = useState<Unit>('metric')

  // Cost calculation
  const [distance, setDistance] = useState('')
  const [fuelEfficiency, setFuelEfficiency] = useState('')
  const [fuelPrice, setFuelPrice] = useState('')

  // Consumption calculation
  const [fuelUsed, setFuelUsed] = useState('')
  const [tripDistance, setTripDistance] = useState('')

  // Distance calculation
  const [tankSize, setTankSize] = useState('')
  const [efficiency, setEfficiency] = useState('')

  const costResult = useMemo(() => {
    const dist = parseFloat(distance) || 0
    const eff = parseFloat(fuelEfficiency) || 0
    const price = parseFloat(fuelPrice) || 0

    if (dist <= 0 || eff <= 0 || price <= 0) return null

    // Convert if imperial (mpg to L/100km logic)
    let fuelNeeded: number
    if (unit === 'metric') {
      fuelNeeded = (dist / 100) * eff // L/100km
    } else {
      fuelNeeded = dist / eff // gallons = miles / mpg
    }

    return {
      fuelNeeded: fuelNeeded,
      totalCost: fuelNeeded * price,
      costPerUnit: (fuelNeeded * price) / dist,
    }
  }, [distance, fuelEfficiency, fuelPrice, unit])

  const consumptionResult = useMemo(() => {
    const fuel = parseFloat(fuelUsed) || 0
    const dist = parseFloat(tripDistance) || 0

    if (fuel <= 0 || dist <= 0) return null

    return {
      lPer100km: (fuel / dist) * 100,
      kmPerL: dist / fuel,
      mpg: dist / fuel,
      gallonsPer100mi: (fuel / dist) * 100,
    }
  }, [fuelUsed, tripDistance])

  const distanceResult = useMemo(() => {
    const tank = parseFloat(tankSize) || 0
    const eff = parseFloat(efficiency) || 0

    if (tank <= 0 || eff <= 0) return null

    if (unit === 'metric') {
      return {
        maxDistance: (tank / eff) * 100, // km
        reserve: (tank / eff) * 100 * 0.1, // 10% reserve
      }
    } else {
      return {
        maxDistance: tank * eff, // miles
        reserve: tank * eff * 0.1,
      }
    }
  }, [tankSize, efficiency, unit])

  const distanceUnit = unit === 'metric' ? 'km' : 'mi'
  const volumeUnit = unit === 'metric' ? 'L' : 'gal'
  const efficiencyUnit = unit === 'metric' ? 'L/100km' : 'mpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Fuel Calculator</h1>
        <p className="text-muted-foreground">Calculate fuel costs, consumption, and range</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Unit Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setUnit('metric')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                unit === 'metric' ? 'bg-background shadow' : ''
              }`}
            >
              Metric (km, L)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                unit === 'imperial' ? 'bg-background shadow' : ''
              }`}
            >
              Imperial (mi, gal)
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'cost', label: 'Trip Cost', icon: DollarSign },
            { id: 'consumption', label: 'Consumption', icon: Fuel },
            { id: 'distance', label: 'Range', icon: Route },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id as typeof mode)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                mode === id ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Trip Cost Calculator */}
        {mode === 'cost' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Distance ({distanceUnit})</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder={`Enter distance in ${distanceUnit}`}
                min="0"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Efficiency ({efficiencyUnit})</label>
              <input
                type="number"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                placeholder={unit === 'metric' ? 'e.g., 8' : 'e.g., 30'}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Price (per {volumeUnit})</label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder="Enter price"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {costResult && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-500/10 rounded-lg text-center">
                  <Fuel className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-sm text-muted-foreground">Fuel Needed</div>
                  <div className="text-xl font-bold">{costResult.fuelNeeded.toFixed(2)} {volumeUnit}</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="text-xl font-bold">${costResult.totalCost.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Consumption Calculator */}
        {mode === 'consumption' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Used ({volumeUnit})</label>
              <input
                type="number"
                value={fuelUsed}
                onChange={(e) => setFuelUsed(e.target.value)}
                placeholder={`Enter fuel in ${volumeUnit}`}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Distance Traveled ({distanceUnit})</label>
              <input
                type="number"
                value={tripDistance}
                onChange={(e) => setTripDistance(e.target.value)}
                placeholder={`Enter distance in ${distanceUnit}`}
                min="0"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {consumptionResult && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {unit === 'metric' ? (
                  <>
                    <div className="p-4 bg-orange-500/10 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Consumption</div>
                      <div className="text-xl font-bold">{consumptionResult.lPer100km.toFixed(2)} L/100km</div>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                      <div className="text-xl font-bold">{consumptionResult.kmPerL.toFixed(2)} km/L</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-green-500/10 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                      <div className="text-xl font-bold">{consumptionResult.mpg.toFixed(1)} mpg</div>
                    </div>
                    <div className="p-4 bg-orange-500/10 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Per 100 miles</div>
                      <div className="text-xl font-bold">{consumptionResult.gallonsPer100mi.toFixed(2)} gal</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Distance/Range Calculator */}
        {mode === 'distance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tank Size ({volumeUnit})</label>
              <input
                type="number"
                value={tankSize}
                onChange={(e) => setTankSize(e.target.value)}
                placeholder={`Enter tank size in ${volumeUnit}`}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Efficiency ({efficiencyUnit})</label>
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                placeholder={unit === 'metric' ? 'e.g., 8' : 'e.g., 30'}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {distanceResult && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-500/10 rounded-lg text-center">
                  <Route className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-sm text-muted-foreground">Max Range</div>
                  <div className="text-xl font-bold">{distanceResult.maxDistance.toFixed(0)} {distanceUnit}</div>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg text-center">
                  <Car className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                  <div className="text-sm text-muted-foreground">Safe Range (90%)</div>
                  <div className="text-xl font-bold">{(distanceResult.maxDistance - distanceResult.reserve).toFixed(0)} {distanceUnit}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
