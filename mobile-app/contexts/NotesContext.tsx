import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'

export interface Note {
  id: string
  title: string
  content: string
  color: string
  projectId?: string
  projectTitle?: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export const NOTE_COLORS = [
  '#fef3c7', // yellow
  '#dbeafe', // blue
  '#dcfce7', // green
  '#fce7f3', // pink
  '#e9d5ff', // purple
  '#fed7d7', // red
  '#cffafe', // cyan
  '#fef9c3', // lime
] as const

interface NotesContextType {
  notes: Note[]
  pinnedNotes: Note[]
  unpinnedNotes: Note[]
  getNote: (id: string) => Note | undefined
  getNotesByProject: (projectId: string) => Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  searchNotes: (query: string) => Note[]
  clearAllNotes: () => Promise<void>
  isLoading: boolean
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const NOTES_STORAGE_KEY = '@notes'

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load notes from storage on mount
  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTES_STORAGE_KEY)
      if (stored) {
        setNotes(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes))
      setNotes(newNotes)
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  const pinnedNotes = notes.filter((n) => n.isPinned).sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const unpinnedNotes = notes.filter((n) => !n.isPinned).sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const getNote = useCallback(
    (id: string) => notes.find((n) => n.id === id),
    [notes]
  )

  const getNotesByProject = useCallback(
    (projectId: string) => notes.filter((n) => n.projectId === projectId),
    [notes]
  )

  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const now = new Date().toISOString()
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }

    const newNotes = [newNote, ...notes]
    await saveNotes(newNotes)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    return newNote
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const newNotes = notes.map((note) =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    )
    await saveNotes(newNotes)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const deleteNote = async (id: string) => {
    const newNotes = notes.filter((n) => n.id !== id)
    await saveNotes(newNotes)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  }

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (note) {
      await updateNote(id, { isPinned: !note.isPinned })
    }
  }

  const searchNotes = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase()
      return notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery) ||
          (note.projectTitle && note.projectTitle.toLowerCase().includes(lowerQuery))
      )
    },
    [notes]
  )

  const clearAllNotes = async () => {
    await saveNotes([])
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        pinnedNotes,
        unpinnedNotes,
        getNote,
        getNotesByProject,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        searchNotes,
        clearAllNotes,
        isLoading,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}
