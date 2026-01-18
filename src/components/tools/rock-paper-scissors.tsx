'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hand, Scissors, FileText, Trophy, RotateCcw,
  User, Cpu, Minus, TrendingUp
} from 'lucide-react'

type Choice = 'rock' | 'paper' | 'scissors'
type Result = 'win' | 'lose' | 'draw'

interface GameRound {
  playerChoice: Choice
  computerChoice: Choice
  result: Result
}

interface Stats {
  wins: number
  losses: number
  draws: number
  streak: number
  bestStreak: number
}

const CHOICES: { [key in Choice]: { icon: any; beats: Choice; color: string } } = {
  rock: { icon: Hand, beats: 'scissors', color: 'bg-red-500' },
  paper: { icon: FileText, beats: 'rock', color: 'bg-blue-500' },
  scissors: { icon: Scissors, beats: 'paper', color: 'bg-green-500' }
}

const CHOICE_NAMES: { [key in Choice]: string } = {
  rock: '✊ Rock',
  paper: '✋ Paper',
  scissors: '✌️ Scissors'
}

export function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [stats, setStats] = useState<Stats>({
    wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0
  })
  const [history, setHistory] = useState<GameRound[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('rps-stats')
    if (saved) {
      setStats(JSON.parse(saved))
    }
    const savedHistory = localStorage.getItem('rps-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveStats = (newStats: Stats) => {
    setStats(newStats)
    localStorage.setItem('rps-stats', JSON.stringify(newStats))
  }

  const saveHistory = (newHistory: GameRound[]) => {
    const trimmedHistory = newHistory.slice(-10)
    setHistory(trimmedHistory)
    localStorage.setItem('rps-history', JSON.stringify(trimmedHistory))
  }

  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors']
    return choices[Math.floor(Math.random() * choices.length)]
  }

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'draw'
    if (CHOICES[player].beats === computer) return 'win'
    return 'lose'
  }

  const play = (choice: Choice) => {
    if (isPlaying) return

    setPlayerChoice(choice)
    setIsPlaying(true)
    setCountdown(3)
    setComputerChoice(null)
    setResult(null)

    // Countdown animation
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)

          // Make computer choice
          const compChoice = getComputerChoice()
          setComputerChoice(compChoice)

          // Determine result
          const gameResult = determineWinner(choice, compChoice)
          setResult(gameResult)

          // Update stats
          const newStats = { ...stats }
          if (gameResult === 'win') {
            newStats.wins++
            newStats.streak++
            if (newStats.streak > newStats.bestStreak) {
              newStats.bestStreak = newStats.streak
            }
          } else if (gameResult === 'lose') {
            newStats.losses++
            newStats.streak = 0
          } else {
            newStats.draws++
          }
          saveStats(newStats)

          // Update history
          saveHistory([...history, { playerChoice: choice, computerChoice: compChoice, result: gameResult }])

          setIsPlaying(false)
          return 0
        }
        return prev - 1
      })
    }, 500)
  }

  const resetStats = () => {
    const newStats = { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 }
    saveStats(newStats)
    saveHistory([])
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
  }

  const totalGames = stats.wins + stats.losses + stats.draws
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex items-center gap-2 bg-green-500/20 rounded-lg px-4 py-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold">{stats.wins}</span>
            <span className="text-white/50">Wins</span>
          </div>
          <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-4 py-2">
            <Minus className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-bold">{stats.losses}</span>
            <span className="text-white/50">Losses</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-500/20 rounded-lg px-4 py-2">
            <span className="text-gray-400 font-bold">{stats.draws}</span>
            <span className="text-white/50">Draws</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/20 rounded-lg px-4 py-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold">{winRate}%</span>
            <span className="text-white/50">Win Rate</span>
          </div>
        </div>

        {/* Game arena */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Player side */}
          <div className="text-center">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <User className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">You</span>
            </div>
            <motion.div
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                playerChoice ? CHOICES[playerChoice].color : 'bg-white/10'
              }`}
              animate={isPlaying && countdown > 0 ? {
                rotate: [0, -10, 10, -10, 10, 0],
                y: [0, -10, 0, -10, 0]
              } : {}}
              transition={{ duration: 0.5, repeat: isPlaying && countdown > 0 ? Infinity : 0 }}
            >
              {playerChoice ? (
                <span className="text-5xl">
                  {playerChoice === 'rock' ? '✊' : playerChoice === 'paper' ? '✋' : '✌️'}
                </span>
              ) : (
                <span className="text-4xl text-white/30">?</span>
              )}
            </motion.div>
          </div>

          {/* VS / Countdown */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              {isPlaying && countdown > 0 ? (
                <motion.div
                  key="countdown"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="text-4xl font-bold text-yellow-400"
                >
                  {countdown}
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-2xl font-bold ${
                    result === 'win' ? 'text-green-400' :
                    result === 'lose' ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {result === 'win' ? 'WIN!' : result === 'lose' ? 'LOSE' : 'DRAW'}
                </motion.div>
              ) : (
                <motion.div
                  key="vs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-white/50"
                >
                  VS
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Computer side */}
          <div className="text-center">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Cpu className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Computer</span>
            </div>
            <motion.div
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                computerChoice ? CHOICES[computerChoice].color : 'bg-white/10'
              }`}
              animate={isPlaying && countdown > 0 ? {
                rotate: [0, 10, -10, 10, -10, 0],
                y: [0, -10, 0, -10, 0]
              } : {}}
              transition={{ duration: 0.5, repeat: isPlaying && countdown > 0 ? Infinity : 0 }}
            >
              {computerChoice ? (
                <span className="text-5xl">
                  {computerChoice === 'rock' ? '✊' : computerChoice === 'paper' ? '✋' : '✌️'}
                </span>
              ) : (
                <span className="text-4xl text-white/30">?</span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Choice buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {(Object.keys(CHOICES) as Choice[]).map((choice) => {
            const Icon = CHOICES[choice].icon
            return (
              <motion.button
                key={choice}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => play(choice)}
                disabled={isPlaying}
                className={`
                  w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-2
                  transition-all ${CHOICES[choice].color} text-white
                  ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                `}
              >
                <span className="text-3xl">
                  {choice === 'rock' ? '✊' : choice === 'paper' ? '✋' : '✌️'}
                </span>
                <span className="text-xs font-medium capitalize">{choice}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Streak indicator */}
        {stats.streak > 0 && (
          <div className="text-center mb-6">
            <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium">
              🔥 {stats.streak} Win Streak! (Best: {stats.bestStreak})
            </span>
          </div>
        )}

        {/* Reset button */}
        <div className="text-center">
          <button
            onClick={resetStats}
            className="text-white/50 hover:text-white/70 text-sm flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Stats
          </button>
        </div>

        {/* Recent history */}
        {history.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-4">Recent Games</h3>
            <div className="flex gap-2 flex-wrap justify-center">
              {history.slice(-10).map((round, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    round.result === 'win' ? 'bg-green-500/20' :
                    round.result === 'lose' ? 'bg-red-500/20' : 'bg-gray-500/20'
                  }`}
                  title={`You: ${round.playerChoice}, Computer: ${round.computerChoice}`}
                >
                  {round.result === 'win' ? '✓' : round.result === 'lose' ? '✗' : '−'}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
