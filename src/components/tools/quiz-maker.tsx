'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Play, CheckCircle, XCircle,
  Trophy, RotateCcw, Edit2, Save, BookOpen
} from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
  createdAt: Date
}

interface QuizResult {
  quizId: string
  score: number
  total: number
  answers: number[]
  date: Date
}

export function QuizMaker() {
  const [mode, setMode] = useState<'create' | 'play' | 'results'>('create')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  // Create mode state
  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', '', '', ''])
  const [newCorrectIndex, setNewCorrectIndex] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('quizzes')
    if (saved) {
      const parsed = JSON.parse(saved)
      setQuizzes(parsed.map((q: any) => ({ ...q, createdAt: new Date(q.createdAt) })))
    }
  }, [])

  const saveQuizzes = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes)
    localStorage.setItem('quizzes', JSON.stringify(newQuizzes))
  }

  const addQuestion = () => {
    if (!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2) {
      alert('Please enter a question and at least 2 options')
      return
    }

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      options: newOptions.filter(o => o.trim()),
      correctIndex: newCorrectIndex
    }

    setQuestions([...questions, question])
    resetQuestionForm()
  }

  const resetQuestionForm = () => {
    setNewQuestion('')
    setNewOptions(['', '', '', ''])
    setNewCorrectIndex(0)
    setEditingQuestion(null)
  }

  const editQuestion = (question: Question) => {
    setEditingQuestion(question)
    setNewQuestion(question.question)
    setNewOptions([...question.options, '', '', '', ''].slice(0, 4))
    setNewCorrectIndex(question.correctIndex)
  }

  const updateQuestion = () => {
    if (!editingQuestion || !newQuestion.trim()) return

    const updated: Question = {
      ...editingQuestion,
      question: newQuestion.trim(),
      options: newOptions.filter(o => o.trim()),
      correctIndex: newCorrectIndex
    }

    setQuestions(questions.map(q => q.id === editingQuestion.id ? updated : q))
    resetQuestionForm()
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const saveQuiz = () => {
    if (!quizTitle.trim() || questions.length === 0) {
      alert('Please enter a title and add at least one question')
      return
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      title: quizTitle.trim(),
      questions: [...questions],
      createdAt: new Date()
    }

    const newQuizzes = [quiz, ...quizzes]
    saveQuizzes(newQuizzes)

    setQuizTitle('')
    setQuestions([])
    resetQuestionForm()
  }

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowAnswer(false)
    setQuizComplete(false)
    setMode('play')
  }

  const selectAnswer = (answerIndex: number) => {
    if (showAnswer) return

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    if (!currentQuiz) return

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowAnswer(false)
    } else {
      setQuizComplete(true)
      setMode('results')
    }
  }

  const calculateScore = () => {
    if (!currentQuiz) return 0
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === currentQuiz.questions[index].correctIndex ? 1 : 0)
    }, 0)
  }

  const restartQuiz = () => {
    if (!currentQuiz) return
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowAnswer(false)
    setQuizComplete(false)
    setMode('play')
  }

  const deleteQuiz = (quizId: string) => {
    const newQuizzes = quizzes.filter(q => q.id !== quizId)
    saveQuizzes(newQuizzes)
  }

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]
  const score = calculateScore()
  const percentage = currentQuiz ? Math.round((score / currentQuiz.questions.length) * 100) : 0

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
            onClick={() => { setMode('create'); setCurrentQuiz(null); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Create Quiz
          </button>
          <button
            onClick={() => { setMode('play'); setCurrentQuiz(null); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'play' && !currentQuiz
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Play Quiz
          </button>
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
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Quiz Title"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 text-xl font-medium"
                />

                {/* Current questions */}
                {questions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-white/70 text-sm">Questions ({questions.length})</h3>
                    {questions.map((q, index) => (
                      <div
                        key={q.id}
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                      >
                        <span className="text-white/50">{index + 1}.</span>
                        <span className="text-white flex-1 truncate">{q.question}</span>
                        <button
                          onClick={() => editQuestion(q)}
                          className="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add/Edit question form */}
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-medium">
                    {editingQuestion ? 'Edit Question' : 'Add Question'}
                  </h3>

                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter your question"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                  />

                  <div className="space-y-2">
                    {newOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          onClick={() => setNewCorrectIndex(index)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                            newCorrectIndex === index
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-white/30 text-white/30 hover:border-white/50'
                          }`}
                        >
                          {newCorrectIndex === index && <CheckCircle className="w-5 h-5" />}
                        </button>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOpts = [...newOptions]
                            newOpts[index] = e.target.value
                            setNewOptions(newOpts)
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-white/50 text-sm">Click the circle to mark the correct answer</p>

                  <div className="flex gap-2">
                    {editingQuestion ? (
                      <>
                        <button
                          onClick={updateQuestion}
                          className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Update Question
                        </button>
                        <button
                          onClick={resetQuestionForm}
                          className="py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={addQuestion}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Question
                      </button>
                    )}
                  </div>
                </div>

                {questions.length > 0 && (
                  <button
                    onClick={saveQuiz}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Save Quiz
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Play Mode - Quiz Selection */}
          {mode === 'play' && !currentQuiz && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {quizzes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <p className="text-white/50">No quizzes yet. Create one first!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-white font-medium mb-4">Select a Quiz</h3>
                  {quizzes.map(quiz => (
                    <div
                      key={quiz.id}
                      className="flex items-center gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => startQuiz(quiz)}>
                        <div className="text-white font-medium">{quiz.title}</div>
                        <div className="text-white/50 text-sm">{quiz.questions.length} questions</div>
                      </div>
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Play Mode - Active Quiz */}
          {mode === 'play' && currentQuiz && currentQuestion && !quizComplete && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-white/70 text-sm mb-2">
                  <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = userAnswers[currentQuestionIndex] === index
                  const isCorrect = index === currentQuestion.correctIndex
                  const showCorrectness = showAnswer

                  return (
                    <motion.button
                      key={index}
                      whileHover={!showAnswer ? { scale: 1.01 } : {}}
                      whileTap={!showAnswer ? { scale: 0.99 } : {}}
                      onClick={() => selectAnswer(index)}
                      disabled={showAnswer}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                        showCorrectness
                          ? isCorrect
                            ? 'border-green-500 bg-green-500/20'
                            : isSelected
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-white/20 bg-white/5'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          showCorrectness
                            ? isCorrect
                              ? 'border-green-500 bg-green-500'
                              : isSelected
                              ? 'border-red-500 bg-red-500'
                              : 'border-white/40'
                            : isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-white/40'
                        }`}>
                          {showCorrectness && isCorrect && <CheckCircle className="w-5 h-5 text-white" />}
                          {showCorrectness && !isCorrect && isSelected && <XCircle className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-white">{option}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Next button */}
              {showAnswer && (
                <button
                  onClick={nextQuestion}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </motion.div>
          )}

          {/* Results Mode */}
          {mode === 'results' && currentQuiz && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Trophy className={`w-20 h-20 mx-auto mb-4 ${
                percentage >= 80 ? 'text-yellow-400' :
                percentage >= 50 ? 'text-blue-400' : 'text-red-400'
              }`} />

              <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-white/70 mb-6">{currentQuiz.title}</p>

              <div className="text-6xl font-bold mb-2">
                <span className={
                  percentage >= 80 ? 'text-green-400' :
                  percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                }>
                  {score}
                </span>
                <span className="text-white/30">/{currentQuiz.questions.length}</span>
              </div>

              <p className="text-2xl text-white/70 mb-8">{percentage}% Correct</p>

              <p className="text-white/50 mb-6">
                {percentage === 100 ? 'Perfect score! Amazing!' :
                 percentage >= 80 ? 'Great job!' :
                 percentage >= 50 ? 'Good effort!' :
                 'Keep practicing!'}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => { setCurrentQuiz(null); setMode('play'); }}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Other Quizzes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
