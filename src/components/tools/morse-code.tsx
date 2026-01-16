'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Volume2, Copy, Check, Trash2 } from 'lucide-react'

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
}

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
)

export function MorseCodeTranslator() {
  const [text, setText] = useState('')
  const [morse, setMorse] = useState('')
  const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse')
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContext = useRef<AudioContext | null>(null)

  const textToMorse = (input: string): string => {
    return input
      .toUpperCase()
      .split('')
      .map(char => MORSE_CODE[char] || char)
      .join(' ')
  }

  const morseToText = (input: string): string => {
    return input
      .split(' ')
      .map(code => {
        if (code === '/') return ' '
        return REVERSE_MORSE[code] || code
      })
      .join('')
  }

  const handleTextChange = (value: string) => {
    setText(value)
    if (mode === 'textToMorse') {
      setMorse(textToMorse(value))
    }
  }

  const handleMorseChange = (value: string) => {
    setMorse(value)
    if (mode === 'morseToText') {
      setText(morseToText(value))
    }
  }

  const toggleMode = () => {
    if (mode === 'textToMorse') {
      setMode('morseToText')
      setText(morseToText(morse))
    } else {
      setMode('textToMorse')
      setMorse(textToMorse(text))
    }
  }

  const copyResult = () => {
    const textToCopy = mode === 'textToMorse' ? morse : text
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const playMorse = async () => {
    if (isPlaying || !morse) return
    setIsPlaying(true)

    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = audioContext.current
    const dotDuration = 0.1
    const dashDuration = 0.3
    const symbolGap = 0.1
    const letterGap = 0.3
    const wordGap = 0.7

    let time = ctx.currentTime

    for (const char of morse) {
      if (char === '.') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 600
        gain.gain.setValueAtTime(0.3, time)
        osc.start(time)
        osc.stop(time + dotDuration)
        time += dotDuration + symbolGap
      } else if (char === '-') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 600
        gain.gain.setValueAtTime(0.3, time)
        osc.start(time)
        osc.stop(time + dashDuration)
        time += dashDuration + symbolGap
      } else if (char === ' ') {
        time += letterGap
      } else if (char === '/') {
        time += wordGap
      }
    }

    setTimeout(() => setIsPlaying(false), (time - ctx.currentTime) * 1000)
  }

  const clear = () => {
    setText('')
    setMorse('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Morse Code Translator</h1>
        <p className="text-muted-foreground">Convert text to Morse code and back</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleMode}
            className="flex items-center gap-3 px-6 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <span className={mode === 'textToMorse' ? 'font-semibold' : 'text-muted-foreground'}>
              Text
            </span>
            <ArrowRightLeft className="w-5 h-5" />
            <span className={mode === 'morseToText' ? 'font-semibold' : 'text-muted-foreground'}>
              Morse
            </span>
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {mode === 'textToMorse' ? 'Enter Text' : 'Enter Morse Code'}
          </label>
          <textarea
            value={mode === 'textToMorse' ? text : morse}
            onChange={(e) => mode === 'textToMorse' ? handleTextChange(e.target.value) : handleMorseChange(e.target.value)}
            placeholder={mode === 'textToMorse' ? 'Type your message...' : 'Enter morse code (use . and -)...'}
            className="w-full h-32 px-4 py-3 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        {/* Output */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              {mode === 'textToMorse' ? 'Morse Code' : 'Text'}
            </label>
            <div className="flex gap-2">
              {mode === 'textToMorse' && morse && (
                <button
                  onClick={playMorse}
                  disabled={isPlaying}
                  className="p-2 bg-muted hover:bg-muted/80 rounded-lg disabled:opacity-50"
                  title="Play sound"
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-blue-500' : ''}`} />
                </button>
              )}
              <button
                onClick={copyResult}
                className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={clear}
                className="p-2 bg-muted hover:bg-muted/80 rounded-lg"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg min-h-[80px] font-mono text-lg break-all">
            {mode === 'textToMorse' ? morse || '—' : text || '—'}
          </div>
        </div>

        {/* Morse Code Reference */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Morse Code Reference</h3>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 text-sm">
            {Object.entries(MORSE_CODE).slice(0, 36).map(([char, code]) => (
              <div key={char} className="text-center p-1 bg-background rounded">
                <div className="font-bold">{char === ' ' ? '␣' : char}</div>
                <div className="text-xs text-muted-foreground font-mono">{code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• Use <code className="px-1 bg-muted rounded">.</code> for dot and <code className="px-1 bg-muted rounded">-</code> for dash</p>
          <p>• Separate letters with space, words with <code className="px-1 bg-muted rounded">/</code></p>
        </div>
      </div>
    </motion.div>
  )
}
