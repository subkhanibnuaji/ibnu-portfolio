'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, RefreshCw, Copy, Check, Sparkles, Heart, Search } from 'lucide-react'

const adjectives = [
  'Cool', 'Super', 'Epic', 'Mega', 'Ultra', 'Pro', 'Elite', 'Prime', 'Alpha', 'Omega',
  'Cyber', 'Neon', 'Dark', 'Light', 'Shadow', 'Storm', 'Fire', 'Ice', 'Thunder', 'Cosmic',
  'Swift', 'Silent', 'Mystic', 'Royal', 'Noble', 'Brave', 'Wild', 'Wise', 'Swift', 'Lucky',
  'Pixel', 'Digital', 'Quantum', 'Atomic', 'Stellar', 'Lunar', 'Solar', 'Astral', 'Zen', 'Nova'
]

const nouns = [
  'Wolf', 'Dragon', 'Phoenix', 'Tiger', 'Lion', 'Eagle', 'Hawk', 'Raven', 'Fox', 'Bear',
  'Ninja', 'Samurai', 'Knight', 'Wizard', 'Mage', 'Hunter', 'Warrior', 'Guardian', 'Legend', 'Hero',
  'Coder', 'Hacker', 'Gamer', 'Player', 'Master', 'Lord', 'King', 'Queen', 'Prince', 'Duke',
  'Byte', 'Pixel', 'Glitch', 'Node', 'Vector', 'Matrix', 'Cipher', 'Vortex', 'Pulse', 'Wave'
]

const suffixes = ['', 'X', 'Pro', 'HD', '2K', 'Max', 'Plus', 'One', 'Prime', 'Elite', 'Official', 'Real', 'The']

const styles = [
  { id: 'standard', name: 'Standard', example: 'CoolWolf' },
  { id: 'numbered', name: 'Numbered', example: 'CoolWolf123' },
  { id: 'underscored', name: 'Underscored', example: 'Cool_Wolf' },
  { id: 'dotted', name: 'Dotted', example: 'Cool.Wolf' },
  { id: 'leetspeak', name: 'Leetspeak', example: 'C00lW0lf' },
  { id: 'allcaps', name: 'ALL CAPS', example: 'COOLWOLF' },
  { id: 'lowercase', name: 'lowercase', example: 'coolwolf' }
]

export function UsernameGenerator() {
  const [baseWord, setBaseWord] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('standard')
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [maxLength, setMaxLength] = useState(15)
  const [generatedUsernames, setGeneratedUsernames] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null)

  const toLeetspeak = (str: string): string => {
    const leetMap: Record<string, string> = {
      'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1'
    }
    return str.split('').map(c => leetMap[c.toLowerCase()] || c).join('')
  }

  const formatUsername = (adj: string, noun: string, suffix: string, num: string): string => {
    let username = ''

    switch (selectedStyle) {
      case 'underscored':
        username = `${adj}_${noun}${suffix ? '_' + suffix : ''}${num}`
        break
      case 'dotted':
        username = `${adj}.${noun}${suffix ? '.' + suffix : ''}${num}`
        break
      case 'leetspeak':
        username = toLeetspeak(`${adj}${noun}${suffix}${num}`)
        break
      case 'allcaps':
        username = `${adj}${noun}${suffix}${num}`.toUpperCase()
        break
      case 'lowercase':
        username = `${adj}${noun}${suffix}${num}`.toLowerCase()
        break
      case 'numbered':
        const randomNum = Math.floor(Math.random() * 9999)
        username = `${adj}${noun}${randomNum}`
        break
      default:
        username = `${adj}${noun}${suffix}${num}`
    }

    return username.slice(0, maxLength)
  }

  const generateUsernames = () => {
    const usernames: string[] = []
    const usedCombos = new Set<string>()

    // Generate based on user input
    if (baseWord) {
      const word = baseWord.charAt(0).toUpperCase() + baseWord.slice(1).toLowerCase()
      for (let i = 0; i < 5; i++) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
        const suffix = includeNumbers ? suffixes[Math.floor(Math.random() * suffixes.length)] : ''
        const num = includeNumbers && Math.random() > 0.5 ? Math.floor(Math.random() * 999).toString() : ''

        usernames.push(formatUsername(adj, word, suffix, num))
        usernames.push(formatUsername(word, nouns[Math.floor(Math.random() * nouns.length)], suffix, num))
      }
    }

    // Generate random combinations
    for (let i = 0; i < 15; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      const combo = `${adj}${noun}`

      if (usedCombos.has(combo)) continue
      usedCombos.add(combo)

      const suffix = includeNumbers ? suffixes[Math.floor(Math.random() * suffixes.length)] : ''
      const num = includeNumbers && Math.random() > 0.5 ? Math.floor(Math.random() * 999).toString() : ''

      usernames.push(formatUsername(adj, noun, suffix, num))
    }

    // Remove duplicates and filter by length
    const unique = [...new Set(usernames)]
      .filter(u => u.length <= maxLength)
      .slice(0, 20)

    setGeneratedUsernames(unique)
  }

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(username)
    setCopiedUsername(username)
    setTimeout(() => setCopiedUsername(null), 2000)
  }

  const toggleFavorite = (username: string) => {
    setFavorites(prev =>
      prev.includes(username)
        ? prev.filter(f => f !== username)
        : [...prev, username]
    )
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Base Word (Optional)
        </h3>
        <input
          type="text"
          value={baseWord}
          onChange={(e) => setBaseWord(e.target.value)}
          placeholder="Enter your name, nickname, or any word..."
          className="w-full px-4 py-3 rounded-lg border border-border bg-background"
          maxLength={20}
        />
      </div>

      {/* Style Selection */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4">Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {styles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedStyle === style.id
                  ? 'border-2 border-primary bg-primary/10'
                  : 'border border-border bg-muted/50 hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm">{style.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{style.example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include numbers</span>
          </label>
          <div className="flex items-center gap-3">
            <label className="text-sm">Max length:</label>
            <select
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value))}
              className="px-3 py-1 rounded-lg border border-border bg-background"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateUsernames}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Generate Usernames
      </motion.button>

      {/* Results */}
      {generatedUsernames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Generated Usernames</h3>
            <button
              onClick={generateUsernames}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {generatedUsernames.map((username, index) => (
              <motion.div
                key={username}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group"
              >
                <span className="font-mono">{username}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFavorite(username)}
                    className={`p-1 rounded ${
                      favorites.includes(username) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(username) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => copyUsername(username)}
                    className="p-1 rounded text-muted-foreground hover:text-primary"
                  >
                    {copiedUsername === username ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="p-6 rounded-xl border border-primary/50 bg-primary/5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            Favorites ({favorites.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map(username => (
              <div
                key={username}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card"
              >
                <span className="font-mono text-sm">{username}</span>
                <button
                  onClick={() => copyUsername(username)}
                  className="p-1 text-muted-foreground hover:text-primary"
                >
                  {copiedUsername === username ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={() => toggleFavorite(username)}
                  className="p-1 text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability Check Info */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Check Availability
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Check if your username is available on these platforms:
        </p>
        <div className="flex flex-wrap gap-2">
          {['Twitter', 'Instagram', 'GitHub', 'TikTok', 'YouTube', 'Reddit', 'Discord'].map(platform => (
            <span
              key={platform}
              className="px-3 py-1.5 rounded-full bg-muted text-sm"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
