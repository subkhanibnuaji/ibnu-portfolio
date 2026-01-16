'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Copy, Check, Trash2, Download, Globe } from 'lucide-react'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'ru-RU', name: 'Russian' },
]

export function SpeechToText() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [language, setLanguage] = useState('en-US')
  const [copied, setCopied] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognitionAPI) {
        setIsSupported(false)
        return
      }

      const recognition = new SpeechRecognitionAPI()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimText = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimText += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
        }
        setInterimTranscript(interimText)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start()
          } catch (e) {
            setIsListening(false)
          }
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript('')
    } else {
      setError(null)
      recognitionRef.current.lang = language
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (e) {
        setError('Failed to start recognition')
      }
    }
  }, [isListening, language])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(transcript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearTranscript = () => {
    setTranscript('')
    setInterimTranscript('')
  }

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isSupported) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Speech to Text</h1>
          <p className="text-muted-foreground">Convert spoken words to text in real-time</p>
        </div>
        <div className="bg-card rounded-xl p-8 border text-center">
          <MicOff className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Not Supported</h2>
          <p className="text-muted-foreground">
            Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Speech to Text</h1>
        <p className="text-muted-foreground">Convert spoken words to text in real-time using Web Speech API</p>
      </div>

      <div className="bg-card rounded-xl p-6 border space-y-6">
        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isListening}
            className="w-full px-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={toggleListening}
            whileTap={{ scale: 0.95 }}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}

            {/* Pulse Animation */}
            {isListening && (
              <>
                <motion.span
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-500"
                />
                <motion.span
                  animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 rounded-full bg-red-500"
                />
              </>
            )}
          </motion.button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isListening ? 'Listening... Click to stop' : 'Click the microphone to start'}
        </p>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            Error: {error}
          </div>
        )}

        {/* Transcript Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Transcript</label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!transcript}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadTranscript}
                disabled={!transcript}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={clearTranscript}
                disabled={!transcript && !interimTranscript}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="min-h-[200px] p-4 bg-muted/50 rounded-lg border border-border">
            {transcript || interimTranscript ? (
              <p className="whitespace-pre-wrap">
                {transcript}
                <span className="text-muted-foreground">{interimTranscript}</span>
              </p>
            ) : (
              <p className="text-muted-foreground text-center mt-16">
                Your speech will appear here...
              </p>
            )}
          </div>
        </div>

        {/* Word Count */}
        {transcript && (
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>{transcript.split(/\s+/).filter(Boolean).length} words</span>
            <span>{transcript.length} characters</span>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-500/10 rounded-lg text-sm">
          <p className="text-blue-600 font-medium mb-1">Privacy Note</p>
          <p className="text-muted-foreground">
            Speech recognition is processed by your browser. Audio data may be sent to Google
            (Chrome) or Apple (Safari) servers for processing. No data is stored on our servers.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
