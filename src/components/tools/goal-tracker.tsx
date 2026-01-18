'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Plus, Trash2, CheckCircle, Circle,
  TrendingUp, Calendar, Award, Edit2, Save, X
} from 'lucide-react'

interface Milestone {
  id: string
  title: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  category: string
  deadline: string
  milestones: Milestone[]
  progress: number
  createdAt: string
  completedAt?: string
}

const CATEGORIES = [
  { id: 'health', name: 'Health & Fitness', color: 'bg-green-500', emoji: '💪' },
  { id: 'career', name: 'Career', color: 'bg-blue-500', emoji: '💼' },
  { id: 'finance', name: 'Finance', color: 'bg-yellow-500', emoji: '💰' },
  { id: 'education', name: 'Education', color: 'bg-purple-500', emoji: '📚' },
  { id: 'personal', name: 'Personal', color: 'bg-pink-500', emoji: '🌟' },
  { id: 'creative', name: 'Creative', color: 'bg-orange-500', emoji: '🎨' }
]

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    deadline: '',
    milestones: ['']
  })

  useEffect(() => {
    const saved = localStorage.getItem('goals')
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }, [])

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals)
    localStorage.setItem('goals', JSON.stringify(newGoals))
  }

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      category: newGoal.category,
      deadline: newGoal.deadline,
      milestones: newGoal.milestones
        .filter(m => m.trim())
        .map(m => ({ id: Date.now().toString() + Math.random(), title: m.trim(), completed: false })),
      progress: 0,
      createdAt: new Date().toISOString()
    }

    saveGoals([goal, ...goals])
    setNewGoal({ title: '', description: '', category: 'personal', deadline: '', milestones: [''] })
    setShowForm(false)
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const newGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const milestones = goal.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        )
        const completedCount = milestones.filter(m => m.completed).length
        const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0
        const completedAt = progress === 100 ? new Date().toISOString() : undefined

        return { ...goal, milestones, progress, completedAt }
      }
      return goal
    })
    saveGoals(newGoals)
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id))
  }

  const addMilestoneField = () => {
    setNewGoal(prev => ({ ...prev, milestones: [...prev.milestones, ''] }))
  }

  const updateMilestone = (index: number, value: string) => {
    const milestones = [...newGoal.milestones]
    milestones[index] = value
    setNewGoal(prev => ({ ...prev, milestones }))
  }

  const removeMilestoneField = (index: number) => {
    if (newGoal.milestones.length > 1) {
      setNewGoal(prev => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== index)
      }))
    }
  }

  const getDaysRemaining = (deadline: string): number => {
    if (!deadline) return -1
    const now = new Date()
    const end = new Date(deadline)
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.progress === 100).length,
    inProgress: goals.filter(g => g.progress > 0 && g.progress < 100).length,
    avgProgress: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0
  }

  const getCategoryColor = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.color || 'bg-gray-500'
  }

  const getCategoryEmoji = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.emoji || '🎯'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-white/50 text-sm">Total Goals</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-white/50 text-sm">Completed</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
            <div className="text-white/50 text-sm">In Progress</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{stats.avgProgress}%</div>
            <div className="text-white/50 text-sm">Avg Progress</div>
          </div>
        </div>

        {/* Add Goal Button */}
        {!showForm && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-white/70 hover:border-white/40 hover:text-white flex items-center justify-center gap-2 mb-6"
          >
            <Plus className="w-5 h-5" />
            Add New Goal
          </motion.button>
        )}

        {/* Add Goal Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">New Goal</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1 text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Goal title..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                />

                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description (optional)..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none h-20"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-sm mb-1 block">Category</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-1 block">Deadline</label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm mb-2 block">Milestones</label>
                  {newGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => updateMilestone(index, e.target.value)}
                        placeholder={`Milestone ${index + 1}...`}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                      />
                      {newGoal.milestones.length > 1 && (
                        <button
                          onClick={() => removeMilestoneField(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addMilestoneField}
                    className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" /> Add milestone
                  </button>
                </div>

                <button
                  onClick={addGoal}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Create Goal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/50">No goals yet. Create your first goal!</p>
            </div>
          ) : (
            goals.map(goal => {
              const daysRemaining = getDaysRemaining(goal.deadline)

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/5 rounded-xl p-5 border-l-4 ${getCategoryColor(goal.category)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getCategoryEmoji(goal.category)}</span>
                        <h3 className={`text-lg font-semibold ${goal.progress === 100 ? 'text-green-400 line-through' : 'text-white'}`}>
                          {goal.title}
                        </h3>
                        {goal.progress === 100 && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      {goal.description && (
                        <p className="text-white/60 text-sm">{goal.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Progress</span>
                      <span className="text-white">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        className={`h-full ${goal.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Calendar className="w-4 h-4 text-white/50" />
                      <span className={
                        daysRemaining < 0
                          ? 'text-red-400'
                          : daysRemaining <= 7
                          ? 'text-yellow-400'
                          : 'text-white/70'
                      }>
                        {daysRemaining < 0
                          ? 'Overdue'
                          : daysRemaining === 0
                          ? 'Due today'
                          : `${daysRemaining} days remaining`}
                      </span>
                    </div>
                  )}

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <div className="space-y-2">
                      {goal.milestones.map(milestone => (
                        <div
                          key={milestone.id}
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-white/30 group-hover:text-white/50" />
                          )}
                          <span className={milestone.completed ? 'text-white/50 line-through' : 'text-white/80'}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}
