'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, Square, Settings, Download, Languages } from 'lucide-react'

interface Voice {
  voice: SpeechSynthesisVoice
  name: string
  lang: string
}

export function TextToSpeech() {
  const [text, setText] = useState('')
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      const voiceList = availableVoices.map(voice => ({
        voice,
        name: voice.name,
        lang: voice.lang
      }))
      setVoices(voiceList)
      if (voiceList.length > 0 && !selectedVoice) {
        // Try to find English voice first
        const englishVoice = voiceList.find(v => v.lang.startsWith('en'))
        setSelectedVoice(englishVoice?.name || voiceList[0].name)
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  const speak = () => {
    if (!text.trim()) return

    if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
      return
    }

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) utterance.voice = voice.voice

    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }

  const pause = () => {
    speechSynthesis.pause()
    setIsPaused(true)
  }

  const stop = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0]
    if (!acc[lang]) acc[lang] = []
    acc[lang].push(voice)
    return acc
  }, {} as Record<string, Voice[]>)

  const sampleTexts = [
    "Hello! Welcome to my portfolio website. I'm excited to show you what I can do.",
    "The quick brown fox jumps over the lazy dog.",
    "Technology is best when it brings people together.",
    "Innovation distinguishes between a leader and a follower."
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-500 text-sm font-medium mb-4">
          <Volume2 className="w-4 h-4" />
          Web Speech API
        </div>
        <h2 className="text-3xl font-bold mb-2">Text to Speech</h2>
        <p className="text-muted-foreground">
          Convert text to natural-sounding speech using browser speech synthesis.
        </p>
      </div>

      <div className="space-y-6">
        {/* Text Input */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full h-40 p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={5000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {text.length}/5000
            </div>
          </div>

          {/* Sample Texts */}
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, i) => (
              <button
                key={i}
                onClick={() => setText(sample)}
                className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-accent transition-colors"
              >
                Sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selection */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              <span className="font-medium">Voice Settings</span>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Select */}
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background"
              >
                {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                  <optgroup key={lang} label={lang.toUpperCase()}>
                    {langVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Advanced Settings */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-border"
              >
                {/* Rate */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label>Speed</label>
                    <span className="text-muted-foreground">{rate.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Pitch */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label>Pitch</label>
                    <span className="text-muted-foreground">{pitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Volume */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label>Volume</label>
                    <span className="text-muted-foreground">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex justify-center gap-4">
          {!isSpeaking ? (
            <button
              onClick={speak}
              disabled={!text.trim() || voices.length === 0}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Speak
            </button>
          ) : (
            <>
              <button
                onClick={isPaused ? speak : pause}
                className="px-6 py-4 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 inline-flex items-center gap-2"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stop}
                className="px-6 py-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 inline-flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop
              </button>
            </>
          )}
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-primary"
              />
              <span className="text-sm text-primary">
                {isPaused ? 'Paused' : 'Speaking...'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Voice Count */}
        <div className="text-center text-sm text-muted-foreground">
          {voices.length} voices available
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> Uses browser's built-in speech synthesis. No data sent to servers.
        </p>
      </div>
    </div>
  )
}
