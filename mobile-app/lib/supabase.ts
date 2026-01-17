import 'react-native-url-polyfill/dist/polyfill'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// Supabase configuration
// For demo purposes, using public anon key (safe to expose)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'

// Custom storage adapter that uses SecureStore for native and AsyncStorage for web
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key)
    }
    return SecureStore.getItemAsync(key)
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value)
    } else {
      await SecureStore.setItemAsync(key, value)
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key)
    } else {
      await SecureStore.deleteItemAsync(key)
    }
  },
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string
  bio?: string
  location?: string
  website?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  phone?: string
  preferences: UserPreferences
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  language: string
}

export interface Favorite {
  id: string
  user_id: string
  project_id: string
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  project_id?: string
  title: string
  content: string
  color: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  action: 'view' | 'favorite' | 'unfavorite' | 'note_create' | 'note_update' | 'login' | 'logout'
  resource_type?: string
  resource_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

// Default preferences
export const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: true,
  language: 'en',
}
