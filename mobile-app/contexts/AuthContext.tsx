import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { supabase, UserProfile, UserPreferences, defaultPreferences } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo mode storage keys
const DEMO_USER_KEY = '@demo_user'
const DEMO_PROFILE_KEY = '@demo_profile'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Load demo user from storage
  const loadDemoUser = useCallback(async () => {
    try {
      const userJson = await AsyncStorage.getItem(DEMO_USER_KEY)
      const profileJson = await AsyncStorage.getItem(DEMO_PROFILE_KEY)

      if (userJson) {
        const user = JSON.parse(userJson)
        const profile = profileJson ? JSON.parse(profileJson) : null
        setState({
          user,
          session: { user } as Session,
          profile,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Error loading demo user:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        // Try Supabase first
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          setState({
            user: session.user,
            session,
            profile: null,
            isLoading: false,
            isAuthenticated: true,
          })
          // Fetch profile
          fetchProfile(session.user.id)
        } else {
          // Fall back to demo mode
          await loadDemoUser()
        }
      } catch (error) {
        // Demo mode fallback
        await loadDemoUser()
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setState(prev => ({
            ...prev,
            user: session.user,
            session,
            isAuthenticated: true,
            isLoading: false,
          }))
          fetchProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [loadDemoUser])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setState(prev => ({ ...prev, profile: data }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Demo mode: allow login with any email/password
        if (email && password.length >= 6) {
          const demoUser: User = {
            id: `demo-${Date.now()}`,
            email,
            app_metadata: {},
            user_metadata: { full_name: email.split('@')[0] },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User

          const demoProfile: UserProfile = {
            id: `profile-${Date.now()}`,
            user_id: demoUser.id,
            display_name: email.split('@')[0],
            preferences: defaultPreferences,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
          await AsyncStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile))

          setState({
            user: demoUser,
            session: { user: demoUser } as Session,
            profile: demoProfile,
            isLoading: false,
            isAuthenticated: true,
          })

          return { error: null }
        }
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (error) {
        // Demo mode: create demo account
        if (email && password.length >= 6 && fullName) {
          const demoUser: User = {
            id: `demo-${Date.now()}`,
            email,
            app_metadata: {},
            user_metadata: { full_name: fullName },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User

          const demoProfile: UserProfile = {
            id: `profile-${Date.now()}`,
            user_id: demoUser.id,
            display_name: fullName,
            preferences: defaultPreferences,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
          await AsyncStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile))

          setState({
            user: demoUser,
            session: { user: demoUser } as Session,
            profile: demoProfile,
            isLoading: false,
            isAuthenticated: true,
          })

          return { error: null }
        }
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Supabase signout error:', error)
    }

    // Clear demo storage
    await AsyncStorage.removeItem(DEMO_USER_KEY)
    await AsyncStorage.removeItem(DEMO_PROFILE_KEY)

    setState({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user) throw new Error('No user logged in')

      // Try Supabase update
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', state.user.id)

        if (!error) {
          setState(prev => ({
            ...prev,
            profile: prev.profile ? { ...prev.profile, ...updates } : null,
          }))
          return { error: null }
        }
      } catch {}

      // Demo mode update
      const updatedProfile = { ...state.profile, ...updates } as UserProfile
      await AsyncStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updatedProfile))
      setState(prev => ({ ...prev, profile: updatedProfile }))

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (state.profile) {
      await updateProfile({
        preferences: { ...state.profile.preferences, ...preferences },
      })
    }
  }

  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.refreshSession()
      if (data.session) {
        setState(prev => ({
          ...prev,
          session: data.session,
          user: data.session?.user || null,
        }))
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        updatePreferences,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
