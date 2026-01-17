import React from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function FavoritesScreen() {
  const { favorites, removeFavorite, clearAllFavorites, isLoading } = useFavorites()

  const primaryColor = useThemeColor({}, 'tint')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const borderColor = useThemeColor({}, 'border')

  const handleRemove = (projectId: string, title: string) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${title}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(projectId),
        },
      ]
    )
  }

  const handleClearAll = () => {
    if (favorites.length === 0) return

    Alert.alert(
      'Clear All Favorites',
      `Are you sure you want to remove all ${favorites.length} favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAllFavorites,
        },
      ]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (favorites.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: '#fef3c720' }]}>
            <Ionicons name="heart-outline" size={64} color="#f59e0b" />
          </View>
          <ThemedText type="title" style={styles.emptyTitle}>
            No Favorites Yet
          </ThemedText>
          <ThemedText type="muted" style={styles.emptyText}>
            Save your favorite projects to access them quickly.{'\n'}
            Tap the heart icon on any project to add it here.
          </ThemedText>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: primaryColor }]}
            onPress={() => router.push('/(tabs)/projects')}
          >
            <Ionicons name="folder-open" size={20} color="#fff" />
            <ThemedText style={styles.browseButtonText}>Browse Projects</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">
            {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
          </ThemedText>
          <ThemedText type="muted">
            Your saved projects
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.clearButton, { borderColor: '#ef4444' }]}
          onPress={handleClearAll}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <ThemedText style={styles.clearButtonText}>Clear All</ThemedText>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            style={styles.favoriteCard}
            onPress={() => router.push(`/project/${item.projectId}`)}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Badge variant="default">{item.category}</Badge>
                <TouchableOpacity
                  onPress={() => handleRemove(item.projectId, item.title)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="heart" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <ThemedText type="subtitle" style={styles.cardTitle}>
                {item.title}
              </ThemedText>

              <ThemedText type="muted" numberOfLines={2} style={styles.cardDescription}>
                {item.description}
              </ThemedText>

              <View style={styles.cardFooter}>
                <View style={styles.dateContainer}>
                  <Ionicons name="time-outline" size={14} color={mutedColor} />
                  <ThemedText type="small" style={{ marginLeft: 4 }}>
                    Added {formatDate(item.addedAt)}
                  </ThemedText>
                </View>
                <View style={styles.viewContainer}>
                  <ThemedText type="link">View Project</ThemedText>
                  <Ionicons name="arrow-forward" size={14} color={primaryColor} />
                </View>
              </View>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  favoriteCard: {
    padding: 16,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    marginTop: 4,
  },
  cardDescription: {
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})
