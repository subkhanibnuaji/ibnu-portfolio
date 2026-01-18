'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Sparkles, RotateCcw, Copy, Check, Share2 } from 'lucide-react'

const FORTUNES = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A dubious friend may be an enemy in camouflage.",
  "A faithful friend is a strong defense.",
  "A fresh start will put you on your way.",
  "A golden egg of opportunity falls into your lap this month.",
  "A good time to finish up old tasks.",
  "A hunch is creativity trying to tell you something.",
  "A lifetime friend shall soon be made.",
  "A lifetime of happiness lies ahead of you.",
  "A light heart carries you through all the hard times.",
  "A new perspective will come with the new year.",
  "A pleasant surprise is waiting for you.",
  "A smile is your personal welcome mat.",
  "Accept something that you cannot change, and you will feel better.",
  "Adventure can be real happiness.",
  "Advice, when most needed, is least heeded.",
  "All your hard work will soon pay off.",
  "An important person will offer you support.",
  "An unexpected event will soon make your life more exciting.",
  "Be careful or you could fall for some tricks today.",
  "Beauty in its various forms appeals to you.",
  "Because you demand more from yourself, others respect you deeply.",
  "Believe in yourself and others will too.",
  "Better to be the one who smiled than the one who didn't smile back.",
  "Carve your name on your heart and not on marble.",
  "Change is happening in your life, so go with the flow!",
  "Competence like yours is underrated.",
  "Curiosity kills boredom. Nothing can kill curiosity.",
  "Dedicate yourself with a calm mind to the task at hand.",
  "Determination is what you need now.",
  "Disbelief destroys the magic.",
  "Do not be afraid of competition.",
  "Don't just think, act!",
  "Don't let friends impose on you, work calmly and silently.",
  "Each day, compel yourself to do something you would rather not do.",
  "Embrace this love relationship you have!",
  "Everywhere you choose to go, friendly faces will greet you.",
  "Expect much of yourself and little of others.",
  "Failure is the chance to do better next time.",
  "Feeding a cow with roses does not get extra appreciation.",
  "For hate is never conquered by hate. Hate is conquered by love.",
  "Fortune favors the brave.",
  "Get your mind set, confidence will lead you on.",
  "Go take a rest; you deserve it.",
  "Good things are being said about you.",
  "Happiness begins with facing life with a smile and a wink.",
  "Happiness will bring you good luck.",
  "Hard work pays off in the future, laziness pays off now.",
  "Have a beautiful day.",
  "He who knows he has enough is rich.",
  "If you continually give, you will continually have.",
  "In the end all things will be known.",
  "It takes courage to admit fault.",
  "Keep your face to the sunshine and you will never see shadows.",
  "Let the world be filled with tranquility and goodwill.",
  "Long life is in store for you.",
  "Love is a warm fire to keep the soul warm.",
  "Love lights up the world.",
  "Love truth, but pardon error.",
  "Nature, time and patience are the three great physicians.",
  "New ideas could be profitable.",
  "Nothing is impossible to a willing heart.",
  "Now is the time to try something new.",
  "Others can help you now.",
  "Patience is the best remedy for every trouble.",
  "Perhaps you've been focusing too much on yourself.",
  "Physical activity will dramatically improve your outlook today.",
  "Practice makes perfect.",
  "Protective measures will prevent costly disasters.",
  "Put your mind into planning today. Look into the future.",
  "Romance moves you in a new direction.",
  "Smile when you're ready.",
  "Soon, a visitor shall delight you.",
  "Stand tall. Don't look down upon yourself.",
  "Stay true to those who would do the same for you.",
  "Success is a journey, not a destination.",
  "Take care and sensitivity when sharing.",
  "The greatest achievement in life is to stand up again after falling.",
  "The night life is for you.",
  "The one you love is closer than you think.",
  "The time is right to make new friends.",
  "There is a true and sincere friendship between you and your friends.",
  "There is no wisdom greater than kindness.",
  "There's no such thing as an ordinary cat.",
  "Things may come to those who wait, but only what's left behind by those who hustle.",
  "Those who care will make the effort.",
  "Today is the conserve yourself, as things just won't budge.",
  "Trust your intuition. The universe is guiding your life.",
  "Use your head but live in your heart.",
  "Wish you happiness.",
  "You are a bundle of energy, always on the go.",
  "You are a lover of words, someday you should write a book.",
  "You are heading in the right direction.",
  "You are talented in many ways.",
  "You find beauty in ordinary things. Do not lose this ability.",
  "You have a deep appreciation of the arts and music.",
  "You have an ambitious nature and may make a name for yourself.",
  "You will be successful in your work.",
  "Your abilities are unparalleled.",
  "Your heart is pure, and your mind clear, and soul devout."
]

