'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, Trash2, Edit2, Check, X, Shuffle,
  ChevronLeft, ChevronRight, RotateCw, Eye, EyeOff, Layers
} from 'lucide-react'

interface Flashcard {
  id: string
  front: string
  back: string
  deck: string
}

interface Deck {
  id: string
  name: string
  color: string
}

const DEFAULT_DECKS: Deck[] = [
  { id: 'default', name: 'General', color: '#3b82f6' }
]

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
]

export function FlashcardsApp() {
  const [decks, setDecks] = useState<Deck[]>(DEFAULT_DECKS)
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentDeck, setCurrentDeck] = useState<string>('default')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  // Form states
  const [showCardForm, setShowCardForm] = useState(false)
  const [showDeckForm, setShowDeckForm] = useState(false)
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [deckName, setDeckName] = useState('')
  const [deckColor, setDeckColor] = useState(COLORS[0])

  useEffect(() => {
    const savedDecks = localStorage.getItem('flashcardDecks')
    const savedCards = localStorage.getItem('flashcardCards')
    if (savedDecks) setDecks(JSON.parse(savedDecks))
    if (savedCards) setCards(JSON.parse(savedCards))
  }, [])

  const saveDecks = (updated: Deck[]) => {
    setDecks(updated)
    localStorage.setItem('flashcardDecks', JSON.stringify(updated))
  }

  const saveCards = (updated: Flashcard[]) => {
    setCards(updated)
    localStorage.setItem('flashcardCards', JSON.stringify(updated))
  }

  const currentCards = cards.filter(c => c.deck === currentDeck)
  const currentCard = currentCards[currentIndex]
  const currentDeckData = decks.find(d => d.id === currentDeck)

  const addCard = () => {
    if (!front.trim() || !back.trim()) return

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
      deck: currentDeck
    }

    saveCards([...cards, newCard])
    setFront('')
    setBack('')
    setShowCardForm(false)
  }

  const updateCard = () => {
    if (!editingCard || !front.trim() || !back.trim()) return

    const updated = cards.map(c =>
      c.id === editingCard.id
        ? { ...c, front: front.trim(), back: back.trim() }
        : c
    )

    saveCards(updated)
    setEditingCard(null)
    setFront('')
    setBack('')
    setShowCardForm(false)
  }

  const deleteCard = (id: string) => {
    saveCards(cards.filter(c => c.id !== id))
    if (currentIndex >= currentCards.length - 1) {
      setCurrentIndex(Math.max(0, currentCards.length - 2))
    }
  }

  const addDeck = () => {
    if (!deckName.trim()) return

    const newDeck: Deck = {
      id: Date.now().toString(),
      name: deckName.trim(),
      color: deckColor
    }

    saveDecks([...decks, newDeck])
    setDeckName('')
    setShowDeckForm(false)
  }

  const deleteDeck = (id: string) => {
    if (id === 'default') return
    saveDecks(decks.filter(d => d.id !== id))
    saveCards(cards.filter(c => c.deck !== id))
    if (currentDeck === id) setCurrentDeck('default')
  }

  const shuffleCards = () => {
    const shuffled = [...currentCards].sort(() => Math.random() - 0.5)
    const otherCards = cards.filter(c => c.deck !== currentDeck)
    saveCards([...otherCards, ...shuffled])
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const navigateCard = (direction: 'prev' | 'next') => {
    setIsFlipped(false)
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : currentCards.length - 1))
    } else {
      setCurrentIndex(prev => (prev < currentCards.length - 1 ? prev + 1 : 0))
    }
  }

  const startEditing = (card: Flashcard) => {
    setEditingCard(card)
    setFront(card.front)
    setBack(card.back)
    setShowCardForm(true)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Learning
        </div>
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <p className="text-muted-foreground mt-2">
          Create and study flashcards to boost your learning.
        </p>
      </div>

      {/* Deck Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {decks.map(deck => (
          <button
            key={deck.id}
            onClick={() => {
              setCurrentDeck(deck.id)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center gap-2 ${
              currentDeck === deck.id
                ? 'text-white shadow-lg'
                : 'bg-muted hover:bg-muted/80'
            }`}
            style={{
              backgroundColor: currentDeck === deck.id ? deck.color : undefined
            }}
          >
            <Layers className="w-4 h-4" />
            {deck.name}
            <span className="text-xs opacity-70">
              ({cards.filter(c => c.deck === deck.id).length})
            </span>
          </button>
        ))}
        <button
          onClick={() => setShowDeckForm(true)}
          className="px-4 py-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Study Mode */}
      {currentCards.length > 0 ? (
        <div className="mb-6">
          {/* Card Display */}
          <div
            className="relative perspective-1000 cursor-pointer mb-4"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="relative w-full min-h-[250px] rounded-2xl shadow-lg p-8 flex items-center justify-center text-center"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{
                backgroundColor: currentDeckData?.color || '#3b82f6',
                transformStyle: 'preserve-3d'
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center p-8"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-white text-2xl font-medium">{currentCard?.front}</p>
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center p-8"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <p className="text-white text-2xl font-medium">{currentCard?.back}</p>
              </div>
            </motion.div>

            {/* Card Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentCard) startEditing(currentCard)
                }}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentCard) deleteCard(currentCard.id)
                }}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {currentCards.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={shuffleCards}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigateCard('prev')}
              className="p-3 rounded-full bg-muted hover:bg-muted/80"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              {isFlipped ? 'Show Question' : 'Reveal Answer'}
            </button>
            <button
              onClick={() => navigateCard('next')}
              className="p-3 rounded-full bg-muted hover:bg-muted/80"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground mb-6">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No cards in this deck. Add your first card!</p>
        </div>
      )}

      {/* Add Card Button */}
      <button
        onClick={() => {
          setEditingCard(null)
          setFront('')
          setBack('')
          setShowCardForm(true)
        }}
        className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add New Card
      </button>

      {/* Add Card Form Modal */}
      <AnimatePresence>
        {showCardForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCardForm(false)
              setEditingCard(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md p-6 rounded-2xl bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Front (Question)</label>
                  <textarea
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter question or term..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Back (Answer)</label>
                  <textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter answer or definition..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={editingCard ? updateCard : addCard}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    {editingCard ? 'Update' : 'Add Card'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCardForm(false)
                      setEditingCard(null)
                    }}
                    className="px-4 py-2 bg-muted rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Deck Form Modal */}
      <AnimatePresence>
        {showDeckForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeckForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md p-6 rounded-2xl bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Create New Deck</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Deck Name</label>
                  <input
                    type="text"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="e.g., Spanish Vocabulary"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setDeckColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          deckColor === color ? 'scale-125 ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addDeck}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Create Deck
                  </button>
                  <button
                    onClick={() => setShowDeckForm(false)}
                    className="px-4 py-2 bg-muted rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
