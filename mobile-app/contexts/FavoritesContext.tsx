import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'

interface FavoriteItem {
  id: string
  projectId: string
  title: string
  description: string
  category: string
  addedAt: string
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  isFavorite: (projectId: string) => boolean
  addFavorite: (project: Omit<FavoriteItem, 'id' | 'addedAt'>) => Promise<void>
  removeFavorite: (projectId: string) => Promise<void>
  toggleFavorite: (project: Omit<FavoriteItem, 'id' | 'addedAt'>) => Promise<boolean>
  clearAllFavorites: () => Promise<void>
  isLoading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = '@favorites'

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }

  const isFavorite = useCallback(
    (projectId: string) => favorites.some((f) => f.projectId === projectId),
    [favorites]
  )

  const addFavorite = async (project: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    if (isFavorite(project.projectId)) return

    const newFavorite: FavoriteItem = {
      ...project,
      id: `fav-${Date.now()}`,
      addedAt: new Date().toISOString(),
    }

    const newFavorites = [newFavorite, ...favorites]
    await saveFavorites(newFavorites)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const removeFavorite = async (projectId: string) => {
    const newFavorites = favorites.filter((f) => f.projectId !== projectId)
    await saveFavorites(newFavorites)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const toggleFavorite = async (project: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    if (isFavorite(project.projectId)) {
      await removeFavorite(project.projectId)
      return false
    } else {
      await addFavorite(project)
      return true
    }
  }

  const clearAllFavorites = async () => {
    await saveFavorites([])
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearAllFavorites,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
