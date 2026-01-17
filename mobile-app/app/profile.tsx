import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function ProfileScreen() {
  const { user, profile, isAuthenticated, updateProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || user?.user_metadata?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    github_url: profile?.github_url || '',
    linkedin_url: profile?.linkedin_url || '',
    twitter_url: profile?.twitter_url || '',
    phone: profile?.phone || '',
  })

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-circle-outline" size={80} color={mutedColor} />
          <ThemedText type="title" style={styles.notLoggedInTitle}>
            Not Signed In
          </ThemedText>
          <ThemedText type="muted" style={styles.notLoggedInText}>
            Sign in to view and edit your profile
          </ThemedText>
          <Button onPress={() => router.push('/(auth)/login')} style={styles.signInButton}>
            Sign In
          </Button>
        </View>
      </ThemedView>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        Alert.alert('Error', 'Failed to update profile')
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setIsEditing(false)
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut()
            router.replace('/(tabs)')
          },
        },
      ]
    )
  }

  const renderField = (
    icon: string,
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon as any} size={18} color={mutedColor} />
        <ThemedText type="muted" style={styles.fieldLabel}>{label}</ThemedText>
      </View>
      {isEditing ? (
        <TextInput
          style={[
            styles.input,
            { color: textColor, backgroundColor: cardColor, borderColor },
          ]}
          value={formData[field]}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, [field]: text }))}
          placeholder={placeholder}
          placeholderTextColor={mutedColor}
          keyboardType={keyboardType}
          autoCapitalize={field === 'display_name' ? 'words' : 'none'}
          multiline={field === 'bio'}
          numberOfLines={field === 'bio' ? 4 : 1}
        />
      ) : (
        <ThemedText style={styles.fieldValue}>
          {formData[field] || 'Not set'}
        </ThemedText>
      )}
    </View>
  )

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: primaryColor + '20' }]}>
            <ThemedText style={[styles.avatarText, { color: primaryColor }]}>
              {(formData.display_name || user?.email || 'U').charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.name}>
            {formData.display_name || 'User'}
          </ThemedText>
          <ThemedText type="muted">{user?.email}</ThemedText>
          <View style={styles.memberSince}>
            <Ionicons name="calendar-outline" size={14} color={mutedColor} />
            <ThemedText type="small" style={{ marginLeft: 4 }}>
              Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#ef4444" />
            <ThemedText type="title" style={styles.statNumber}>0</ThemedText>
            <ThemedText type="muted">Favorites</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="document-text" size={24} color="#3b82f6" />
            <ThemedText type="title" style={styles.statNumber}>0</ThemedText>
            <ThemedText type="muted">Notes</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="eye" size={24} color="#10b981" />
            <ThemedText type="title" style={styles.statNumber}>0</ThemedText>
            <ThemedText type="muted">Views</ThemedText>
          </Card>
        </View>

        {/* Profile Info */}
        <Card style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Profile Information</ThemedText>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.editButton}
              >
                <Ionicons name="pencil" size={18} color={primaryColor} />
                <ThemedText type="link" style={{ marginLeft: 4 }}>Edit</ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={styles.editButton}
              >
                <Ionicons name="close" size={18} color="#ef4444" />
                <ThemedText style={{ marginLeft: 4, color: '#ef4444' }}>Cancel</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {renderField('person-outline', 'Display Name', 'display_name', 'Your name')}
          {renderField('document-text-outline', 'Bio', 'bio', 'Tell us about yourself')}
          {renderField('location-outline', 'Location', 'location', 'City, Country')}
          {renderField('call-outline', 'Phone', 'phone', '+62 xxx xxxx xxxx', 'phone-pad')}

          {isEditing && (
            <Button
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveButton}
            >
              {isSaving ? <ActivityIndicator color="#fff" /> : 'Save Changes'}
            </Button>
          )}
        </Card>

        {/* Social Links */}
        <Card style={styles.infoCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Social Links
          </ThemedText>

          {renderField('globe-outline', 'Website', 'website', 'https://yourwebsite.com', 'url')}
          {renderField('logo-github', 'GitHub', 'github_url', 'https://github.com/username', 'url')}
          {renderField('logo-linkedin', 'LinkedIn', 'linkedin_url', 'https://linkedin.com/in/username', 'url')}
          {renderField('logo-twitter', 'Twitter', 'twitter_url', 'https://twitter.com/username', 'url')}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/favorites')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="heart" size={20} color="#f59e0b" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">My Favorites</ThemedText>
              <ThemedText type="muted">View your saved projects</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={mutedColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/notes')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="document-text" size={20} color="#3b82f6" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">My Notes</ThemedText>
              <ThemedText type="muted">View and manage your notes</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={mutedColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/analytics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="analytics" size={20} color="#10b981" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">Activity History</ThemedText>
              <ThemedText type="muted">View your app activity</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={mutedColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="settings" size={20} color="#8b5cf6" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText type="defaultSemiBold">Settings</ThemedText>
              <ThemedText type="muted">App preferences and account</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={mutedColor} />
          </TouchableOpacity>
        </Card>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: '#ef4444' }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <ThemedText style={{ color: '#ef4444', marginLeft: 8, fontWeight: '600' }}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    marginBottom: 4,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    marginVertical: 4,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    marginLeft: 8,
  },
  fieldValue: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  actionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notLoggedInTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notLoggedInText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    width: '100%',
  },
})
