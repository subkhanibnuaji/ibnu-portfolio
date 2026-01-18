'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Hash, Copy, Check, Sparkles, TrendingUp, RefreshCw, Instagram, Twitter } from 'lucide-react'

interface HashtagCategory {
  name: string
  hashtags: string[]
}

const hashtagDatabase: Record<string, HashtagCategory> = {
  photography: {
    name: 'Photography',
    hashtags: ['photography', 'photooftheday', 'photo', 'picoftheday', 'photographer', 'photoshoot', 'portrait', 'naturephotography', 'streetphotography', 'landscapephotography', 'travelphotography', 'portraitphotography', 'photographylovers', 'photographyislife', 'canonphotography', 'nikonphotography', 'sonyalpha', 'raw_community', 'visualsoflife', 'agameoftones']
  },
  travel: {
    name: 'Travel',
    hashtags: ['travel', 'travelgram', 'traveling', 'travelphotography', 'instatravel', 'wanderlust', 'traveltheworld', 'travelblogger', 'adventure', 'explore', 'vacation', 'holiday', 'trip', 'tourism', 'traveler', 'traveladdict', 'beautifuldestinations', 'passportready', 'globetrotter', 'worldtraveler']
  },
  food: {
    name: 'Food',
    hashtags: ['food', 'foodie', 'foodporn', 'instafood', 'yummy', 'delicious', 'foodphotography', 'foodstagram', 'foodblogger', 'healthyfood', 'homemade', 'cooking', 'foodlover', 'dinner', 'lunch', 'breakfast', 'recipe', 'chef', 'restaurant', 'tasty']
  },
  fitness: {
    name: 'Fitness',
    hashtags: ['fitness', 'gym', 'workout', 'fit', 'fitnessmotivation', 'bodybuilding', 'training', 'health', 'motivation', 'healthy', 'lifestyle', 'fitfam', 'muscle', 'exercise', 'personaltrainer', 'crossfit', 'yoga', 'cardio', 'strength', 'gains']
  },
  fashion: {
    name: 'Fashion',
    hashtags: ['fashion', 'style', 'ootd', 'fashionblogger', 'fashionista', 'streetstyle', 'outfit', 'fashionstyle', 'model', 'beauty', 'shopping', 'dress', 'stylish', 'trendy', 'instafashion', 'fashionable', 'lookbook', 'fashionphotography', 'streetwear', 'outfitoftheday']
  },
  tech: {
    name: 'Technology',
    hashtags: ['tech', 'technology', 'programming', 'coding', 'developer', 'software', 'webdeveloper', 'javascript', 'python', 'ai', 'machinelearning', 'startup', 'innovation', 'gadgets', 'apple', 'android', 'webdesign', 'ux', 'ui', 'devlife']
  },
  business: {
    name: 'Business',
    hashtags: ['business', 'entrepreneur', 'success', 'marketing', 'motivation', 'money', 'startup', 'entrepreneurship', 'smallbusiness', 'businessowner', 'ceo', 'leadership', 'investment', 'hustle', 'digitalmarketing', 'branding', 'finance', 'wealth', 'goals', 'mindset']
  },
  art: {
    name: 'Art',
    hashtags: ['art', 'artist', 'artwork', 'drawing', 'painting', 'illustration', 'creative', 'design', 'sketch', 'artistsoninstagram', 'digitalart', 'instaart', 'contemporaryart', 'artoftheday', 'fineart', 'abstract', 'watercolor', 'gallery', 'arte', 'artistsofinstagram']
  },
  music: {
    name: 'Music',
    hashtags: ['music', 'musician', 'singer', 'song', 'guitar', 'hiphop', 'rap', 'dj', 'producer', 'band', 'newmusic', 'livemusic', 'musicproducer', 'songwriter', 'cover', 'vocals', 'beats', 'piano', 'concert', 'musicvideo']
  },
  nature: {
    name: 'Nature',
    hashtags: ['nature', 'naturephotography', 'landscape', 'sunset', 'mountains', 'ocean', 'beach', 'sky', 'flowers', 'wildlife', 'forest', 'outdoors', 'hiking', 'earthpix', 'naturelover', 'clouds', 'sunrise', 'lake', 'trees', 'animals']
  }
}

