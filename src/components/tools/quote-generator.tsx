'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, RefreshCw, Copy, Check, Share2, Heart, Twitter, Facebook } from 'lucide-react'

interface QuoteData {
  text: string
  author: string
  category: string
}

const QUOTES: QuoteData[] = [
  // Inspirational
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Inspirational" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Inspirational" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Inspirational" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Inspirational" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Inspirational" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Inspirational" },

  // Technology
  { text: "Technology is best when it brings people together.", author: "Matt Mullenweg", category: "Technology" },
  { text: "The advance of technology is based on making it fit in so that you don't really even notice it.", author: "Bill Gates", category: "Technology" },
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke", category: "Technology" },
  { text: "The Web as I envisaged it, we have not seen it yet.", author: "Tim Berners-Lee", category: "Technology" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Technology" },

  // Programming
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "Programming" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs", category: "Programming" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Programming" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: "Programming" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "Programming" },

  // Success
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Success" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Success" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "Success" },

  // Wisdom
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Wisdom" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Wisdom" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Wisdom" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "Wisdom" }
]

const CATEGORIES = ['All', 'Inspirational', 'Technology', 'Programming', 'Success', 'Wisdom']

const BACKGROUNDS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
]

export function QuoteGenerator() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [category, setCategory] = useState('All')
  const [bgIndex, setBgIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likedQuotes, setLikedQuotes] = useState<QuoteData[]>([])

  const getRandomQuote = () => {
    const filtered = category === 'All'
      ? QUOTES
      : QUOTES.filter(q => q.category === category)

    const randomIndex = Math.floor(Math.random() * filtered.length)
    setQuote(filtered[randomIndex])
    setBgIndex(Math.floor(Math.random() * BACKGROUNDS.length))
    setLiked(false)
  }

  useEffect(() => {
    getRandomQuote()
    // Load liked quotes from localStorage
    const saved = localStorage.getItem('likedQuotes')
    if (saved) setLikedQuotes(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (quote) {
      const isLiked = likedQuotes.some(q => q.text === quote.text)
      setLiked(isLiked)
    }
  }, [quote, likedQuotes])

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    // Get new quote from this category
    const filtered = newCategory === 'All'
      ? QUOTES
      : QUOTES.filter(q => q.category === newCategory)
    const randomIndex = Math.floor(Math.random() * filtered.length)
    setQuote(filtered[randomIndex])
    setBgIndex(Math.floor(Math.random() * BACKGROUNDS.length))
    setLiked(false)
  }

  const copyQuote = async () => {
    if (!quote) return
    await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleLike = () => {
    if (!quote) return

    let updated: QuoteData[]
    if (liked) {
      updated = likedQuotes.filter(q => q.text !== quote.text)
    } else {
      updated = [...likedQuotes, quote]
    }

    setLikedQuotes(updated)
    localStorage.setItem('likedQuotes', JSON.stringify(updated))
    setLiked(!liked)
  }

  const shareTwitter = () => {
    if (!quote) return
    const text = encodeURIComponent(`"${quote.text}" - ${quote.author}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-4">
          <Quote className="w-4 h-4" />
          Daily Inspiration
        </div>
        <h2 className="text-2xl font-bold">Quote Generator</h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quote Card */}
      <AnimatePresence mode="wait">
        {quote && (
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-8 rounded-2xl bg-gradient-to-br ${BACKGROUNDS[bgIndex]} text-white shadow-2xl`}
          >
            <Quote className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-6">
              "{quote.text}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">— {quote.author}</p>
                <span className="text-sm opacity-75">{quote.category}</span>
              </div>
              <button
                onClick={toggleLike}
                className={`p-2 rounded-full transition-colors ${
                  liked ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={getRandomQuote}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Quote
        </motion.button>

        <button
          onClick={copyQuote}
          className="p-3 rounded-xl border border-border hover:bg-muted transition-colors"
          title="Copy quote"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        </button>

        <button
          onClick={shareTwitter}
          className="p-3 rounded-xl border border-border hover:bg-muted transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 rounded-xl border border-border bg-card text-center">
        <div className="flex justify-center gap-8">
          <div>
            <p className="text-2xl font-bold">{QUOTES.length}</p>
            <p className="text-sm text-muted-foreground">Total Quotes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{likedQuotes.length}</p>
            <p className="text-sm text-muted-foreground">Liked</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{CATEGORIES.length - 1}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
        </div>
      </div>
    </div>
  )
}
