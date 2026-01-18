'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat, Plus, Trash2, Edit2, Save, Search,
  Clock, Users, Star, Heart, BookOpen, Utensils
} from 'lucide-react'

interface Ingredient {
  name: string
  amount: string
  unit: string
}

interface Recipe {
  id: string
  title: string
  description: string
  servings: number
  prepTime: number
  cookTime: number
  ingredients: Ingredient[]
  instructions: string[]
  category: string
  rating: number
  favorite: boolean
  createdAt: Date
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drinks', 'Other']
const UNITS = ['', 'cups', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'pieces', 'slices']

export function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
    category: 'Dinner',
    rating: 0,
    favorite: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('recipes')
    if (saved) {
      const parsed = JSON.parse(saved)
      setRecipes(parsed.map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) })))
    }
  }, [])

  const saveRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes)
    localStorage.setItem('recipes', JSON.stringify(newRecipes))
  }

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...(formData.ingredients || []), { name: '', amount: '', unit: '' }]
    })
  }

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...(formData.ingredients || [])]
    newIngredients.splice(index, 1)
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...(formData.ingredients || [])]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const handleAddInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...(formData.instructions || []), '']
    })
  }

  const handleRemoveInstruction = (index: number) => {
    const newInstructions = [...(formData.instructions || [])]
    newInstructions.splice(index, 1)
    setFormData({ ...formData, instructions: newInstructions })
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...(formData.instructions || [])]
    newInstructions[index] = value
    setFormData({ ...formData, instructions: newInstructions })
  }

  const handleSave = () => {
    if (!formData.title?.trim()) {
      alert('Please enter a recipe title')
      return
    }

    const recipe: Recipe = {
      id: isEditing && selectedRecipe ? selectedRecipe.id : Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      servings: formData.servings || 4,
      prepTime: formData.prepTime || 0,
      cookTime: formData.cookTime || 0,
      ingredients: (formData.ingredients || []).filter(i => i.name.trim()),
      instructions: (formData.instructions || []).filter(i => i.trim()),
      category: formData.category || 'Other',
      rating: formData.rating || 0,
      favorite: formData.favorite || false,
      createdAt: isEditing && selectedRecipe ? selectedRecipe.createdAt : new Date()
    }

    let newRecipes: Recipe[]
    if (isEditing && selectedRecipe) {
      newRecipes = recipes.map(r => r.id === selectedRecipe.id ? recipe : r)
    } else {
      newRecipes = [recipe, ...recipes]
    }

    saveRecipes(newRecipes)
    setSelectedRecipe(recipe)
    setIsEditing(false)
  }

  const handleDelete = (recipeId: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      const newRecipes = recipes.filter(r => r.id !== recipeId)
      saveRecipes(newRecipes)
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe(null)
      }
    }
  }

  const handleEdit = (recipe: Recipe) => {
    setFormData({
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      ingredients: [...recipe.ingredients],
      instructions: [...recipe.instructions],
      category: recipe.category,
      rating: recipe.rating,
      favorite: recipe.favorite
    })
    setSelectedRecipe(recipe)
    setIsEditing(true)
  }

  const handleNewRecipe = () => {
    setFormData({
      title: '',
      description: '',
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      ingredients: [{ name: '', amount: '', unit: '' }],
      instructions: [''],
      category: 'Dinner',
      rating: 0,
      favorite: false
    })
    setSelectedRecipe(null)
    setIsEditing(true)
  }

  const toggleFavorite = (recipe: Recipe) => {
    const updated = { ...recipe, favorite: !recipe.favorite }
    const newRecipes = recipes.map(r => r.id === recipe.id ? updated : r)
    saveRecipes(newRecipes)
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(updated)
    }
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory
    const matchesFavorite = !showFavoritesOnly || recipe.favorite
    return matchesSearch && matchesCategory && matchesFavorite
  })

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Header */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all" className="bg-slate-800">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-2 rounded-lg border transition-colors ${
              showFavoritesOnly
                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                : 'bg-white/10 border-white/20 text-white/70'
            }`}
          >
            <Heart className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleNewRecipe}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Recipe
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Editing Mode */}
          {isEditing && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {selectedRecipe ? 'Edit Recipe' : 'New Recipe'}
                </h2>
                <button
                  onClick={() => { setIsEditing(false); setSelectedRecipe(null); }}
                  className="text-white/50 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Recipe Title"
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30"
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/50 text-sm mb-1">Servings</label>
                  <input
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Cook Time (min)</label>
                  <input
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Ingredients</label>
                  <button
                    onClick={handleAddIngredient}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.ingredients?.map((ing, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ing.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        placeholder="Amount"
                        className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      />
                      <select
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      >
                        {UNITS.map(unit => (
                          <option key={unit} value={unit} className="bg-slate-800">{unit || 'unit'}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Ingredient"
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      />
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Instructions</label>
                  <button
                    onClick={handleAddInstruction}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Step
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.instructions?.map((inst, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <textarea
                        value={inst}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        rows={2}
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      />
                      <button
                        onClick={() => handleRemoveInstruction(index)}
                        className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Recipe
              </button>
            </motion.div>
          )}

          {/* Recipe View */}
          {!isEditing && selectedRecipe && (
            <motion.div
              key="view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-blue-400 hover:text-blue-300 text-sm mb-2"
                  >
                    ← Back to list
                  </button>
                  <h2 className="text-2xl font-bold text-white">{selectedRecipe.title}</h2>
                  <p className="text-white/70">{selectedRecipe.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedRecipe)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <Heart className={`w-5 h-5 ${selectedRecipe.favorite ? 'text-red-400 fill-current' : 'text-white/50'}`} />
                  </button>
                  <button
                    onClick={() => handleEdit(selectedRecipe)}
                    className="p-2 rounded-lg hover:bg-white/10 text-blue-400"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRecipe.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-1 text-white/70 bg-white/5 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" /> {selectedRecipe.servings} servings
                </span>
                <span className="flex items-center gap-1 text-white/70 bg-white/5 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" /> Prep: {selectedRecipe.prepTime}min
                </span>
                <span className="flex items-center gap-1 text-white/70 bg-white/5 px-3 py-1 rounded-full">
                  <Utensils className="w-4 h-4" /> Cook: {selectedRecipe.cookTime}min
                </span>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                  {selectedRecipe.category}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, index) => (
                      <li key={index} className="text-white/70 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        {ing.amount} {ing.unit} {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((inst, index) => (
                      <li key={index} className="text-white/70 flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recipe List */}
          {!isEditing && !selectedRecipe && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <p className="text-white/50">
                    {recipes.length === 0 ? 'No recipes yet. Add your first recipe!' : 'No recipes match your search.'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecipes.map(recipe => (
                    <motion.div
                      key={recipe.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{recipe.title}</h3>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe); }}
                          className="p-1"
                        >
                          <Heart className={`w-4 h-4 ${recipe.favorite ? 'text-red-400 fill-current' : 'text-white/30'}`} />
                        </button>
                      </div>
                      <p className="text-white/50 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recipe.prepTime + recipe.cookTime}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {recipe.servings}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                          {recipe.category}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
