'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Utensils, Plus, Trash2, Search, Flame, Apple, Beef, Wheat, Droplets,
  TrendingUp, Target, BarChart3, Coffee, Cookie, Pizza, Salad
} from 'lucide-react'

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  timestamp: Date
}

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

const commonFoods = [
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium' },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'Rice (white)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup' },
  { name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5, serving: '1 large' },
  { name: 'Bread (whole wheat)', calories: 81, protein: 4, carbs: 14, fat: 1, serving: '1 slice' },
  { name: 'Milk (2%)', calories: 122, protein: 8, carbs: 12, fat: 5, serving: '1 cup' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g' },
  { name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fat: 0.5, serving: '1 cup' },
  { name: 'Oatmeal', calories: 158, protein: 6, carbs: 27, fat: 3, serving: '1 cup' },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 1, serving: '1 cup' },
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz' },
  { name: 'Avocado', calories: 234, protein: 3, carbs: 12, fat: 21, serving: '1 medium' },
  { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 24, fat: 0, serving: '1 medium' },
  { name: 'Coffee (black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup' },
  { name: 'Orange Juice', calories: 112, protein: 2, carbs: 26, fat: 0.5, serving: '1 cup' }
]

export function CalorieCounter() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving: '1 serving'
  })
  const [goals, setGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  })

  // Load from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem(`calories_${today}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setFoods(parsed.map((f: FoodItem) => ({ ...f, timestamp: new Date(f.timestamp) })))
    }

    const savedGoals = localStorage.getItem('calorieGoals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    localStorage.setItem(`calories_${today}`, JSON.stringify(foods))
  }, [foods])

  useEffect(() => {
    localStorage.setItem('calorieGoals', JSON.stringify(goals))
  }, [goals])

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const mealTotals = (meal: string) => {
    return foods
      .filter(f => f.meal === meal)
      .reduce((acc, f) => acc + f.calories, 0)
  }

  const addFood = (food: typeof commonFoods[0]) => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      ...food,
      meal: selectedMeal,
      timestamp: new Date()
    }
    setFoods([...foods, newFood])
  }

  const addCustomFood = () => {
    if (!customFood.name) return
    const newFood: FoodItem = {
      id: Date.now().toString(),
      ...customFood,
      meal: selectedMeal,
      timestamp: new Date()
    }
    setFoods([...foods, newFood])
    setCustomFood({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, serving: '1 serving' })
    setShowAddCustom(false)
  }

  const removeFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id))
  }

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return Coffee
      case 'lunch': return Salad
      case 'dinner': return Pizza
      case 'snack': return Cookie
      default: return Utensils
    }
  }

  const getProgressColor = (current: number, goal: number): string => {
    const percent = (current / goal) * 100
    if (percent > 100) return 'text-red-500'
    if (percent >= 80) return 'text-green-500'
    return 'text-primary'
  }

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold">
            <span className={getProgressColor(totals.calories, goals.calories)}>{totals.calories}</span>
            <span className="text-2xl text-muted-foreground"> / {goals.calories}</span>
          </h2>
          <p className="text-sm text-muted-foreground">Calories Today</p>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            className={`h-full ${
              totals.calories > goals.calories ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totals.calories / goals.calories) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-xl bg-card">
            <Beef className="w-5 h-5 mx-auto mb-1 text-red-500" />
            <p className={`text-lg font-bold ${getProgressColor(totals.protein, goals.protein)}`}>
              {totals.protein}g
            </p>
            <p className="text-xs text-muted-foreground">Protein / {goals.protein}g</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-card">
            <Wheat className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
            <p className={`text-lg font-bold ${getProgressColor(totals.carbs, goals.carbs)}`}>
              {totals.carbs}g
            </p>
            <p className="text-xs text-muted-foreground">Carbs / {goals.carbs}g</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-card">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-purple-500" />
            <p className={`text-lg font-bold ${getProgressColor(totals.fat, goals.fat)}`}>
              {totals.fat}g
            </p>
            <p className="text-xs text-muted-foreground">Fat / {goals.fat}g</p>
          </div>
        </div>
      </div>

      {/* Meal Breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(meal => {
          const MealIcon = getMealIcon(meal)
          const mealCalories = mealTotals(meal)
          return (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={`p-3 rounded-xl border transition-all ${
                selectedMeal === meal
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <MealIcon className={`w-5 h-5 mx-auto mb-1 ${selectedMeal === meal ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm font-medium capitalize">{meal}</p>
              <p className="text-xs text-muted-foreground">{mealCalories} cal</p>
            </button>
          )
        })}
      </div>

      {/* Search & Add Food */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Custom
          </button>
        </div>

        {/* Custom Food Form */}
        {showAddCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 rounded-lg bg-muted"
          >
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
              <input
                type="text"
                value={customFood.name}
                onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                placeholder="Food name"
                className="col-span-2 px-3 py-2 rounded-lg border border-border bg-background"
              />
              <input
                type="number"
                value={customFood.calories || ''}
                onChange={(e) => setCustomFood({ ...customFood, calories: parseInt(e.target.value) || 0 })}
                placeholder="Calories"
                className="px-3 py-2 rounded-lg border border-border bg-background"
              />
              <input
                type="number"
                value={customFood.protein || ''}
                onChange={(e) => setCustomFood({ ...customFood, protein: parseInt(e.target.value) || 0 })}
                placeholder="Protein (g)"
                className="px-3 py-2 rounded-lg border border-border bg-background"
              />
              <input
                type="number"
                value={customFood.carbs || ''}
                onChange={(e) => setCustomFood({ ...customFood, carbs: parseInt(e.target.value) || 0 })}
                placeholder="Carbs (g)"
                className="px-3 py-2 rounded-lg border border-border bg-background"
              />
              <input
                type="number"
                value={customFood.fat || ''}
                onChange={(e) => setCustomFood({ ...customFood, fat: parseInt(e.target.value) || 0 })}
                placeholder="Fat (g)"
                className="px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <button
              onClick={addCustomFood}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium"
            >
              Add to {selectedMeal}
            </button>
          </motion.div>
        )}

        {/* Food List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {filteredFoods.map((food, index) => (
            <button
              key={index}
              onClick={() => addFood(food)}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div>
                <p className="font-medium">{food.name}</p>
                <p className="text-xs text-muted-foreground">{food.serving}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{food.calories}</p>
                <p className="text-xs text-muted-foreground">cal</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Log */}
      {foods.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Today&apos;s Food Log
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {foods.map((food) => {
              const MealIcon = getMealIcon(food.meal)
              return (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <MealIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-xs text-muted-foreground">
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold">{food.calories} cal</p>
                    <button
                      onClick={() => removeFood(food.id)}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Goals Setting */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Daily Goals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Calories</label>
            <input
              type="number"
              value={goals.calories}
              onChange={(e) => setGoals({ ...goals, calories: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Protein (g)</label>
            <input
              type="number"
              value={goals.protein}
              onChange={(e) => setGoals({ ...goals, protein: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Carbs (g)</label>
            <input
              type="number"
              value={goals.carbs}
              onChange={(e) => setGoals({ ...goals, carbs: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Fat (g)</label>
            <input
              type="number"
              value={goals.fat}
              onChange={(e) => setGoals({ ...goals, fat: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