export function HashtagGenerator() {
  const [topic, setTopic] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [hashtagCount, setHashtagCount] = useState(15)
  const [includePopular, setIncludePopular] = useState(true)

  const popularHashtags = ['love', 'instagood', 'fashion', 'photooftheday', 'beautiful', 'art', 'photography', 'happy', 'picoftheday', 'cute', 'follow', 'tbt', 'followme', 'nature', 'like4like', 'travel', 'instagram', 'style', 'repost', 'summer']

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const generateHashtags = () => {
    let hashtags: string[] = []

    // Add hashtags from selected categories
    selectedCategories.forEach(categoryId => {
      const category = hashtagDatabase[categoryId]
      if (category) {
        hashtags = [...hashtags, ...category.hashtags]
      }
    })

    // Add custom topic-based hashtags
    if (topic) {
      const topicWords = topic.toLowerCase().split(' ').filter(w => w.length > 2)
      topicWords.forEach(word => {
        hashtags.push(word)
        hashtags.push(`${word}life`)
        hashtags.push(`${word}lover`)
        hashtags.push(`insta${word}`)
      })
    }

    // Add popular hashtags if selected
    if (includePopular) {
      const randomPopular = [...popularHashtags]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
      hashtags = [...hashtags, ...randomPopular]
    }

    // Remove duplicates and shuffle
    const uniqueHashtags = [...new Set(hashtags)]
      .sort(() => Math.random() - 0.5)
      .slice(0, hashtagCount)

    setGeneratedHashtags(uniqueHashtags)
  }

  const copyHashtags = () => {
    const text = generatedHashtags.map(h => `#${h}`).join(' ')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const removeHashtag = (hashtag: string) => {
    setGeneratedHashtags(prev => prev.filter(h => h !== hashtag))
  }

  const addCustomHashtag = (hashtag: string) => {
    const clean = hashtag.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    if (clean && !generatedHashtags.includes(clean)) {
      setGeneratedHashtags(prev => [...prev, clean])
    }
  }

  return (
    <div className="space-y-6">
      {/* Topic Input */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Topic / Keywords
        </h3>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topic (e.g., sunset photography, coffee lover)"
          className="w-full px-4 py-3 rounded-lg border border-border bg-background"
        />
      </div>

      {/* Category Selection */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Select Categories</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(hashtagDatabase).map(([id, category]) => (
            <button
              key={id}
              onClick={() => toggleCategory(id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategories.includes(id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Number of Hashtags:</label>
            <select
              value={hashtagCount}
              onChange={(e) => setHashtagCount(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30 (Max)</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includePopular}
              onChange={(e) => setIncludePopular(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include popular hashtags</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateHashtags}
        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
      >
        <Hash className="w-5 h-5" />
        Generate Hashtags
      </motion.button>

      {/* Results */}
      {generatedHashtags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <p className="text-2xl font-bold text-primary">{generatedHashtags.length}</p>
              <p className="text-sm text-muted-foreground">Hashtags</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <p className="text-2xl font-bold text-pink-500">{generatedHashtags.map(h => h.length + 1).reduce((a, b) => a + b, 0)}</p>
              <p className="text-sm text-muted-foreground">Characters</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <p className="text-2xl font-bold text-purple-500">{selectedCategories.length}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>

          {/* Hashtags Display */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Generated Hashtags</h3>
              <div className="flex gap-2">
                <button
                  onClick={generateHashtags}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={copyHashtags}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {generatedHashtags.map((hashtag, index) => (
                <motion.span
                  key={hashtag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-sm group"
                >
                  <span className="text-primary">#</span>
                  {hashtag}
                  <button
                    onClick={() => removeHashtag(hashtag)}
                    className="ml-1 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>

            {/* Copyable Text */}
            <div className="p-4 rounded-lg bg-muted font-mono text-sm break-all">
              {generatedHashtags.map(h => `#${h}`).join(' ')}
            </div>
          </div>

          {/* Platform Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span className="font-medium">Instagram</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Max 30 hashtags. Place in first comment for cleaner caption.
                Mix popular and niche hashtags for best reach.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Twitter/X</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Use 1-3 relevant hashtags. More hashtags can reduce engagement.
                Focus on trending and specific hashtags.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trending Section */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Popular Hashtags
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularHashtags.slice(0, 10).map(hashtag => (
            <button
              key={hashtag}
              onClick={() => addCustomHashtag(hashtag)}
              className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors"
            >
              #{hashtag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
