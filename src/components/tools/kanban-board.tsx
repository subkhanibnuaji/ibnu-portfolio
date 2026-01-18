'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Edit2, Check, X, GripVertical, Calendar, Tag,
  MoreVertical, Archive, Clock, AlertCircle, CheckCircle2
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags: string[]
  createdAt: Date
}

interface Column {
  id: string
  title: string
  tasks: Task[]
  color: string
}

const defaultColumns: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [], color: 'bg-gray-500' },
  { id: 'progress', title: 'In Progress', tasks: [], color: 'bg-blue-500' },
  { id: 'review', title: 'Review', tasks: [], color: 'bg-yellow-500' },
  { id: 'done', title: 'Done', tasks: [], color: 'bg-green-500' }
]

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; sourceColumn: string } | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<{ title: string; description: string; priority: 'low' | 'medium' | 'high'; dueDate: string; tags: string }>({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kanbanBoard')
    if (saved) {
      const parsed = JSON.parse(saved)
      setColumns(parsed.map((col: Column) => ({
        ...col,
        tasks: col.tasks.map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }))
      })))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('kanbanBoard', JSON.stringify(columns))
  }, [columns])

  const addTask = (columnId: string) => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date()
    }

    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    ))

    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })
    setShowAddTask(null)
  }

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ))
  }

  const updateTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
          }
        : col
    ))
    setEditingTask(null)
  }

  const moveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    const sourceColumn = columns.find(c => c.id === sourceColumnId)
    const task = sourceColumn?.tasks.find(t => t.id === taskId)
    if (!task) return

    setColumns(columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
      }
      if (col.id === targetColumnId) {
        return { ...col, tasks: [...col.tasks, task] }
      }
      return col
    }))
  }

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, sourceColumn: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetColumnId: string) => {
    if (draggedTask && draggedTask.sourceColumn !== targetColumnId) {
      moveTask(draggedTask.task.id, draggedTask.sourceColumn, targetColumnId)
    }
    setDraggedTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'low': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />
      case 'medium': return <Clock className="w-3 h-3" />
      case 'low': return <CheckCircle2 className="w-3 h-3" />
      default: return null
    }
  }

  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0)
  const completedTasks = columns.find(c => c.id === 'done')?.tasks.length || 0

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{totalTasks}</p>
          <p className="text-sm text-muted-foreground">Total Tasks</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-500">{completedTasks}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-blue-500">
            {columns.find(c => c.id === 'progress')?.tasks.length || 0}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </p>
          <p className="text-sm text-muted-foreground">Progress</p>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            className={`p-4 rounded-xl border border-border bg-card min-h-[400px] ${
              draggedTask && draggedTask.sourceColumn !== column.id ? 'border-primary/50 bg-primary/5' : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-sm text-muted-foreground">({column.tasks.length})</span>
              </div>
              <button
                onClick={() => setShowAddTask(column.id)}
                className="p-1 hover:bg-muted rounded"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add Task Form */}
            <AnimatePresence>
              {showAddTask === column.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-lg bg-muted"
                >
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm mb-2"
                    autoFocus
                  />
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm mb-2 resize-none"
                  />
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="flex-1 px-2 py-1 rounded border border-border bg-background text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-border bg-background text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={newTask.tags}
                    onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                    placeholder="Tags (comma separated)"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addTask(column.id)}
                      className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTask(null)
                        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })
                      }}
                      className="px-4 py-2 bg-muted rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tasks */}
            <div className="space-y-2">
              {column.tasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  draggable
                  onDragStart={() => handleDragStart(task, column.id)}
                  className={`p-3 rounded-lg border border-border bg-background cursor-grab active:cursor-grabbing hover:border-primary/50 ${
                    draggedTask?.task.id === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteTask(column.id, task.id)}
                        className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}

                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setEditingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-xl bg-card border border-border"
            >
              <h3 className="font-semibold mb-4">Edit Task</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                />
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
                />
                <div className="flex gap-4">
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const columnId = columns.find(c => c.tasks.some(t => t.id === editingTask.id))?.id
                      if (columnId) {
                        updateTask(columnId, editingTask.id, editingTask)
                      }
                    }}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="px-6 py-2 bg-muted rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
