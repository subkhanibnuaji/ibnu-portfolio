import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useLocalSearchParams, router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useNotes, NOTE_COLORS } from '@/contexts/NotesContext'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getNote, updateNote, deleteNote, togglePin } = useNotes()
  const note = getNote(id)

  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [color, setColor] = useState(note?.color || NOTE_COLORS[0])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')

  useEffect(() => {
    if (note) {
      const changed =
        title !== note.title ||
        content !== note.content ||
        color !== note.color
      setHasChanges(changed)
    }
  }, [title, content, color, note])

  if (!note) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons name="document-text-outline" size={64} color={mutedColor} />
          <ThemedText type="title" style={{ marginTop: 16 }}>
            Note Not Found
          </ThemedText>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: primaryColor }]}
            onPress={() => router.back()}
          >
            <ThemedText style={{ color: '#fff' }}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    )
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }

    await updateNote(note.id, {
      title: title.trim(),
      content: content.trim(),
      color,
    })

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setHasChanges(false)
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(note.id)
            router.back()
          },
        },
      ]
    )
  }

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Do you want to save your changes?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: async () => {
              await handleSave()
              router.back()
            },
          },
        ]
      )
    } else {
      router.back()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => togglePin(note.id)}
                style={styles.headerButton}
              >
                <Ionicons
                  name={note.isPinned ? 'pin' : 'pin-outline'}
                  size={22}
                  color={note.isPinned ? primaryColor : textColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowColorPicker(!showColorPicker)}
                style={styles.headerButton}
              >
                <View style={[styles.colorDot, { backgroundColor: color }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>
              {hasChanges && (
                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.saveButton, { backgroundColor: primaryColor }]}
                >
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ),
          headerStyle: { backgroundColor },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.container}>
          {/* Color Picker */}
          {showColorPicker && (
            <View style={[styles.colorPicker, { backgroundColor, borderColor }]}>
              {NOTE_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.colorSelected,
                  ]}
                  onPress={() => {
                    setColor(c)
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    setShowColorPicker(false)
                  }}
                >
                  {color === c && (
                    <Ionicons name="checkmark" size={18} color="#374151" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Note Content */}
            <View style={[styles.noteContainer, { backgroundColor: color }]}>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="#9ca3af"
                multiline
              />

              <TextInput
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                placeholder="Start typing..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Metadata */}
            <View style={styles.metadata}>
              {note.projectTitle && (
                <View style={styles.metaRow}>
                  <Ionicons name="folder-outline" size={16} color={mutedColor} />
                  <ThemedText type="muted" style={{ marginLeft: 8 }}>
                    {note.projectTitle}
                  </ThemedText>
                </View>
              )}

              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={16} color={mutedColor} />
                <ThemedText type="muted" style={{ marginLeft: 8 }}>
                  Created: {formatDate(note.createdAt)}
                </ThemedText>
              </View>

              {note.createdAt !== note.updatedAt && (
                <View style={styles.metaRow}>
                  <Ionicons name="create-outline" size={16} color={mutedColor} />
                  <ThemedText type="muted" style={{ marginLeft: 8 }}>
                    Updated: {formatDate(note.updatedAt)}
                  </ThemedText>
                </View>
              )}

              <View style={styles.metaRow}>
                <Ionicons name="text-outline" size={16} color={mutedColor} />
                <ThemedText type="muted" style={{ marginLeft: 8 }}>
                  {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#00000020',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#374151',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  noteContainer: {
    borderRadius: 16,
    padding: 20,
    minHeight: 300,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 36,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    minHeight: 200,
  },
  metadata: {
    marginTop: 24,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
})
