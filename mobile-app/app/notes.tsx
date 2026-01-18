import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Button } from '@/components/Button'
import { useNotes, Note, NOTE_COLORS } from '@/contexts/NotesContext'
import { useThemeColor } from '@/hooks/useThemeColor'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

export default function NotesScreen() {
  const {
    notes,
    pinnedNotes,
    unpinnedNotes,
    addNote,
    deleteNote,
    togglePin,
    searchNotes,
    isLoading,
  } = useNotes()

  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: NOTE_COLORS[0],
    isPinned: false,
  })

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')
  const backgroundColor = useThemeColor({}, 'background')

  const filteredNotes = searchQuery
    ? searchNotes(searchQuery)
    : [...pinnedNotes, ...unpinnedNotes]

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note')
      return
    }

    await addNote({
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      color: newNote.color,
      isPinned: newNote.isPinned,
    })

    setShowNewNoteModal(false)
    setNewNote({
      title: '',
      content: '',
      color: NOTE_COLORS[0],
      isPinned: false,
    })
  }

  const handleDeleteNote = (note: Note) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${note.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNote(note.id),
        },
      ]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const renderNoteCard = ({ item, index }: { item: Note; index: number }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        { backgroundColor: item.color },
        index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 },
      ]}
      onPress={() => router.push(`/note/${item.id}`)}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        handleDeleteNote(item)
      }}
      activeOpacity={0.8}
    >
      <View style={styles.noteHeader}>
        {item.isPinned && (
          <Ionicons name="pin" size={14} color="#6b7280" />
        )}
        <TouchableOpacity
          onPress={() => togglePin(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.pinButton}
        >
          <Ionicons
            name={item.isPinned ? 'pin' : 'pin-outline'}
            size={16}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.noteTitle} numberOfLines={2}>
        {item.title}
      </ThemedText>

      {item.content && (
        <ThemedText style={styles.noteContent} numberOfLines={4}>
          {item.content}
        </ThemedText>
      )}

      {item.projectTitle && (
        <View style={styles.projectBadge}>
          <Ionicons name="folder-outline" size={12} color="#6b7280" />
          <ThemedText style={styles.projectText} numberOfLines={1}>
            {item.projectTitle}
          </ThemedText>
        </View>
      )}

      <ThemedText style={styles.noteDate}>
        {formatDate(item.updatedAt)}
      </ThemedText>
    </TouchableOpacity>
  )

  if (notes.length === 0 && !showNewNoteModal) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: '#dbeafe20' }]}>
            <Ionicons name="document-text-outline" size={64} color="#3b82f6" />
          </View>
          <ThemedText type="title" style={styles.emptyTitle}>
            No Notes Yet
          </ThemedText>
          <ThemedText type="muted" style={styles.emptyText}>
            Create notes to remember important information{'\n'}
            about projects or anything else.
          </ThemedText>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: primaryColor }]}
            onPress={() => setShowNewNoteModal(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <ThemedText style={styles.createButtonText}>Create Note</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { backgroundColor: cardColor, borderColor }]}>
          <Ionicons name="search" size={20} color={mutedColor} />
          <TextInput
            style={[styles.searchText, { color: textColor }]}
            placeholder="Search notes..."
            placeholderTextColor={mutedColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={mutedColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <ThemedText type="muted">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
          {pinnedNotes.length > 0 && ` • ${pinnedNotes.length} pinned`}
        </ThemedText>
      </View>

      {/* Notes Grid */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderNoteCard}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color={mutedColor} />
            <ThemedText type="muted" style={{ marginTop: 12 }}>
              No notes found for "{searchQuery}"
            </ThemedText>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor }]}
        onPress={() => setShowNewNoteModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* New Note Modal */}
      <Modal
        visible={showNewNoteModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewNoteModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewNoteModal(false)}>
              <ThemedText type="link">Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle">New Note</ThemedText>
            <TouchableOpacity onPress={handleCreateNote}>
              <ThemedText type="link" style={{ fontWeight: '600' }}>Save</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Color Picker */}
          <View style={styles.colorPicker}>
            {NOTE_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  newNote.color === color && styles.colorSelected,
                ]}
                onPress={() => {
                  setNewNote((prev) => ({ ...prev, color }))
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
              >
                {newNote.color === color && (
                  <Ionicons name="checkmark" size={16} color="#374151" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Note Content */}
          <View style={[styles.noteInputContainer, { backgroundColor: newNote.color }]}>
            <TextInput
              style={styles.noteTitleInput}
              placeholder="Title"
              placeholderTextColor="#9ca3af"
              value={newNote.title}
              onChangeText={(text) => setNewNote((prev) => ({ ...prev, title: text }))}
              autoFocus
            />
            <TextInput
              style={styles.noteContentInput}
              placeholder="Start typing..."
              placeholderTextColor="#9ca3af"
              value={newNote.content}
              onChangeText={(text) => setNewNote((prev) => ({ ...prev, content: text }))}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Pin Toggle */}
          <TouchableOpacity
            style={[styles.pinToggle, { backgroundColor: cardColor, borderColor }]}
            onPress={() => {
              setNewNote((prev) => ({ ...prev, isPinned: !prev.isPinned }))
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }}
          >
            <Ionicons
              name={newNote.isPinned ? 'pin' : 'pin-outline'}
              size={20}
              color={newNote.isPinned ? primaryColor : mutedColor}
            />
            <ThemedText style={{ marginLeft: 8 }}>
              {newNote.isPinned ? 'Pinned' : 'Pin this note'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
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
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  statsRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  noteCard: {
    width: CARD_WIDTH,
    minHeight: 150,
    padding: 16,
    borderRadius: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  pinButton: {
    padding: 4,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    flex: 1,
  },
  projectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  projectText: {
    fontSize: 12,
    color: '#6b7280',
  },
  noteDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingTop: 48,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: '#374151',
  },
  noteInputContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  noteTitleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  noteContentInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  pinToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
})
