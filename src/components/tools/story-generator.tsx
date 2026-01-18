'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2, RefreshCw, Copy, Check, BookOpen,
  Sparkles, Save, Trash2
} from 'lucide-react'

interface Story {
  id: string
  title: string
  content: string
  genre: string
  createdAt: Date
}

const GENRES = [
  { id: 'fantasy', name: 'Fantasy', emoji: '🧙' },
  { id: 'scifi', name: 'Sci-Fi', emoji: '🚀' },
  { id: 'mystery', name: 'Mystery', emoji: '🔍' },
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'horror', name: 'Horror', emoji: '👻' },
  { id: 'adventure', name: 'Adventure', emoji: '⚔️' },
  { id: 'comedy', name: 'Comedy', emoji: '😂' },
  { id: 'drama', name: 'Drama', emoji: '🎭' }
]

const STORY_ELEMENTS = {
  fantasy: {
    heroes: ['a young wizard', 'an elven princess', 'a brave knight', 'a mysterious druid', 'a dragon rider'],
    villains: ['the dark sorcerer', 'the ancient dragon', 'the shadow king', 'the cursed witch'],
    settings: ['the enchanted forest', 'the floating castle', 'the crystal caves', 'the forbidden realm'],
    quests: ['find the lost artifact', 'break the ancient curse', 'unite the magical kingdoms', 'defeat the dark army'],
    twists: ['discovers they have hidden powers', 'finds an unexpected ally', 'learns a shocking truth about their past']
  },
  scifi: {
    heroes: ['a space captain', 'a rogue AI', 'a time traveler', 'an alien diplomat', 'a cybernetic soldier'],
    villains: ['the galactic empire', 'the rogue AI collective', 'the time paradox', 'the alien invasion'],
    settings: ['aboard the starship', 'on the distant planet', 'in the space station', 'across parallel dimensions'],
    quests: ['save humanity', 'prevent the time collapse', 'establish first contact', 'escape the simulation'],
    twists: ['realizes the truth about reality', 'discovers humanity\'s true origin', 'finds a way to bend time']
  },
  mystery: {
    heroes: ['a detective', 'an amateur sleuth', 'a journalist', 'a forensic expert', 'a private investigator'],
    villains: ['the mastermind criminal', 'the secret society', 'the corrupt official', 'the vengeful ghost'],
    settings: ['the old mansion', 'the foggy streets', 'the locked room', 'the small coastal town'],
    quests: ['solve the impossible crime', 'uncover the conspiracy', 'find the missing person', 'decode the cipher'],
    twists: ['the evidence points to an unlikely suspect', 'discovers a hidden connection', 'the victim isn\'t who they seemed']
  },
  romance: {
    heroes: ['a bookshop owner', 'a famous chef', 'an artist', 'a world traveler', 'a musician'],
    villains: ['past heartbreak', 'family expectations', 'career ambitions', 'a misunderstanding'],
    settings: ['the cozy café', 'the Italian countryside', 'the bustling city', 'the seaside village'],
    quests: ['find true love', 'reconnect with their soulmate', 'choose between love and duty', 'heal from the past'],
    twists: ['realizes they\'ve met before', 'discovers a shared secret', 'finds love in unexpected places']
  },
  horror: {
    heroes: ['a paranormal investigator', 'a skeptical scientist', 'a group of friends', 'a lone survivor', 'a psychic'],
    villains: ['the ancient evil', 'the vengeful spirit', 'the cursed object', 'the nightmare creature'],
    settings: ['the abandoned asylum', 'the haunted house', 'the cursed town', 'the dark forest'],
    quests: ['survive the night', 'banish the evil', 'uncover the dark history', 'escape the nightmare'],
    twists: ['realizes the horror comes from within', 'discovers they\'re not alone', 'learns the true nature of evil']
  },
  adventure: {
    heroes: ['an explorer', 'a treasure hunter', 'a rebel leader', 'a skilled mercenary', 'a legendary pirate'],
    villains: ['the rival expedition', 'the ancient guardians', 'the oppressive regime', 'the natural disaster'],
    settings: ['the lost temple', 'the uncharted island', 'the dangerous jungle', 'the treacherous mountains'],
    quests: ['find the legendary treasure', 'map the unknown lands', 'lead the revolution', 'survive against all odds'],
    twists: ['the map reveals a bigger secret', 'finds an ancient civilization', 'discovers the treasure was inside all along']
  },
  comedy: {
    heroes: ['an awkward office worker', 'a hapless inventor', 'a clumsy spy', 'an unlucky tourist', 'a confused robot'],
    villains: ['Murphy\'s Law', 'the strict boss', 'the impossible deadline', 'social expectations'],
    settings: ['the chaotic workplace', 'the disaster wedding', 'the road trip from hell', 'the family reunion'],
    quests: ['survive the day', 'impress the date', 'fix the mistake', 'keep the secret'],
    twists: ['everything goes hilariously wrong', 'the plan backfires spectacularly', 'wins despite total chaos']
  },
  drama: {
    heroes: ['a struggling artist', 'a reformed criminal', 'a grieving parent', 'a whistleblower', 'a returning veteran'],
    villains: ['their own past', 'societal pressure', 'a moral dilemma', 'the ticking clock'],
    settings: ['the small hometown', 'the big city', 'the family home', 'the courtroom'],
    quests: ['find redemption', 'protect the innocent', 'reveal the truth', 'reconcile with the past'],
    twists: ['discovers the cost of truth', 'faces an impossible choice', 'finds strength in vulnerability']
  }
}

