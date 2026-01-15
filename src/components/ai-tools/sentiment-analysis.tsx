'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Loader2, RefreshCw, Sparkles, ThumbsUp, ThumbsDown, Meh, Heart, Angry, Frown, Smile, AlertCircle, Zap } from 'lucide-react'

// Comprehensive sentiment lexicon
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant',
  'love', 'like', 'enjoy', 'happy', 'joy', 'beautiful', 'perfect', 'best', 'incredible',
  'outstanding', 'superb', 'magnificent', 'terrific', 'delightful', 'pleasant', 'nice',
  'positive', 'helpful', 'useful', 'valuable', 'exciting', 'fascinating', 'impressive',
  'remarkable', 'exceptional', 'phenomenal', 'spectacular', 'marvelous', 'splendid',
  'glad', 'pleased', 'satisfied', 'grateful', 'thankful', 'blessed', 'fortunate',
  'success', 'successful', 'achieve', 'accomplish', 'win', 'winner', 'champion',
  'recommend', 'recommended', 'approve', 'approved', 'admire', 'admirable', 'praise',
  'smart', 'clever', 'genius', 'talented', 'skilled', 'expert', 'professional',
  'friendly', 'kind', 'caring', 'generous', 'warm', 'welcoming', 'supportive',
  'reliable', 'trustworthy', 'honest', 'sincere', 'genuine', 'authentic', 'real',
  'fast', 'quick', 'efficient', 'effective', 'productive', 'innovative', 'creative',
  'clean', 'fresh', 'bright', 'colorful', 'vibrant', 'lively', 'energetic', 'dynamic',
  'comfortable', 'cozy', 'relaxing', 'peaceful', 'calm', 'serene', 'tranquil',
  'fun', 'funny', 'hilarious', 'entertaining', 'amusing', 'enjoyable', 'engaging'
])

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'horrible', 'awful', 'worst', 'hate', 'dislike', 'angry', 'sad',
  'poor', 'disappointing', 'disappointed', 'frustrating', 'frustrated', 'annoying',
  'annoyed', 'boring', 'dull', 'stupid', 'dumb', 'ugly', 'disgusting', 'gross',
  'fail', 'failed', 'failure', 'useless', 'worthless', 'waste', 'wasted', 'broken',
  'wrong', 'mistake', 'error', 'problem', 'issue', 'bug', 'buggy', 'crash', 'crashed',
  'slow', 'sluggish', 'laggy', 'unresponsive', 'difficult', 'hard', 'complicated',
  'confusing', 'confused', 'unclear', 'vague', 'messy', 'dirty', 'chaotic', 'disorganized',
  'expensive', 'overpriced', 'costly', 'ripoff', 'scam', 'fake', 'fraud', 'lie', 'liar',
  'rude', 'mean', 'cruel', 'harsh', 'hostile', 'aggressive', 'violent', 'dangerous',
  'scary', 'frightening', 'terrifying', 'creepy', 'weird', 'strange', 'odd', 'bizarre',
  'sick', 'ill', 'unhealthy', 'painful', 'hurt', 'hurting', 'suffering', 'miserable',
  'lonely', 'alone', 'isolated', 'abandoned', 'rejected', 'ignored', 'neglected',
  'worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'exhausted', 'tired',
  'bored', 'uninterested', 'disengaged', 'apathetic', 'indifferent', 'careless',
  'unreliable', 'untrustworthy', 'dishonest', 'deceitful', 'manipulative', 'toxic',
  'never', 'nothing', 'nobody', 'nowhere', 'impossible', 'cannot', 'unable', 'refuse'
])

const INTENSIFIERS = new Set([
  'very', 'really', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely',
  'utterly', 'highly', 'deeply', 'strongly', 'particularly', 'especially', 'remarkably',
  'exceptionally', 'extraordinarily', 'tremendously', 'immensely', 'hugely', 'massively'
])

const NEGATORS = new Set([
  'not', "n't", 'no', 'never', 'neither', 'nobody', 'nothing', 'nowhere', 'hardly',
  'barely', 'scarcely', 'seldom', 'rarely', 'without', 'lack', 'lacking', 'absent'
])

