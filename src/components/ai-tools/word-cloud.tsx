'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Trash2, Palette } from 'lucide-react'

interface Word {
  text: string
  count: number
  size: number
  x: number
  y: number
  color: string
  rotate: number
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'would', 'could', 'might', 'must', 'shall', 'it', 'its', 'this',
  'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'as', 'if', 'while', 'because', 'until', 'against',
  'dan', 'yang', 'di', 'ke', 'dari', 'ini', 'itu', 'untuk', 'dengan', 'pada', 'adalah'
])

const COLOR_SCHEMES = {
  ocean: ['#0077b6', '#00b4d8', '#48cae4', '#90e0ef', '#023e8a'],
  sunset: ['#ff6b6b', '#feca57', '#ff9f43', '#ee5253', '#f368e0'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
  purple: ['#7209b7', '#560bad', '#480ca8', '#3a0ca3', '#3f37c9'],
  rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'],
  monochrome: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560'],
}

function getWordFrequency(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))

  const frequency = new Map<string, number>()
  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1)
  }

  return frequency
}

export function WordCloud() {
  const [text, setText] = useState('')
  const [colorScheme, setColorScheme] = useState<keyof typeof COLOR_SCHEMES>('ocean')
  const [maxWords, setMaxWords] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [words, setWords] = useState<Word[]>([])
  const [key, setKey] = useState(0)

  const wordFrequency = useMemo(() => {
    const freq = getWordFrequency(text)
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxWords)
  }, [text, maxWords])

  useEffect(() => {
    if (wordFrequency.length === 0) {
      setWords([])
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    const maxCount = Math.max(...wordFrequency.map(([, count]) => count))
    const colors = COLOR_SCHEMES[colorScheme]

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const placedWords: Word[] = []
    const occupiedRects: { x: number; y: number; width: number; height: number }[] = []

    for (let i = 0; i < wordFrequency.length; i++) {
      const [word, count] = wordFrequency[i]
      const normalizedSize = count / maxCount
      const fontSize = Math.max(12, Math.min(60, 12 + normalizedSize * 48))
      const color = colors[i % colors.length]
      const rotate = Math.random() > 0.7 ? (Math.random() > 0.5 ? 90 : -90) : 0

      ctx.font = `bold ${fontSize}px sans-serif`
      const metrics = ctx.measureText(word)
      const wordWidth = rotate !== 0 ? fontSize : metrics.width
      const wordHeight = rotate !== 0 ? metrics.width : fontSize

      // Find a position using spiral placement
      let placed = false
      let angle = 0
      let radius = 0
      const spiralStep = 5
      const angleStep = 0.5

      while (!placed && radius < Math.max(width, height) / 2) {
        const x = centerX + radius * Math.cos(angle) - wordWidth / 2
        const y = centerY + radius * Math.sin(angle) - wordHeight / 2

        const newRect = {
          x: x - 5,
          y: y - 5,
          width: wordWidth + 10,
          height: wordHeight + 10
        }

        // Check if position is valid
        const isValid = x > 10 && y > 10 &&
          x + wordWidth < width - 10 &&
          y + wordHeight < height - 10 &&
          !occupiedRects.some(rect =>
            newRect.x < rect.x + rect.width &&
            newRect.x + newRect.width > rect.x &&
            newRect.y < rect.y + rect.height &&
            newRect.y + newRect.height > rect.y
          )

        if (isValid) {
          occupiedRects.push(newRect)
          placedWords.push({
            text: word,
            count,
            size: fontSize,
            x: x + wordWidth / 2,
            y: y + wordHeight / 2,
            color,
            rotate
          })
          placed = true
        }

        angle += angleStep
        radius += spiralStep / (2 * Math.PI)
      }
    }

    setWords(placedWords)

    // Draw words on canvas
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (const word of placedWords) {
      ctx.save()
      ctx.translate(word.x, word.y)
      ctx.rotate((word.rotate * Math.PI) / 180)
      ctx.font = `bold ${word.size}px sans-serif`
      ctx.fillStyle = word.color
      ctx.fillText(word.text, 0, 0)
      ctx.restore()
    }
  }, [wordFrequency, colorScheme, key])

  const regenerate = () => {
    setKey(prev => prev + 1)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'wordcloud.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Word Cloud Generator</h1>
        <p className="text-muted-foreground">Create beautiful word cloud visualizations from text</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-card rounded-xl p-6 border space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Enter Text</label>
              <button
                onClick={() => setText('')}
                disabled={!text}
                className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-40 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Scheme
              </label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as keyof typeof COLOR_SCHEMES)}
                className="w-full px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {Object.keys(COLOR_SCHEMES).map(scheme => (
                  <option key={scheme} value={scheme}>
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Words</label>
              <select
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
                className="w-full px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {[25, 50, 75, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample Text */}
          <div>
            <p className="text-sm font-medium mb-2">Try a sample:</p>
            <button
              onClick={() => setText(`Artificial intelligence is transforming the way we live and work. Machine learning algorithms can now recognize images, understand speech, and even generate creative content. Deep learning neural networks are at the heart of many AI breakthroughs, from self-driving cars to medical diagnosis. Natural language processing enables computers to understand and generate human language, powering chatbots and translation services. Computer vision allows machines to see and interpret the visual world. The future of AI holds tremendous promise for solving complex problems in healthcare, climate change, and scientific research. However, ethical considerations around AI development remain crucial as we navigate this technological revolution.`)}
              className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              AI Technology
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={regenerate}
              disabled={!text}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
            <button
              onClick={downloadImage}
              disabled={words.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          {wordFrequency.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">
                Showing {words.length} of {wordFrequency.length} unique words
              </p>
            </div>
          )}
        </div>

        {/* Canvas Panel */}
        <div className="bg-card rounded-xl p-6 border">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full bg-white rounded-lg"
            style={{ aspectRatio: '5/4' }}
          />

          {words.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-center">
                Enter text to generate a word cloud
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Words */}
      {wordFrequency.length > 0 && (
        <div className="mt-6 bg-card rounded-xl p-6 border">
          <h3 className="font-semibold mb-4">Top Words</h3>
          <div className="flex flex-wrap gap-2">
            {wordFrequency.slice(0, 20).map(([word, count], index) => (
              <span
                key={word}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `${COLOR_SCHEMES[colorScheme][index % COLOR_SCHEMES[colorScheme].length]}20`,
                  color: COLOR_SCHEMES[colorScheme][index % COLOR_SCHEMES[colorScheme].length]
                }}
              >
                {word} ({count})
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
