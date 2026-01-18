import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Card } from '@/components/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useNotes } from '@/contexts/NotesContext'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useColorScheme } from '@/hooks/useColorScheme'

type ThemeOption = 'light' | 'dark' | 'system'

export default function SettingsScreen() {
  const { profile, isAuthenticated, updatePreferences, signOut } = useAuth()
  const { clearAllFavorites, favorites } = useFavorites()
  const { clearAllNotes, notes } = useNotes()
  const colorScheme = useColorScheme()

  const [theme, setTheme] = useState<ThemeOption>(
    profile?.preferences?.theme || 'system'
  )
  const [pushNotifications, setPushNotifications] = useState(
    profile?.preferences?.push_notifications ?? true
  )
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.preferences?.email_notifications ?? true
  )
  const [hapticFeedback, setHapticFeedback] = useState(true)

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')
  const backgroundColor = useThemeColor({}, 'background')

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (isAuthenticated) {
      updatePreferences({ theme: newTheme })
    }
  }

  const handleClearData = (type: 'favorites' | 'notes' | 'all') => {
    const messages = {
      favorites: {
        title: 'Clear Favorites',
        message: `Are you sure you want to remove all ${favorites.length} favorites?`,
        action: clearAllFavorites,
      },
      notes: {
        title: 'Clear Notes',
        message: `Are you sure you want to delete all ${notes.length} notes?`,
        action: clearAllNotes,
      },
      all: {
        title: 'Clear All Data',
        message: 'This will delete all your favorites, notes, and local data. This cannot be undone.',
        action: async () => {
          await clearAllFavorites()
          await clearAllNotes()
        },
      },
    }

    const { title, message, action } = messages[type]

    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: action,
        },
      ]
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllFavorites()
            await clearAllNotes()
            await signOut()
            router.replace('/(tabs)')
          },
        },
      ]
    )
  }

  const SettingRow = ({
    icon,
    iconColor,
    title,
    subtitle,
    onPress,
    rightElement,
    danger,
  }: {
    icon: string
    iconColor?: string
    title: string
    subtitle?: string
    onPress?: () => void
    rightElement?: React.ReactNode
    danger?: boolean
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.iconContainer, { backgroundColor: (iconColor || primaryColor) + '20' }]}>
        <Ionicons name={icon as any} size={20} color={iconColor || primaryColor} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText
          type="defaultSemiBold"
          style={danger ? { color: '#ef4444' } : undefined}
        >
          {title}
        </ThemedText>
        {subtitle && <ThemedText type="muted">{subtitle}</ThemedText>}
      </View>
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color={mutedColor} />
      ))}
    </TouchableOpacity>
  )

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Appearance
          </ThemedText>

          <View style={styles.themeSelector}>
            {(['light', 'dark', 'system'] as ThemeOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.themeOption,
                  { borderColor: theme === option ? primaryColor : borderColor },
                  theme === option && { backgroundColor: primaryColor + '10' },
                ]}
                onPress={() => handleThemeChange(option)}
              >
                <Ionicons
                  name={
                    option === 'light'
                      ? 'sunny'
                      : option === 'dark'
                      ? 'moon'
                      : 'phone-portrait-outline'
                  }
                  size={24}
                  color={theme === option ? primaryColor : mutedColor}
                />
                <ThemedText
                  style={[
                    styles.themeLabel,
                    theme === option && { color: primaryColor, fontWeight: '600' },
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <SettingRow
            icon="color-palette"
            iconColor="#8b5cf6"
            title="Haptic Feedback"
            subtitle="Vibration on interactions"
            rightElement={
              <Switch
                value={hapticFeedback}
                onValueChange={(value) => {
                  setHapticFeedback(value)
                  if (value) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
                trackColor={{ false: borderColor, true: primaryColor + '50' }}
                thumbColor={hapticFeedback ? primaryColor : '#f4f3f4'}
              />
            }
          />
        </Card>

        {/* Notifications */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Notifications
          </ThemedText>

          <SettingRow
            icon="notifications"
            iconColor="#f59e0b"
            title="Push Notifications"
            subtitle="Receive push notifications"
            rightElement={
              <Switch
                value={pushNotifications}
                onValueChange={(value) => {
                  setPushNotifications(value)
                  if (isAuthenticated) {
                    updatePreferences({ push_notifications: value })
                  }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
                trackColor={{ false: borderColor, true: primaryColor + '50' }}
                thumbColor={pushNotifications ? primaryColor : '#f4f3f4'}
              />
            }
          />

          <SettingRow
            icon="mail"
            iconColor="#3b82f6"
            title="Email Notifications"
            subtitle="Receive email updates"
            rightElement={
              <Switch
                value={emailNotifications}
                onValueChange={(value) => {
                  setEmailNotifications(value)
                  if (isAuthenticated) {
                    updatePreferences({ email_notifications: value })
                  }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
                trackColor={{ false: borderColor, true: primaryColor + '50' }}
                thumbColor={emailNotifications ? primaryColor : '#f4f3f4'}
              />
            }
          />
        </Card>

        {/* Data Management */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data Management
          </ThemedText>

          <SettingRow
            icon="heart-dislike"
            iconColor="#f59e0b"
            title="Clear Favorites"
            subtitle={`${favorites.length} saved favorites`}
            onPress={() => handleClearData('favorites')}
          />

          <SettingRow
            icon="trash-bin"
            iconColor="#3b82f6"
            title="Clear Notes"
            subtitle={`${notes.length} saved notes`}
            onPress={() => handleClearData('notes')}
          />

          <SettingRow
            icon="nuclear"
            iconColor="#ef4444"
            title="Clear All Local Data"
            subtitle="Remove all cached data"
            onPress={() => handleClearData('all')}
            danger
          />
        </Card>

        {/* Account */}
        {isAuthenticated && (
          <Card style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Account
            </ThemedText>

            <SettingRow
              icon="person"
              iconColor="#10b981"
              title="Edit Profile"
              subtitle="Update your information"
              onPress={() => router.push('/profile')}
            />

            <SettingRow
              icon="key"
              iconColor="#8b5cf6"
              title="Change Password"
              subtitle="Update your password"
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
            />

            <SettingRow
              icon="shield-checkmark"
              iconColor="#3b82f6"
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
            />

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <SettingRow
              icon="trash"
              iconColor="#ef4444"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              danger
            />
          </Card>
        )}

        {/* About */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            About
          </ThemedText>

          <SettingRow
            icon="information-circle"
            iconColor="#3b82f6"
            title="App Version"
            subtitle="1.0.0"
          />

          <SettingRow
            icon="document-text"
            iconColor="#8b5cf6"
            title="Terms of Service"
            onPress={() => Linking.openURL('https://ibnu-portfolio-ashen.vercel.app/terms')}
          />

          <SettingRow
            icon="shield"
            iconColor="#10b981"
            title="Privacy Policy"
            onPress={() => Linking.openURL('https://ibnu-portfolio-ashen.vercel.app/privacy')}
          />

          <SettingRow
            icon="logo-github"
            iconColor={textColor}
            title="Source Code"
            subtitle="View on GitHub"
            onPress={() => Linking.openURL('https://github.com/subkhanibnuaji/ibnu-portfolio')}
          />

          <SettingRow
            icon="globe"
            iconColor="#f59e0b"
            title="Visit Website"
            onPress={() => Linking.openURL('https://ibnu-portfolio-ashen.vercel.app')}
          />
        </Card>

        {/* Credits */}
        <View style={styles.credits}>
          <ThemedText type="muted" style={styles.creditsText}>
            Made with ❤️ by Ibnu Aji
          </ThemedText>
          <ThemedText type="small" style={styles.creditsText}>
            © 2024 Ibnu Portfolio. All rights reserved.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  themeLabel: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  credits: {
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  creditsText: {
    textAlign: 'center',
  },
})