export function StoryGenerator() {
  const [genre, setGenre] = useState('fantasy')
  const [story, setStory] = useState<{ title: string; content: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedStories, setSavedStories] = useState<Story[]>([])

  const generateStory = () => {
    setIsGenerating(true)

    setTimeout(() => {
      const elements = STORY_ELEMENTS[genre as keyof typeof STORY_ELEMENTS]
      const hero = elements.heroes[Math.floor(Math.random() * elements.heroes.length)]
      const villain = elements.villains[Math.floor(Math.random() * elements.villains.length)]
      const setting = elements.settings[Math.floor(Math.random() * elements.settings.length)]
      const quest = elements.quests[Math.floor(Math.random() * elements.quests.length)]
      const twist = elements.twists[Math.floor(Math.random() * elements.twists.length)]

      const templates = [
        `In ${setting}, ${hero} embarked on an extraordinary journey to ${quest}. Little did they know that ${villain} stood in their way, ready to challenge everything they believed in. Through trials and tribulations, our hero ${twist}, changing the course of their destiny forever. In the end, they discovered that the true power lay not in the quest itself, but in the courage to begin.`,

        `The story begins in ${setting}, where ${hero} lived an ordinary life until fate intervened. When ${villain} threatened everything they held dear, they had no choice but to ${quest}. Along the way, ${hero} ${twist}. This revelation would test their resolve and reshape their understanding of what it truly means to be a hero.`,

        `${hero.charAt(0).toUpperCase() + hero.slice(1)} never expected to find themselves in ${setting}, yet here they were, face to face with their destiny. The mission was clear: ${quest}. But ${villain} had other plans. In a twist of fate, our protagonist ${twist}, leading to a climax that no one could have predicted. Some say the adventure changed them forever; others say they were always meant for this path.`,

        `Deep in ${setting}, a legend was about to unfold. ${hero.charAt(0).toUpperCase() + hero.slice(1)} carried the weight of a sacred mission: to ${quest}. But shadows lurked everywhere, for ${villain} had been waiting for this moment. When ${hero} ${twist}, the very fabric of reality seemed to shift. Victory was never certain, but giving up was never an option.`
      ]

      const content = templates[Math.floor(Math.random() * templates.length)]

      const titleTemplates = [
        `The ${genre === 'fantasy' ? 'Chronicles' : 'Tales'} of ${hero.split(' ').slice(-1)[0].charAt(0).toUpperCase() + hero.split(' ').slice(-1)[0].slice(1)}`,
        `${setting.split(' ').slice(-1)[0].charAt(0).toUpperCase() + setting.split(' ').slice(-1)[0].slice(1)}'s Secret`,
        `When ${villain.split(' ').slice(-1)[0].charAt(0).toUpperCase() + villain.split(' ').slice(-1)[0].slice(1)} Rises`,
        `The Last ${hero.split(' ').slice(-1)[0].charAt(0).toUpperCase() + hero.split(' ').slice(-1)[0].slice(1)}`
      ]

      const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)]

      setStory({ title, content })
      setIsGenerating(false)
    }, 1500)
  }

  const copyStory = () => {
    if (!story) return
    navigator.clipboard.writeText(`${story.title}\n\n${story.content}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveStory = () => {
    if (!story) return
    const newStory: Story = {
      id: Date.now().toString(),
      title: story.title,
      content: story.content,
      genre,
      createdAt: new Date()
    }
    setSavedStories(prev => [newStory, ...prev])
  }

  const deleteStory = (id: string) => {
    setSavedStories(prev => prev.filter(s => s.id !== id))
  }

  const loadStory = (s: Story) => {
    setStory({ title: s.title, content: s.content })
    setGenre(s.genre)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Genre Selection */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-3 block">Choose a genre</label>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => setGenre(g.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  genre === g.id
                    ? 'bg-blue-500 text-white scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl block mb-1">{g.emoji}</span>
                <span className="text-xs">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateStory}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center gap-3 font-medium shadow-lg shadow-purple-500/30 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Story
              </>
            )}
          </motion.button>
        </div>

        {/* Story Output */}
        <AnimatePresence mode="wait">
          {story && (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{story.title}</h3>
                  <span className="text-white/50 text-sm">
                    {GENRES.find(g => g.id === genre)?.emoji} {GENRES.find(g => g.id === genre)?.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveStory}
                    className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20"
                    title="Save story"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={copyStory}
                    className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20"
                    title="Copy story"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={generateStory}
                    className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20"
                    title="Generate new"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed text-lg">
                {story.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!story && !isGenerating && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/50">Select a genre and click generate to create your story</p>
          </div>
        )}

        {/* Saved Stories */}
        {savedStories.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Saved Stories ({savedStories.length})
            </h3>
            <div className="space-y-2">
              {savedStories.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10"
                  onClick={() => loadStory(s)}
                >
                  <span className="text-xl">{GENRES.find(g => g.id === s.genre)?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{s.title}</div>
                    <div className="text-white/50 text-sm truncate">{s.content.substring(0, 60)}...</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteStory(s.id); }}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