// Emotion keywords
const EMOTIONS = {
  joy: ['happy', 'joy', 'joyful', 'delighted', 'pleased', 'glad', 'cheerful', 'elated', 'ecstatic', 'thrilled', 'excited', 'wonderful', 'amazing', 'fantastic', 'love', 'loving'],
  sadness: ['sad', 'unhappy', 'depressed', 'melancholy', 'gloomy', 'heartbroken', 'disappointed', 'miserable', 'sorrowful', 'grief', 'crying', 'tears', 'lonely', 'alone'],
  anger: ['angry', 'mad', 'furious', 'rage', 'outraged', 'irritated', 'annoyed', 'frustrated', 'hate', 'hatred', 'hostile', 'aggressive', 'violent', 'disgusted'],
  fear: ['scared', 'afraid', 'frightened', 'terrified', 'anxious', 'worried', 'nervous', 'panic', 'horror', 'dread', 'alarmed', 'concerned', 'uneasy', 'stressed'],
  surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'unexpected', 'unbelievable', 'incredible', 'wow', 'whoa', 'omg', 'suddenly'],
  disgust: ['disgusted', 'gross', 'revolting', 'repulsive', 'sick', 'nasty', 'vile', 'awful', 'terrible', 'horrible', 'yuck', 'ew']
}

interface AnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  confidence: number
  emotions: { [key: string]: number }
  positiveWords: string[]
  negativeWords: string[]
  summary: string
}

