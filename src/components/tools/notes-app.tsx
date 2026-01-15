'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  StickyNote, Plus, Search, Trash2, Edit2, Check, X, Pin, Calendar, Tag
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

const COLORS = [
  '#fef3c7', '#fee2e2', '#dbeafe', '#d1fae5', '#f3e8ff',
  '#fce7f3', '#e0e7ff', '#cffafe'
]

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  // Draft note state
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [draftColor, setDraftColor] = useState(COLORS[0])
  const [draftTags, setDraftTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('notesApp')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  const saveNotes = (updated: Note[]) => {
    setNotes(updated)
    localStorage.setItem('notesApp', JSON.stringify(updated))
  }

  const createNote = () => {
    if (!draftTitle.trim() && !draftContent.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: draftTitle.trim() || 'Untitled',
      content: draftContent.trim(),
      color: draftColor,
      pinned: false,
      tags: draftTags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    saveNotes([newNote, ...notes])
    resetDraft()
    setShowEditor(false)
  }

  const updateNote = () => {
    if (!editingNote) return

    const updated = notes.map(note =>
      note.id === editingNote.id
        ? {
            ...note,
            title: draftTitle.trim() || 'Untitled',
            content: draftContent.trim(),
            color: draftColor,
            tags: draftTags,
            updatedAt: new Date().toISOString()
          }
        : note
    )

    saveNotes(updated)
    resetDraft()
    setEditingNote(null)
    setShowEditor(false)
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id))
  }

  const togglePin = (id: string) => {
    saveNotes(notes.map(note =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ))
  }

  const resetDraft = () => {
    setDraftTitle('')
    setDraftContent('')
    setDraftColor(COLORS[0])
    setDraftTags([])
    setNewTag('')
  }

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note)
      setDraftTitle(note.title)
      setDraftContent(note.content)
      setDraftColor(note.color)
      setDraftTags(note.tags)
    } else {
      setEditingNote(null)
      resetDraft()
    }
    setShowEditor(true)
  }

  const addTag = () => {
    const tag = newTag.trim().toLowerCase()
    if (tag && !draftTags.includes(tag)) {
      setDraftTags([...draftTags, tag])
    }
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    setDraftTags(draftTags.filter(t => t !== tag))
  }

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = !selectedTag || note.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-4">
          <StickyNote className="w-4 h-4" />
          Productivity
        </div>
        <h2 className="text-2xl font-bold">Notes</h2>
        <p className="text-muted-foreground mt-2">
          Quick notes with tags and colors.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => openEditor()}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </motion.button>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedTag ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{searchQuery || selectedTag ? 'No matching notes found.' : 'No notes yet. Create your first note!'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredNotes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                style={{ backgroundColor: note.color }}
                onClick={() => openEditor(note)}
              >
                {/* Pin indicator */}
                {note.pinned && (
                  <Pin className="absolute top-2 right-2 w-4 h-4 text-gray-600" />
                )}

                <h3 className="font-semibold text-gray-800 mb-2 pr-6">{note.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-black/10 rounded text-xs text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePin(note.id)
                    }}
                    className="p-1.5 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                    title={note.pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                    className="p-1.5 rounded-lg bg-white/50 hover:bg-red-100 transition-colors text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowEditor(false)
              resetDraft()
              setEditingNote(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6 shadow-xl"
              style={{ backgroundColor: draftColor }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500 mb-4"
              />

              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Write your note..."
                className="w-full h-40 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-500 resize-none"
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {draftTags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/10 rounded text-sm text-gray-600 inline-flex items-center gap-1"
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag..."
                    className="w-20 px-2 py-1 bg-black/5 rounded text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Color:</span>
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setDraftColor(color)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      draftColor === color ? 'scale-125 ring-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowEditor(false)
                    resetDraft()
                    setEditingNote(null)
                  }}
                  className="px-4 py-2 bg-black/10 rounded-lg text-gray-700 hover:bg-black/20"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNote ? updateNote : createNote}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  {editingNote ? 'Update' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
