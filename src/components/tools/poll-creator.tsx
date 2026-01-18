'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Share2, Copy, Check, BarChart3,
  Vote, Users, Clock, RefreshCw
} from 'lucide-react'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  createdAt: Date
  multipleChoice: boolean
  showResults: boolean
}

export function PollCreator() {
  const [mode, setMode] = useState<'create' | 'vote' | 'results'>('create')
  const [polls, setPolls] = useState<Poll[]>([])
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null)
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [multipleChoice, setMultipleChoice] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('polls')
    if (saved) {
      const parsed = JSON.parse(saved)
      setPolls(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })))
    }
  }, [])

  const savePolls = (newPolls: Poll[]) => {
    setPolls(newPolls)
    localStorage.setItem('polls', JSON.stringify(newPolls))
  }

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const createPoll = () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) {
      alert('Please enter a question and at least 2 options')
      return
    }

    const newPoll: Poll = {
      id: Date.now().toString(),
      question: question.trim(),
      options: options
        .filter(o => o.trim())
        .map(text => ({
          id: Math.random().toString(36).substr(2, 9),
          text: text.trim(),
          votes: 0
        })),
      totalVotes: 0,
      createdAt: new Date(),
      multipleChoice,
      showResults: false
    }

    const newPolls = [newPoll, ...polls]
    savePolls(newPolls)
    setCurrentPoll(newPoll)
    setMode('vote')
    setQuestion('')
    setOptions(['', ''])
    setMultipleChoice(false)
  }

  const toggleOption = (optionId: string) => {
    if (hasVoted) return

    if (currentPoll?.multipleChoice) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  const submitVote = () => {
    if (!currentPoll || selectedOptions.length === 0) return

    const updatedPoll = {
      ...currentPoll,
      options: currentPoll.options.map(opt => ({
        ...opt,
        votes: selectedOptions.includes(opt.id) ? opt.votes + 1 : opt.votes
      })),
      totalVotes: currentPoll.totalVotes + 1
    }

    const newPolls = polls.map(p => p.id === updatedPoll.id ? updatedPoll : p)
    savePolls(newPolls)
    setCurrentPoll(updatedPoll)
    setHasVoted(true)
  }

  const viewResults = () => {
    setMode('results')
  }

  const sharePoll = () => {
    const shareText = `Poll: ${currentPoll?.question}\n\nOptions:\n${currentPoll?.options.map((o, i) => `${i + 1}. ${o.text}`).join('\n')}`

    if (navigator.share) {
      navigator.share({
        title: 'Poll',
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetPoll = () => {
    setSelectedOptions([])
    setHasVoted(false)
    setMode('vote')
  }

  const deletePoll = (pollId: string) => {
    const newPolls = polls.filter(p => p.id !== pollId)
    savePolls(newPolls)
    if (currentPoll?.id === pollId) {
      setCurrentPoll(null)
      setMode('create')
    }
  }

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Mode tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('create'); setCurrentPoll(null); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Create Poll
          </button>
          {currentPoll && (
            <>
              <button
                onClick={() => setMode('vote')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'vote'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Vote
              </button>
              <button
                onClick={() => setMode('results')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'results'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Results
              </button>
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* Create Mode */}
          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Question</label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to ask?"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Options</label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                        />
                        {options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {options.length < 10 && (
                    <button
                      onClick={addOption}
                      className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={multipleChoice}
                    onChange={(e) => setMultipleChoice(e.target.checked)}
                    className="w-5 h-5 rounded bg-white/10 border-white/20"
                  />
                  <span className="text-white/70">Allow multiple choices</span>
                </label>

                <button
                  onClick={createPoll}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Create Poll
                </button>
              </div>

              {/* Recent polls */}
              {polls.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium mb-4">Recent Polls</h3>
                  <div className="space-y-2">
                    {polls.slice(0, 5).map(poll => (
                      <div
                        key={poll.id}
                        className="flex items-center gap-4 bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10"
                        onClick={() => { setCurrentPoll(poll); setMode('vote'); setHasVoted(false); setSelectedOptions([]); }}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium truncate">{poll.question}</div>
                          <div className="flex items-center gap-4 text-white/50 text-sm">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {poll.totalVotes} votes
                            </span>
                            <span>{poll.options.length} options</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deletePoll(poll.id); }}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Vote Mode */}
          {mode === 'vote' && currentPoll && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-6">
                <Vote className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">{currentPoll.question}</h2>
                {currentPoll.multipleChoice && (
                  <p className="text-white/50 mt-2">Select multiple options</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {currentPoll.options.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleOption(option.id)}
                    disabled={hasVoted}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                      selectedOptions.includes(option.id)
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    } ${hasVoted ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOptions.includes(option.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-white/40'
                      }`}>
                        {selectedOptions.includes(option.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-white">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3">
                {!hasVoted ? (
                  <button
                    onClick={submitVote}
                    disabled={selectedOptions.length === 0}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Submit Vote
                  </button>
                ) : (
                  <>
                    <button
                      onClick={viewResults}
                      className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-5 h-5" />
                      View Results
                    </button>
                    <button
                      onClick={resetPoll}
                      className="py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </>
                )}

                <button
                  onClick={sharePoll}
                  className="py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Results Mode */}
          {mode === 'results' && currentPoll && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-6">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h2 className="text-2xl font-bold text-white">{currentPoll.question}</h2>
                <p className="text-white/50 mt-2 flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  {currentPoll.totalVotes} total votes
                </p>
              </div>

              <div className="space-y-4">
                {currentPoll.options
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, index) => {
                    const percentage = getPercentage(option.votes, currentPoll.totalVotes)
                    return (
                      <div key={option.id}>
                        <div className="flex justify-between text-white mb-1">
                          <span className="flex items-center gap-2">
                            {index === 0 && currentPoll.totalVotes > 0 && (
                              <span className="text-yellow-400">👑</span>
                            )}
                            {option.text}
                          </span>
                          <span className="text-white/70">{option.votes} votes ({percentage}%)</span>
                        </div>
                        <div className="h-8 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-full rounded-full ${
                              index === 0 ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-blue-500/50'
                            }`}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetPoll}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Vote Again
                </button>
                <button
                  onClick={sharePoll}
                  className="py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
