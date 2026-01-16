'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Home,
  User,
  FolderKanban,
  BookOpen,
  Mail,
  Brain,
  Gamepad2,
  Award,
  Terminal,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceCommand {
  phrases: string[]
  action: () => void
  description: string
  icon: React.ElementType
}

type ListeningState = 'idle' | 'listening' | 'processing' | 'success' | 'error'

export function VoiceCommands() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [listeningState, setListeningState] = useState<ListeningState>('idle')
  const [transcript, setTranscript] = useState('')
  const [matchedCommand, setMatchedCommand] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  const commands: VoiceCommand[] = [
    {
      phrases: ['go home', 'home', 'go to home', 'homepage'],
      action: () => router.push('/'),
      description: 'Go to homepage',
      icon: Home,
    },
    {
      phrases: ['about', 'go to about', 'about me', 'who are you'],
      action: () => router.push('/about'),
      description: 'Go to About page',
      icon: User,
    },
    {
      phrases: ['projects', 'go to projects', 'show projects', 'portfolio'],
      action: () => router.push('/projects'),
      description: 'Go to Projects',
      icon: FolderKanban,
    },
    {
      phrases: ['blog', 'go to blog', 'articles', 'posts'],
      action: () => router.push('/blog'),
      description: 'Go to Blog',
      icon: BookOpen,
    },
    {
      phrases: ['contact', 'go to contact', 'get in touch', 'reach out'],
      action: () => router.push('/contact'),
      description: 'Go to Contact',
      icon: Mail,
    },
    {
      phrases: ['ai tools', 'artificial intelligence', 'go to ai', 'machine learning'],
      action: () => router.push('/ai-tools'),
      description: 'Go to AI Tools',
      icon: Brain,
    },
    {
      phrases: ['games', 'play games', 'tools', 'utilities'],
      action: () => router.push('/tools'),
      description: 'Go to Tools & Games',
      icon: Gamepad2,
    },
    {
      phrases: ['certifications', 'certificates', 'credentials', 'badges'],
      action: () => router.push('/certifications'),
      description: 'Go to Certifications',
      icon: Award,
    },
    {
      phrases: ['open terminal', 'terminal', 'command line'],
      action: () => {
        const event = new KeyboardEvent('keydown', { key: 't' })
        document.dispatchEvent(event)
        window.dispatchEvent(new CustomEvent('terminalOpened'))
      },
      description: 'Open Terminal',
      icon: Terminal,
    },
    {
      phrases: ['dark mode', 'light mode', 'toggle theme', 'switch theme'],
      action: () => {
        window.dispatchEvent(new CustomEvent('themeChanged'))
        document.documentElement.classList.toggle('dark')
      },
      description: 'Toggle Theme',
      icon: Settings,
    },
  ]

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript.toLowerCase()
        setTranscript(transcriptText)

        if (event.results[current].isFinal) {
          processCommand(transcriptText)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error === 'no-speech' ? 'No speech detected' : 'Error: ' + event.error)
        setListeningState('error')
        setTimeout(() => {
          setListeningState('idle')
          setError(null)
        }, 2000)
      }

      recognitionRef.current.onend = () => {
        if (listeningState === 'listening') {
          setListeningState('idle')
        }
      }
    }
  }, [])

  const processCommand = useCallback((text: string) => {
    setListeningState('processing')

    // Find matching command
    for (const command of commands) {
      for (const phrase of command.phrases) {
        if (text.includes(phrase)) {
          setMatchedCommand(command.description)
          setListeningState('success')

          // Trigger achievement
          window.dispatchEvent(new CustomEvent('achievementUnlocked', {
            detail: { id: 'voice_commander' }
          }))

          setTimeout(() => {
            command.action()
            setIsOpen(false)
            setListeningState('idle')
            setTranscript('')
            setMatchedCommand(null)
          }, 1000)
          return
        }
      }
    }

    // No match found
    setError('Command not recognized')
    setListeningState('error')
    setTimeout(() => {
      setListeningState('idle')
      setError(null)
      setTranscript('')
    }, 2000)
  }, [commands, router])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return

    setTranscript('')
    setError(null)
    setMatchedCommand(null)
    setListeningState('listening')

    try {
      recognitionRef.current.start()
    } catch (e) {
      // Already started
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    recognitionRef.current.stop()
    setListeningState('idle')
  }, [])

  // Keyboard shortcut to open voice commands
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isSupported) return null

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-40 flex items-center gap-2 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all group"
        title="Voice Commands (Ctrl+V)"
      >
        <Mic className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                stopListening()
                setIsOpen(false)
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 text-center border-b border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                      Voice Commands
                    </h2>
                    <button
                      onClick={() => {
                        stopListening()
                        setIsOpen(false)
                      }}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Microphone Button */}
                  <motion.button
                    onClick={listeningState === 'listening' ? stopListening : startListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all',
                      listeningState === 'listening'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500'
                        : listeningState === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : listeningState === 'error'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                    )}
                  >
                    {/* Pulse animation when listening */}
                    {listeningState === 'listening' && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-500"
                          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-500"
                          animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                        />
                      </>
                    )}

                    {listeningState === 'listening' ? (
                      <MicOff className="h-10 w-10 text-white relative z-10" />
                    ) : listeningState === 'processing' ? (
                      <Loader2 className="h-10 w-10 text-white animate-spin" />
                    ) : listeningState === 'success' ? (
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    ) : listeningState === 'error' ? (
                      <AlertCircle className="h-10 w-10 text-white" />
                    ) : (
                      <Mic className="h-10 w-10 text-white" />
                    )}
                  </motion.button>

                  {/* Status text */}
                  <p className="mt-4 text-sm text-muted-foreground">
                    {listeningState === 'listening'
                      ? 'Listening... Say a command'
                      : listeningState === 'processing'
                      ? 'Processing...'
                      : listeningState === 'success'
                      ? matchedCommand
                      : listeningState === 'error'
                      ? error
                      : 'Click to start voice command'}
                  </p>

                  {/* Transcript */}
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <p className="text-sm font-medium text-foreground">"{transcript}"</p>
                    </motion.div>
                  )}
                </div>

                {/* Available Commands */}
                <div className="p-4 max-h-64 overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Available Commands
                  </p>
                  <div className="space-y-2">
                    {commands.slice(0, 6).map((command, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <command.icon className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{command.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Say: "{command.phrases[0]}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50 bg-muted/30">
                  <p className="text-xs text-center text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">Ctrl+V</kbd>
                    {' '}to open voice commands
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
