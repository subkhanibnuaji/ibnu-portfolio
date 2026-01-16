'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Languages, Copy, Check, Trash2 } from 'lucide-react'

// Language detection patterns and common words
const LANGUAGE_PATTERNS: Record<string, { name: string; patterns: RegExp[]; commonWords: string[] }> = {
  en: {
    name: 'English',
    patterns: [/\b(the|is|are|was|were|have|has|had|been|will|would|could|should|can|may|might)\b/gi],
    commonWords: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what']
  },
  id: {
    name: 'Indonesian',
    patterns: [/\b(yang|dan|di|dari|untuk|dengan|ini|itu|adalah|pada|ke|tidak|akan|sudah|bisa|juga|atau|ada|saya|anda|mereka|kita|kami)\b/gi],
    commonWords: ['yang', 'dan', 'di', 'dari', 'untuk', 'dengan', 'ini', 'itu', 'adalah', 'pada', 'ke', 'tidak', 'akan', 'sudah', 'bisa', 'juga', 'atau', 'ada', 'saya', 'anda', 'mereka', 'kita', 'kami', 'nya', 'dapat', 'telah', 'lebih', 'seperti', 'hanya', 'oleh', 'setelah']
  },
  es: {
    name: 'Spanish',
    patterns: [/\b(el|la|los|las|un|una|es|son|está|están|que|de|en|y|a|por|para|con|no|se|su|al)\b/gi],
    commonWords: ['de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'se', 'del', 'las', 'un', 'por', 'con', 'no', 'una', 'su', 'para', 'es', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'sí', 'porque', 'esta', 'entre', 'cuando', 'muy', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay']
  },
  fr: {
    name: 'French',
    patterns: [/\b(le|la|les|un|une|des|est|sont|que|de|en|et|à|pour|pas|ne|ce|je|tu|il|elle|nous|vous|ils|elles)\b/gi],
    commonWords: ['de', 'la', 'le', 'et', 'les', 'des', 'en', 'un', 'du', 'une', 'que', 'est', 'pour', 'qui', 'dans', 'ce', 'il', 'pas', 'plus', 'par', 'je', 'sur', 'se', 'son', 'sont', 'avec', 'au', 'mais', 'nous', 'sa', 'ou', 'tout', 'cette', 'fait', 'être', 'comme', 'elle', 'ont', 'bien', 'ces']
  },
  de: {
    name: 'German',
    patterns: [/\b(der|die|das|ein|eine|ist|sind|und|in|zu|den|von|mit|für|auf|nicht|sich|des|auch|als|an|es|war|aus|bei|haben|werden)\b/gi],
    commonWords: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als', 'auch', 'es', 'an', 'er', 'hat', 'aus', 'bei', 'sind', 'noch', 'nach', 'wird', 'wie', 'einem', 'nur', 'oder', 'aber', 'vor', 'zur', 'bis', 'mehr']
  },
  it: {
    name: 'Italian',
    patterns: [/\b(il|la|lo|i|gli|le|un|una|è|sono|che|di|a|da|in|con|su|per|non|si|come|più|anche|ma|o|se|questo|quello|essere|avere)\b/gi],
    commonWords: ['di', 'che', 'e', 'la', 'il', 'un', 'a', 'per', 'in', 'una', 'è', 'non', 'sono', 'da', 'del', 'si', 'le', 'con', 'i', 'della', 'come', 'ha', 'lo', 'più', 'nel', 'al', 'ma', 'dei', 'se', 'o', 'anche', 'questo', 'ho', 'gli', 'alla', 'su', 'questo', 'essere', 'ci', 'stato']
  },
  pt: {
    name: 'Portuguese',
    patterns: [/\b(o|a|os|as|um|uma|é|são|que|de|em|para|com|não|se|da|do|por|mais|como|mas|ou|este|esse|isto|isso)\b/gi],
    commonWords: ['de', 'que', 'e', 'o', 'a', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está']
  },
  nl: {
    name: 'Dutch',
    patterns: [/\b(de|het|een|van|en|in|is|dat|op|te|zijn|voor|met|die|niet|aan|er|ook|om|maar|als|bij|nog|wel|naar|kunnen|worden|hebben)\b/gi],
    commonWords: ['de', 'van', 'een', 'het', 'en', 'in', 'is', 'dat', 'op', 'te', 'zijn', 'voor', 'met', 'die', 'niet', 'aan', 'er', 'ook', 'om', 'maar', 'als', 'bij', 'nog', 'wel', 'naar', 'dan', 'kan', 'dit', 'wat', 'door', 'worden', 'over', 'of', 'zo', 'nu', 'al', 'geen', 'uit', 'tot', 'meer']
  },
  ja: {
    name: 'Japanese',
    patterns: [/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g],
    commonWords: []
  },
  ko: {
    name: 'Korean',
    patterns: [/[\uAC00-\uD7AF\u1100-\u11FF]/g],
    commonWords: []
  },
  zh: {
    name: 'Chinese',
    patterns: [/[\u4E00-\u9FFF]/g],
    commonWords: []
  },
  ar: {
    name: 'Arabic',
    patterns: [/[\u0600-\u06FF]/g],
    commonWords: []
  },
  ru: {
    name: 'Russian',
    patterns: [/[\u0400-\u04FF]/g],
    commonWords: []
  },
  hi: {
    name: 'Hindi',
    patterns: [/[\u0900-\u097F]/g],
    commonWords: []
  }
}

function detectLanguage(text: string): { language: string; confidence: number; scores: Record<string, number> }[] {
  const cleanText = text.toLowerCase().trim()
  if (!cleanText) return []

  const scores: Record<string, number> = {}
  const words = cleanText.split(/\s+/)
  const totalWords = words.length

  // Calculate scores for each language
  for (const [langCode, langData] of Object.entries(LANGUAGE_PATTERNS)) {
    let score = 0

    // Check patterns (for non-Latin scripts)
    for (const pattern of langData.patterns) {
      const matches = cleanText.match(pattern)
      if (matches) {
        score += matches.length * (langData.commonWords.length === 0 ? 3 : 1)
      }
    }

    // Check common words (for Latin scripts)
    if (langData.commonWords.length > 0) {
      for (const word of words) {
        if (langData.commonWords.includes(word)) {
          score += 2
        }
      }
    }

    scores[langCode] = score
  }

  // Calculate total score
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  // Convert to results with confidence
  const results = Object.entries(scores)
    .map(([code, score]) => ({
      language: LANGUAGE_PATTERNS[code].name,
      code,
      confidence: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
      score
    }))
    .filter(r => r.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)

  return results.map(r => ({
    language: r.language,
    confidence: r.confidence,
    scores
  }))
}

export function LanguageDetector() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => detectLanguage(text), [text])

  const copyResult = async () => {
    if (results.length === 0) return
    const resultText = results.map(r => `${r.language}: ${r.confidence}%`).join('\n')
    await navigator.clipboard.writeText(resultText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Language Detector</h1>
        <p className="text-muted-foreground">Automatically detect the language of any text</p>
      </div>

      <div className="bg-card rounded-xl p-6 border space-y-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Enter Text
            </label>
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
            placeholder="Type or paste text in any language..."
            className="w-full h-40 px-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="text-right text-xs text-muted-foreground mt-1">
            {text.length} characters • {text.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Sample Texts */}
        <div>
          <p className="text-sm font-medium mb-2">Try a sample:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { lang: 'English', text: 'Hello, how are you today? I hope you are doing well.' },
              { lang: 'Indonesian', text: 'Selamat pagi, apa kabar? Semoga hari ini menyenangkan.' },
              { lang: 'Spanish', text: 'Hola, ¿cómo estás? Espero que tengas un buen día.' },
              { lang: 'French', text: 'Bonjour, comment allez-vous? J\'espère que vous allez bien.' },
              { lang: 'German', text: 'Guten Tag, wie geht es Ihnen? Ich hoffe, es geht Ihnen gut.' },
            ].map(sample => (
              <button
                key={sample.lang}
                onClick={() => setText(sample.text)}
                className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {sample.lang}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Detection Results</h3>
              <button
                onClick={copyResult}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Primary Result */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-primary">{results[0].language}</span>
                <span className="text-2xl font-bold text-primary">{results[0].confidence}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${results[0].confidence}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {/* Other Possibilities */}
            {results.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Other possibilities:</p>
                {results.slice(1).map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span>{result.language}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-muted-foreground/50 rounded-full"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{result.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Supported Languages */}
        <div className="p-4 bg-blue-500/10 rounded-lg text-sm">
          <p className="font-semibold text-blue-600 mb-2">Supported Languages</p>
          <p className="text-muted-foreground">
            English, Indonesian, Spanish, French, German, Italian, Portuguese, Dutch, Japanese, Korean, Chinese, Arabic, Russian, Hindi
          </p>
        </div>
      </div>
    </motion.div>
  )
}
