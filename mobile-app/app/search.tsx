import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useProjects } from '@/hooks/useApi'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useNotes } from '@/contexts/NotesContext'
import { useThemeColor } from '@/hooks/useThemeColor'

type SearchCategory = 'all' | 'projects' | 'notes' | 'favorites'

interface SearchResult {
  id: string
  type: 'project' | 'note' | 'favorite'
  title: string
  subtitle: string
  category?: string
  icon: string
  iconColor: string
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [results, setResults] = useState<SearchResult[]>([])

  const { data: projectsData } = useProjects({})
  const { favorites } = useFavorites()
  const { searchNotes } = useNotes()

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')

  const projects = projectsData?.data || []

  const performSearch = useCallback(
    (searchQuery: string, searchCategory: SearchCategory) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      const lowerQuery = searchQuery.toLowerCase()
      const newResults: SearchResult[] = []

      // Search projects
      if (searchCategory === 'all' || searchCategory === 'projects') {
        projects.forEach((project: any) => {
          if (
            project.title?.toLowerCase().includes(lowerQuery) ||
            project.description?.toLowerCase().includes(lowerQuery) ||
            project.category?.toLowerCase().includes(lowerQuery)
          ) {
            newResults.push({
              id: `project-${project.id}`,
              type: 'project',
              title: project.title,
              subtitle: project.description?.slice(0, 100) + '...',
              category: project.category,
              icon: 'folder',
              iconColor: '#3b82f6',
            })
          }
        })
      }

      // Search favorites
      if (searchCategory === 'all' || searchCategory === 'favorites') {
        favorites.forEach((fav) => {
          if (
            fav.title.toLowerCase().includes(lowerQuery) ||
            fav.description.toLowerCase().includes(lowerQuery)
          ) {
            newResults.push({
              id: `favorite-${fav.id}`,
              type: 'favorite',
              title: fav.title,
              subtitle: fav.description?.slice(0, 100) + '...',
              category: fav.category,
              icon: 'heart',
              iconColor: '#ef4444',
            })
          }
        })
      }

      // Search notes
      if (searchCategory === 'all' || searchCategory === 'notes') {
        const matchingNotes = searchNotes(lowerQuery)
        matchingNotes.forEach((note) => {
          newResults.push({
            id: `note-${note.id}`,
            type: 'note',
            title: note.title,
            subtitle: note.content?.slice(0, 100) + '...',
            icon: 'document-text',
            iconColor: '#8b5cf6',
          })
        })
      }

      setResults(newResults)
    },
    [projects, favorites, searchNotes]
  )

  useEffect(() => {
    performSearch(query, category)
  }, [query, category, performSearch])

  const handleResultPress = (result: SearchResult) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Save to recent searches
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
    }

    switch (result.type) {
      case 'project':
        router.push(`/project/${result.id.replace('project-', '')}`)
        break
      case 'note':
        router.push(`/note/${result.id.replace('note-', '')}`)
        break
      case 'favorite':
        router.push(`/project/${result.id.replace('favorite-', '')}`)
        break
    }
  }

  const categories: { key: SearchCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'projects', label: 'Projects', icon: 'folder' },
    { key: 'notes', label: 'Notes', icon: 'document-text' },
    { key: 'favorites', label: 'Favorites', icon: 'heart' },
  ]

  return (
    <ThemedView style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { backgroundColor: cardColor, borderColor }]}>
          <Ionicons name="search" size={20} color={mutedColor} />
          <TextInput
            style={[styles.searchText, { color: textColor }]}
            placeholder="Search projects, notes, favorites..."
            placeholderTextColor={mutedColor}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={mutedColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryButton,
              { borderColor: category === cat.key ? primaryColor : borderColor },
              category === cat.key && { backgroundColor: primaryColor + '15' },
            ]}
            onPress={() => {
              setCategory(cat.key)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={category === cat.key ? primaryColor : mutedColor}
            />
            <ThemedText
              style={[
                styles.categoryLabel,
                category === cat.key && { color: primaryColor, fontWeight: '600' },
              ]}
            >
              {cat.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      {query.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { backgroundColor: cardColor }]}
              onPress={() => handleResultPress(item)}
            >
              <View style={[styles.resultIcon, { backgroundColor: item.iconColor + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
              </View>
              <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  {item.category && (
                    <Badge variant="default" style={styles.resultBadge}>
                      {item.category}
                    </Badge>
                  )}
                </View>
                <ThemedText type="muted" numberOfLines={2} style={styles.resultSubtitle}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={mutedColor} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Ionicons name="search-outline" size={48} color={mutedColor} />
              <ThemedText type="muted" style={{ marginTop: 12 }}>
                No results found for "{query}"
              </ThemedText>
            </View>
          }
          ListHeaderComponent={
            results.length > 0 ? (
              <ThemedText type="muted" style={styles.resultCount}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </ThemedText>
            ) : null
          }
        />
      ) : (
        <View style={styles.suggestionsContainer}>
          {recentSearches.length > 0 && (
            <>
              <View style={styles.suggestionsHeader}>
                <ThemedText type="subtitle">Recent Searches</ThemedText>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <ThemedText type="link">Clear</ThemedText>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => setQuery(search)}
                >
                  <Ionicons name="time-outline" size={20} color={mutedColor} />
                  <ThemedText style={{ marginLeft: 12 }}>{search}</ThemedText>
                </TouchableOpacity>
              ))}
            </>
          )}

          <ThemedText type="subtitle" style={styles.trendingTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: '#dbeafe' }]}
              onPress={() => router.push('/(tabs)/projects')}
            >
              <Ionicons name="folder" size={24} color="#3b82f6" />
              <ThemedText style={styles.quickActionText}>Browse Projects</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: '#dcfce7' }]}
              onPress={() => router.push('/notes')}
            >
              <Ionicons name="document-text" size={24} color="#10b981" />
              <ThemedText style={styles.quickActionText}>My Notes</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: '#fef3c7' }]}
              onPress={() => router.push('/favorites')}
            >
              <Ionicons name="heart" size={24} color="#f59e0b" />
              <ThemedText style={styles.quickActionText}>Favorites</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  resultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  resultSubtitle: {
    lineHeight: 18,
  },
  resultCount: {
    marginBottom: 12,
  },
  emptyResults: {
    alignItems: 'center',
    paddingTop: 48,
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  trendingTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  quickActions: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
})
