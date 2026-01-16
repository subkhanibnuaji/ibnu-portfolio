'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus, Trash2, Calculator } from 'lucide-react'

interface Appliance {
  id: string
  name: string
  watts: string
  hoursPerDay: string
  quantity: string
}

const COMMON_APPLIANCES = [
  { name: 'LED Light Bulb', watts: 10 },
  { name: 'Incandescent Bulb', watts: 60 },
  { name: 'Ceiling Fan', watts: 75 },
  { name: 'Laptop', watts: 50 },
  { name: 'Desktop Computer', watts: 200 },
  { name: 'TV (LED)', watts: 100 },
  { name: 'Refrigerator', watts: 150 },
  { name: 'Air Conditioner', watts: 1500 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Electric Kettle', watts: 1500 },
  { name: 'Hair Dryer', watts: 1200 },
]

export function ElectricityCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: 'LED Light Bulb', watts: '10', hoursPerDay: '8', quantity: '5' },
  ])
  const [pricePerKwh, setPricePerKwh] = useState('0.12')

  const addAppliance = () => {
    setAppliances([...appliances, {
      id: Date.now().toString(),
      name: '',
      watts: '',
      hoursPerDay: '1',
      quantity: '1'
    }])
  }

  const removeAppliance = (id: string) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter(a => a.id !== id))
    }
  }

  const updateAppliance = (id: string, field: keyof Appliance, value: string) => {
    setAppliances(appliances.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ))
  }

  const addCommonAppliance = (name: string, watts: number) => {
    setAppliances([...appliances, {
      id: Date.now().toString(),
      name,
      watts: watts.toString(),
      hoursPerDay: '1',
      quantity: '1'
    }])
  }

  const calculations = useMemo(() => {
    const price = parseFloat(pricePerKwh) || 0
    let totalWatts = 0
    let totalDailyKwh = 0

    appliances.forEach(appliance => {
      const watts = parseFloat(appliance.watts) || 0
      const hours = parseFloat(appliance.hoursPerDay) || 0
      const quantity = parseFloat(appliance.quantity) || 1

      totalWatts += watts * quantity
      totalDailyKwh += (watts * hours * quantity) / 1000
    })

    const monthlyKwh = totalDailyKwh * 30
    const yearlyKwh = totalDailyKwh * 365

    return {
      totalWatts,
      dailyKwh: totalDailyKwh,
      monthlyKwh,
      yearlyKwh,
      dailyCost: totalDailyKwh * price,
      monthlyCost: monthlyKwh * price,
      yearlyCost: yearlyKwh * price,
    }
  }, [appliances, pricePerKwh])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Electricity Cost Calculator</h1>
        <p className="text-muted-foreground">Calculate your electricity usage and cost</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Price Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Electricity Rate (per kWh)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              placeholder="0.12"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Add Appliance</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_APPLIANCES.slice(0, 6).map(appliance => (
              <button
                key={appliance.name}
                onClick={() => addCommonAppliance(appliance.name, appliance.watts)}
                className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
              >
                {appliance.name}
              </button>
            ))}
          </div>
        </div>

        {/* Appliances List */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-4">Appliance</div>
            <div className="col-span-2">Watts</div>
            <div className="col-span-2">Hours/Day</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2"></div>
          </div>

          {appliances.map(appliance => (
            <div key={appliance.id} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={appliance.name}
                onChange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
                placeholder="Appliance"
                className="col-span-4 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={appliance.watts}
                onChange={(e) => updateAppliance(appliance.id, 'watts', e.target.value)}
                placeholder="W"
                min="0"
                className="col-span-2 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={appliance.hoursPerDay}
                onChange={(e) => updateAppliance(appliance.id, 'hoursPerDay', e.target.value)}
                placeholder="Hrs"
                min="0"
                max="24"
                className="col-span-2 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={appliance.quantity}
                onChange={(e) => updateAppliance(appliance.id, 'quantity', e.target.value)}
                placeholder="1"
                min="1"
                className="col-span-2 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => removeAppliance(appliance.id)}
                disabled={appliances.length <= 1}
                className="col-span-2 p-2 bg-muted hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addAppliance}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-4 h-4" />
          Add Appliance
        </button>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-yellow-500/10 rounded-lg text-center">
            <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
            <div className="text-sm text-muted-foreground">Total Power</div>
            <div className="text-xl font-bold">{calculations.totalWatts.toLocaleString()} W</div>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-lg text-center">
            <Calculator className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <div className="text-sm text-muted-foreground">Daily Usage</div>
            <div className="text-xl font-bold">{calculations.dailyKwh.toFixed(2)} kWh</div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
          <h3 className="font-semibold mb-3">Estimated Cost</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Daily</div>
              <div className="text-lg font-bold text-green-500">
                ${calculations.dailyCost.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Monthly</div>
              <div className="text-lg font-bold text-green-500">
                ${calculations.monthlyCost.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Yearly</div>
              <div className="text-lg font-bold text-green-500">
                ${calculations.yearlyCost.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Energy Usage */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Energy Usage</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-muted-foreground">Daily</div>
              <div className="font-medium">{calculations.dailyKwh.toFixed(2)} kWh</div>
            </div>
            <div>
              <div className="text-muted-foreground">Monthly</div>
              <div className="font-medium">{calculations.monthlyKwh.toFixed(1)} kWh</div>
            </div>
            <div>
              <div className="text-muted-foreground">Yearly</div>
              <div className="font-medium">{calculations.yearlyKwh.toFixed(0)} kWh</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
