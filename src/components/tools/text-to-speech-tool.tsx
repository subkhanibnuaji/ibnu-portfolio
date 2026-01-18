'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Volume2, VolumeX, Play, Pause, Square, Settings,
  Download, Copy, Check
} from 'lucide-react'

interface VoiceOption {
  voice: SpeechSynthesisVoice
  name: string
  lang: string
}

export function TextToSpeech() {
  const [text, setText] = useState('')
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      const voiceOptions = availableVoices.map(voice => ({
        voice,
        name: voice.name,
        lang: voice.lang
      }))
      setVoices(voiceOptions)
      if (voiceOptions.length > 0 && !selectedVoice) {
        // Try to find English voice first
        const englishVoice = voiceOptions.find(v => v.lang.startsWith('en'))
        setSelectedVoice(englishVoice?.name || voiceOptions[0].name)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = () => {
    if (!text.trim()) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find(v => v.name === selectedVoice)?.voice
    if (voice) utterance.voice = voice

    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (isPlaying && isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presetTexts = [
    "Hello! Welcome to this text-to-speech tool. You can type any text and hear it spoken aloud.",
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower.",
    "In the middle of difficulty lies opportunity. Life is what happens when you're busy making other plans."
  ]

  // Group voices by language
  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0].toUpperCase()
    if (!acc[lang]) acc[lang] = []
    acc[lang].push(voice)
    return acc
  }, {} as Record<string, VoiceOption[]>)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Text Input */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">Enter text to speak</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full h-40 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex justify-between mt-2">
            <span className="text-white/50 text-sm">{text.length} characters</span>
            <button
              onClick={copyText}
              className="text-white/50 hover:text-white text-sm flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">Quick examples</label>
          <div className="flex flex-wrap gap-2">
            {presetTexts.map((preset, i) => (
              <button
                key={i}
                onClick={() => setText(preset)}
                className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm hover:bg-white/20 truncate max-w-[200px]"
              >
                {preset.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                <optgroup key={lang} label={lang}>
                  {langVoices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Rate: {rate}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Pitch: {pitch}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Volume: {Math.round(volume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={speak}
              disabled={!text.trim()}
              className="px-8 py-3 bg-green-500 text-white rounded-xl flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              Speak
            </motion.button>
          ) : (
            <>
              {isPaused ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resume}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Resume
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pause}
                  className="px-6 py-3 bg-yellow-500 text-black rounded-xl flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stop}
                className="px-6 py-3 bg-red-500 text-white rounded-xl flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop
              </motion.button>
            </>
          )}
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-green-500 rounded-full"
                  animate={{
                    height: isPaused ? 8 : [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPaused ? 0 : Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <span className="text-white/70 text-sm ml-2">
              {isPaused ? 'Paused' : 'Speaking...'}
            </span>
          </div>
        )}

        {/* Voice count */}
        <div className="mt-6 text-center text-white/50 text-sm">
          {voices.length} voices available in {Object.keys(groupedVoices).length} languages
        </div>
      </motion.div>
    </div>
  )
}