const LUCKY_NUMBERS_RANGE = { min: 1, max: 99 }
const LUCKY_ITEMS = ['Dragon', 'Phoenix', 'Lotus', 'Bamboo', 'Tiger', 'Jade', 'Moon', 'Star', 'Mountain', 'River', 'Sun', 'Cloud', 'Thunder', 'Wind', 'Fire']
const LUCKY_COLORS = ['Red', 'Gold', 'Green', 'Blue', 'Purple', 'Silver', 'Orange', 'Pink', 'White', 'Black']

export function FortuneCookie() {
  const [fortune, setFortune] = useState<string | null>(null)
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([])
  const [luckyItem, setLuckyItem] = useState<string>('')
  const [luckyColor, setLuckyColor] = useState<string>('')
  const [isOpening, setIsOpening] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<{ fortune: string; numbers: number[]; item: string; color: string }[]>([])

  const generateLuckyNumbers = (): number[] => {
    const numbers = new Set<number>()
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * (LUCKY_NUMBERS_RANGE.max - LUCKY_NUMBERS_RANGE.min + 1)) + LUCKY_NUMBERS_RANGE.min)
    }
    return Array.from(numbers).sort((a, b) => a - b)
  }

  const openCookie = () => {
    if (isOpening || isOpened) return

    setIsOpening(true)

    setTimeout(() => {
      const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
      const numbers = generateLuckyNumbers()
      const item = LUCKY_ITEMS[Math.floor(Math.random() * LUCKY_ITEMS.length)]
      const color = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)]

      setFortune(randomFortune)
      setLuckyNumbers(numbers)
      setLuckyItem(item)
      setLuckyColor(color)
      setIsOpened(true)
      setIsOpening(false)
      setHistory(prev => [{ fortune: randomFortune, numbers, item, color }, ...prev].slice(0, 5))
    }, 1500)
  }

  const reset = () => {
    setFortune(null)
    setLuckyNumbers([])
    setLuckyItem('')
    setLuckyColor('')
    setIsOpened(false)
    setIsOpening(false)
  }

  const copyFortune = () => {
    if (!fortune) return
    navigator.clipboard.writeText(`${fortune}\n\nLucky Numbers: ${luckyNumbers.join(', ')}\nLucky Symbol: ${luckyItem}\nLucky Color: ${luckyColor}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareFortune = async () => {
    if (!fortune || !navigator.share) return
    try {
      await navigator.share({
        title: 'My Fortune',
        text: `${fortune}\n\nLucky Numbers: ${luckyNumbers.join(', ')}`
      })
    } catch {
      copyFortune()
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Cookie Display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              animate={isOpening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: isOpening ? 2 : 0 }}
              className="cursor-pointer"
              onClick={openCookie}
            >
              <AnimatePresence mode="wait">
                {!isOpened ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                    className="relative"
                  >
                    {/* Cookie shape */}
                    <div className="w-48 h-32 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full transform -skew-x-6" />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full transform skew-x-6 -translate-y-2" />
                      <div className="absolute inset-4 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full" />

                      {/* Sparkle effect when hovering */}
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-4"
                      >
                        <Sparkles className="w-8 h-8 text-yellow-300" />
                      </motion.div>
                    </div>

                    {isOpening && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Cookie className="w-12 h-12 text-white/50" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="opened"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    {/* Broken cookie pieces */}
                    <div className="flex justify-center gap-2 mb-4">
                      <motion.div
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: -20, rotate: -15 }}
                        className="w-20 h-16 bg-gradient-to-br from-amber-300 to-amber-500 rounded-l-full"
                      />
                      <motion.div
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 20, rotate: 15 }}
                        className="w-20 h-16 bg-gradient-to-br from-amber-300 to-amber-500 rounded-r-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Fortune Display */}
        <AnimatePresence>
          {fortune && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-6"
            >
              {/* Fortune paper */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <p className="text-amber-900 text-center text-lg italic font-serif mb-4">
                  "{fortune}"
                </p>

                <div className="border-t border-amber-200 pt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-amber-700 text-sm">
                    <span className="font-medium">Lucky Numbers:</span>
                    <span className="font-mono">{luckyNumbers.join(' - ')}</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-amber-700 text-sm">
                    <span><strong>Symbol:</strong> {luckyItem}</span>
                    <span><strong>Color:</strong> {luckyColor}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={copyFortune}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                {'share' in navigator && (
                  <button
                    onClick={shareFortune}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Cookie
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!isOpened && !isOpening && (
          <div className="text-center text-white/50 text-sm">
            Click the fortune cookie to reveal your fortune
          </div>
        )}
      </motion.div>

      {/* History */}
      {history.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4">Previous Fortunes</h3>
          <div className="space-y-3">
            {history.slice(1).map((item, i) => (
              <div
                key={i}
                className="p-3 bg-amber-500/10 rounded-lg"
              >
                <p className="text-white/90 text-sm italic mb-2">"{item.fortune}"</p>
                <div className="text-white/50 text-xs">
                  Lucky Numbers: {item.numbers.join(', ')} | {item.item} | {item.color}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