export function SentimentAnalysis() {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeText = useCallback(async (inputText: string): Promise<AnalysisResult> => {
    // Simulate processing time for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const words = inputText.toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0)

    if (words.length === 0) {
      return {
        sentiment: 'neutral',
        score: 0,
        confidence: 0,
        emotions: {},
        positiveWords: [],
        negativeWords: [],
        summary: 'No text to analyze'
      }
    }

    let positiveScore = 0
    let negativeScore = 0
    const foundPositive: string[] = []
    const foundNegative: string[] = []
    let negationActive = false
    let intensifierActive = false

    // Analyze words with context
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const prevWord = i > 0 ? words[i - 1] : ''

      // Check for negation
      if (NEGATORS.has(word) || NEGATORS.has(prevWord)) {
        negationActive = true
      }

      // Check for intensifiers
      if (INTENSIFIERS.has(prevWord)) {
        intensifierActive = true
      }

      const multiplier = intensifierActive ? 1.5 : 1

      if (POSITIVE_WORDS.has(word)) {
        if (negationActive) {
          negativeScore += multiplier
          foundNegative.push(negationActive ? `not ${word}` : word)
        } else {
          positiveScore += multiplier
          foundPositive.push(word)
        }
      }

      if (NEGATIVE_WORDS.has(word)) {
        if (negationActive) {
          positiveScore += multiplier * 0.5 // Negated negative is weakly positive
          foundPositive.push(`not ${word}`)
        } else {
          negativeScore += multiplier
          foundNegative.push(word)
        }
      }

      // Reset context flags after processing
      if (!NEGATORS.has(word)) {
        negationActive = false
      }
      intensifierActive = false
    }

    // Calculate emotions
    const emotions: { [key: string]: number } = {}
    const textLower = inputText.toLowerCase()

    for (const [emotion, keywords] of Object.entries(EMOTIONS)) {
      let emotionScore = 0
      for (const keyword of keywords) {
        if (textLower.includes(keyword)) {
          emotionScore += 1
        }
      }
      if (emotionScore > 0) {
        emotions[emotion] = Math.min(1, emotionScore / 3)
      }
    }

    // Calculate final scores
    const totalScore = positiveScore + negativeScore
    const normalizedScore = totalScore > 0
      ? (positiveScore - negativeScore) / totalScore
      : 0

    // Determine sentiment
    let sentiment: 'positive' | 'negative' | 'neutral'
    if (normalizedScore > 0.2) {
      sentiment = 'positive'
    } else if (normalizedScore < -0.2) {
      sentiment = 'negative'
    } else {
      sentiment = 'neutral'
    }

    // Calculate confidence based on word coverage
    const sentimentWordCount = foundPositive.length + foundNegative.length
    const confidence = Math.min(0.95, Math.max(0.3, sentimentWordCount / Math.max(words.length * 0.3, 1)))

    // Generate summary
    let summary = ''
    if (sentiment === 'positive') {
      if (normalizedScore > 0.6) {
        summary = 'This text expresses very strong positive sentiment.'
      } else if (normalizedScore > 0.3) {
        summary = 'This text expresses moderately positive sentiment.'
      } else {
        summary = 'This text expresses slightly positive sentiment.'
      }
    } else if (sentiment === 'negative') {
      if (normalizedScore < -0.6) {
        summary = 'This text expresses very strong negative sentiment.'
      } else if (normalizedScore < -0.3) {
        summary = 'This text expresses moderately negative sentiment.'
      } else {
        summary = 'This text expresses slightly negative sentiment.'
      }
    } else {
      summary = 'This text expresses neutral or mixed sentiment.'
    }

    // Add emotion context to summary
    const dominantEmotions = Object.entries(emotions)
      .filter(([_, score]) => score > 0.3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([emotion]) => emotion)

    if (dominantEmotions.length > 0) {
      summary += ` Primary emotions detected: ${dominantEmotions.join(', ')}.`
    }

    return {
      sentiment,
      score: normalizedScore,
      confidence,
      emotions,
      positiveWords: [...new Set(foundPositive)],
      negativeWords: [...new Set(foundNegative)],
      summary
    }
  }, [])

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    try {
      const analysis = await analyzeText(text)
      setResult(analysis)
    } catch (error) {
      console.error('Error analyzing text:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setText('')
    setResult(null)
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-8 h-8" />
      case 'negative': return <Frown className="w-8 h-8" />
      default: return <Meh className="w-8 h-8" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500'
      case 'negative': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return <Heart className="w-4 h-4" />
      case 'sadness': return <Frown className="w-4 h-4" />
      case 'anger': return <Angry className="w-4 h-4" />
      case 'fear': return <AlertCircle className="w-4 h-4" />
      case 'surprise': return <Zap className="w-4 h-4" />
      case 'disgust': return <ThumbsDown className="w-4 h-4" />
      default: return <Meh className="w-4 h-4" />
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'bg-pink-500/20 text-pink-500 border-pink-500/30'
      case 'sadness': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      case 'anger': return 'bg-red-500/20 text-red-500 border-red-500/30'
      case 'fear': return 'bg-purple-500/20 text-purple-500 border-purple-500/30'
      case 'surprise': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'disgust': return 'bg-green-600/20 text-green-600 border-green-600/30'
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    }
  }

  const sampleTexts = [
    "I absolutely love this product! It's amazing and exceeded all my expectations.",
    "This is terrible. I'm very disappointed and frustrated with the poor quality.",
    "The weather today is okay. Nothing special, just an average day.",
    "I'm so excited and happy about the good news! This is wonderful!",
    "I hate waiting in long lines. It's so annoying and wastes my time."
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-4">
          <MessageSquare className="w-4 h-4" />
          NLP Analysis
        </div>
        <h2 className="text-3xl font-bold mb-2">Sentiment Analysis</h2>
        <p className="text-muted-foreground">
          Analyze text to detect sentiment, emotions, and key phrases.
        </p>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze... (reviews, comments, feedback, social media posts, etc.)"
            className="w-full h-40 p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {text.length} characters
          </div>
        </div>

        {/* Sample Texts */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Try a sample:</p>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, i) => (
              <button
                key={i}
                onClick={() => setText(sample)}
                className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-accent transition-colors truncate max-w-[200px]"
              >
                {sample.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Analyze Sentiment
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 space-y-6"
          >
            {/* Main Sentiment */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    result.sentiment === 'positive' ? 'bg-green-500/20' :
                    result.sentiment === 'negative' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <span className={getSentimentColor(result.sentiment)}>
                      {getSentimentIcon(result.sentiment)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{result.sentiment}</h3>
                    <p className="text-muted-foreground">Sentiment detected</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {Math.round(Math.abs(result.score) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </p>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Negative</span>
                  <span>Neutral</span>
                  <span>Positive</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: '100%' }}
                  />
                  <div
                    className="absolute top-0 w-3 h-3 bg-white border-2 border-foreground rounded-full transform -translate-x-1/2"
                    style={{ left: `${(result.score + 1) * 50}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <p className="mt-4 text-muted-foreground">{result.summary}</p>
            </div>

            {/* Emotions */}
            {Object.keys(result.emotions).length > 0 && (
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="font-medium mb-4">Detected Emotions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(result.emotions)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, score]) => (
                      <div
                        key={emotion}
                        className={`p-3 rounded-lg border ${getEmotionColor(emotion)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getEmotionIcon(emotion)}
                          <span className="font-medium capitalize">{emotion}</span>
                        </div>
                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score * 100}%` }}
                            className="h-full bg-current rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Key Words */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.positiveWords.length > 0 && (
                <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    <h3 className="font-medium text-green-500">Positive Words</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.positiveWords.map((word, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.negativeWords.length > 0 && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                    <h3 className="font-medium text-red-500">Negative Words</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.negativeWords.map((word, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> All analysis happens locally in your browser.
        </p>
      </div>
    </div>
  )
}
