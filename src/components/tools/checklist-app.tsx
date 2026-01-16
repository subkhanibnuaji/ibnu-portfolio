'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Plus,
  Trash2,
  Check,
  GripVertical,
  Calendar,
  Tag,
  Copy,
  Download,
  Upload,
  FolderPlus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
}

interface Checklist {
  id: string
  name: string
  color: string
  items: ChecklistItem[]
  isCollapsed: boolean
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
]

const PRIORITY_COLORS = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
}

export function ChecklistApp() {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [newListName, setNewListName] = useState('')
  const [showNewList, setShowNewList] = useState(false)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [editingItem, setEditingItem] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('checklistAppData')
    if (saved) {
      setChecklists(JSON.parse(saved))
    } else {
      // Default checklist
      setChecklists([{
        id: '1',
        name: 'My Tasks',
        color: COLORS[4],
        isCollapsed: false,
        items: [],
      }])
    }
  }, [])

  useEffect(() => {
    if (checklists.length > 0) {
      localStorage.setItem('checklistAppData', JSON.stringify(checklists))
    }
  }, [checklists])

  const addChecklist = () => {
    if (!newListName.trim()) return

    const newList: Checklist = {
      id: Date.now().toString(),
      name: newListName.trim(),
      color: selectedColor,
      items: [],
      isCollapsed: false,
    }

    setChecklists([...checklists, newList])
    setNewListName('')
    setShowNewList(false)
  }

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter(c => c.id !== id))
  }

  const toggleCollapse = (id: string) => {
    setChecklists(checklists.map(c =>
      c.id === id ? { ...c, isCollapsed: !c.isCollapsed } : c
    ))
  }

  const addItem = (checklistId: string, text: string) => {
    if (!text.trim()) return

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority: 'medium',
    }

    setChecklists(checklists.map(c =>
      c.id === checklistId
        ? { ...c, items: [...c.items, newItem] }
        : c
    ))
  }

  const updateItem = (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setChecklists(checklists.map(c =>
      c.id === checklistId
        ? {
            ...c,
            items: c.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
        : c
    ))
  }

  const deleteItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(c =>
      c.id === checklistId
        ? { ...c, items: c.items.filter(item => item.id !== itemId) }
        : c
    ))
  }

  const reorderItems = (checklistId: string, items: ChecklistItem[]) => {
    setChecklists(checklists.map(c =>
      c.id === checklistId ? { ...c, items } : c
    ))
  }

  const duplicateChecklist = (checklist: Checklist) => {
    const newList: Checklist = {
      ...checklist,
      id: Date.now().toString(),
      name: `${checklist.name} (Copy)`,
      items: checklist.items.map(item => ({ ...item, id: Date.now().toString() + Math.random() })),
    }
    setChecklists([...checklists, newList])
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(checklists, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'checklists.json'
    link.click()
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (Array.isArray(data)) {
          setChecklists(data)
        }
      } catch (err) {
        console.error('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const getProgress = (items: ChecklistItem[]) => {
    if (items.length === 0) return 0
    return Math.round((items.filter(i => i.completed).length / items.length) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Checklist</h1>
        <p className="text-muted-foreground">Organize your tasks with multiple lists</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Header Actions */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <button
            onClick={() => setShowNewList(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            New List
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2 text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* New List Form */}
        <AnimatePresence>
          {showNewList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name..."
                  className="w-full px-3 py-2 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && addChecklist()}
                  autoFocus
                />
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addChecklist}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Create List
                  </button>
                  <button
                    onClick={() => setShowNewList(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checklists */}
        <div className="space-y-4">
          {checklists.map(checklist => (
            <div key={checklist.id} className="bg-muted/30 rounded-lg overflow-hidden">
              {/* List Header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleCollapse(checklist.id)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: checklist.color }}
                />
                <button className="p-1">
                  {checklist.isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <h3 className="font-semibold flex-1">{checklist.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {checklist.items.filter(i => i.completed).length}/{checklist.items.length}
                  </span>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${getProgress(checklist.items)}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateChecklist(checklist); }}
                  className="p-1 hover:bg-muted rounded"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChecklist(checklist.id); }}
                  className="p-1 hover:bg-red-500/20 text-red-500 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* List Items */}
              <AnimatePresence>
                {!checklist.isCollapsed && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      <Reorder.Group
                        values={checklist.items}
                        onReorder={(items) => reorderItems(checklist.id, items)}
                        className="space-y-2"
                      >
                        {checklist.items.map(item => (
                          <Reorder.Item key={item.id} value={item}>
                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg group">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100" />
                              <button
                                onClick={() => updateItem(checklist.id, item.id, { completed: !item.completed })}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  item.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-muted-foreground hover:border-green-500'
                                }`}
                              >
                                {item.completed && <Check className="w-3 h-3" />}
                              </button>
                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updateItem(checklist.id, item.id, { text: e.target.value })}
                                className={`flex-1 bg-transparent focus:outline-none ${
                                  item.completed ? 'line-through text-muted-foreground' : ''
                                }`}
                              />
                              <select
                                value={item.priority}
                                onChange={(e) => updateItem(checklist.id, item.id, { priority: e.target.value as ChecklistItem['priority'] })}
                                className="bg-muted px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[item.priority]}`} />
                              <input
                                type="date"
                                value={item.dueDate || ''}
                                onChange={(e) => updateItem(checklist.id, item.id, { dueDate: e.target.value })}
                                className="bg-muted px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100"
                              />
                              <button
                                onClick={() => deleteItem(checklist.id, item.id)}
                                className="p-1 hover:bg-red-500/20 text-red-500 rounded opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>

                      {/* Add Item */}
                      <div className="flex items-center gap-3 p-3">
                        <Plus className="w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Add new item..."
                          className="flex-1 bg-transparent focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              addItem(checklist.id, e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {checklists.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No checklists yet. Create your first one!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
