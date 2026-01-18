import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Card } from '@/components/Card'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useNotes } from '@/contexts/NotesContext'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeColor } from '@/hooks/useThemeColor'

const { width } = Dimensions.get('window')

interface ActivityItem {
  id: string
  type: 'favorite' | 'note' | 'login' | 'view'
  title: string
  description: string
  timestamp: string
  icon: string
  iconColor: string
}

export default function AnalyticsScreen() {
  const { favorites } = useFavorites()
  const { notes } = useNotes()
  const { user, isAuthenticated } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])

  const primaryColor = useThemeColor({}, 'tint')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')

  // Generate activity feed from favorites and notes
  useEffect(() => {
    const allActivities: ActivityItem[] = []

    // Add favorites as activities
    favorites.forEach((fav) => {
      allActivities.push({
        id: `fav-${fav.id}`,
        type: 'favorite',
        title: 'Added to Favorites',
        description: fav.title,
        timestamp: fav.addedAt,
        icon: 'heart',
        iconColor: '#ef4444',
      })
    })

    // Add notes as activities
    notes.forEach((note) => {
      allActivities.push({
        id: `note-${note.id}`,
        type: 'note',
        title: note.createdAt === note.updatedAt ? 'Created Note' : 'Updated Note',
        description: note.title,
        timestamp: note.updatedAt,
        icon: 'document-text',
        iconColor: '#3b82f6',
      })
    })

    // Sort by timestamp (newest first)
    allActivities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    setActivities(allActivities)
  }, [favorites, notes])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Calculate stats
  const totalFavorites = favorites.length
  const totalNotes = notes.length
  const pinnedNotes = notes.filter((n) => n.isPinned).length
  const thisWeekActivities = activities.filter((a) => {
    const diff = Date.now() - new Date(a.timestamp).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  }).length

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, ActivityItem[]>)

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="heart" size={28} color="#3b82f6" />
            <ThemedText style={styles.statNumber}>{totalFavorites}</ThemedText>
            <ThemedText style={styles.statLabel}>Favorites</ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="document-text" size={28} color="#10b981" />
            <ThemedText style={styles.statNumber}>{totalNotes}</ThemedText>
            <ThemedText style={styles.statLabel}>Notes</ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="pin" size={28} color="#f59e0b" />
            <ThemedText style={styles.statNumber}>{pinnedNotes}</ThemedText>
            <ThemedText style={styles.statLabel}>Pinned</ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#e9d5ff' }]}>
            <Ionicons name="flash" size={28} color="#8b5cf6" />
            <ThemedText style={styles.statNumber}>{thisWeekActivities}</ThemedText>
            <ThemedText style={styles.statLabel}>This Week</ThemedText>
          </Card>
        </View>

        {/* Weekly Activity Chart */}
        <Card style={styles.chartCard}>
          <ThemedText type="subtitle" style={styles.chartTitle}>
            Activity Overview
          </ThemedText>
          <View style={styles.chartContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              // Simulate activity data
              const height = Math.random() * 60 + 20
              return (
                <View key={day} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      { height, backgroundColor: primaryColor },
                    ]}
                  />
                  <ThemedText type="small" style={styles.chartLabel}>
                    {day}
                  </ThemedText>
                </View>
              )
            })}
          </View>
        </Card>

        {/* Activity Timeline */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>

        {activities.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="time-outline" size={48} color={mutedColor} />
            <ThemedText type="muted" style={styles.emptyText}>
              No activity yet. Start by adding favorites or creating notes!
            </ThemedText>
          </Card>
        ) : (
          Object.entries(groupedActivities).map(([date, items]) => (
            <View key={date} style={styles.dateGroup}>
              <ThemedText type="defaultSemiBold" style={styles.dateHeader}>
                {date}
              </ThemedText>
              <Card style={styles.activityCard}>
                {items.map((activity, index) => (
                  <View
                    key={activity.id}
                    style={[
                      styles.activityItem,
                      index !== items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: borderColor,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.activityIcon,
                        { backgroundColor: activity.iconColor + '20' },
                      ]}
                    >
                      <Ionicons
                        name={activity.icon as any}
                        size={18}
                        color={activity.iconColor}
                      />
                    </View>
                    <View style={styles.activityContent}>
                      <ThemedText type="defaultSemiBold">{activity.title}</ThemedText>
                      <ThemedText type="muted" numberOfLines={1}>
                        {activity.description}
                      </ThemedText>
                    </View>
                    <ThemedText type="small" style={{ color: mutedColor }}>
                      {formatDate(activity.timestamp)}
                    </ThemedText>
                  </View>
                ))}
              </Card>
            </View>
          ))
        )}

        {/* Account Info */}
        {isAuthenticated && user && (
          <Card style={styles.accountCard}>
            <ThemedText type="subtitle" style={styles.accountTitle}>
              Account
            </ThemedText>
            <View style={styles.accountInfo}>
              <View style={[styles.avatar, { backgroundColor: primaryColor + '20' }]}>
                <ThemedText style={[styles.avatarText, { color: primaryColor }]}>
                  {(user.email || 'U').charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.accountDetails}>
                <ThemedText type="defaultSemiBold">
                  {user.user_metadata?.full_name || 'User'}
                </ThemedText>
                <ThemedText type="muted">{user.email}</ThemedText>
                <ThemedText type="small" style={{ marginTop: 4 }}>
                  Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                </ThemedText>
              </View>
            </View>
          </Card>
        )}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 44) / 2,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  chartCard: {
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    color: '#9ca3af',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    marginBottom: 8,
    marginLeft: 4,
  },
  activityCard: {
    padding: 0,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  accountCard: {
    padding: 16,
    marginTop: 8,
  },
  accountTitle: {
    marginBottom: 16,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
  },
  accountDetails: {
    marginLeft: 16,
    flex: 1,
  },
})
