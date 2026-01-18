'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dumbbell, Plus, Trash2, Play, Pause, Check,
  Clock, Flame, Calendar, Trophy, RotateCcw, Timer
} from 'lucide-react'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  duration?: number // in seconds
  restTime: number // in seconds
  completed: boolean
}

interface Workout {
  id: string
  name: string
  exercises: Exercise[]
  createdAt: Date
  completedAt?: Date
  totalTime?: number
  caloriesBurned?: number
}

interface WorkoutHistory {
  date: Date
  workoutId: string
  workoutName: string
  duration: number
  exercises: number
}

const EXERCISE_PRESETS = [
  { name: 'Push-ups', sets: 3, reps: 15, restTime: 60 },
  { name: 'Squats', sets: 4, reps: 12, restTime: 90 },
  { name: 'Plank', sets: 3, reps: 1, duration: 60, restTime: 45 },
  { name: 'Lunges', sets: 3, reps: 10, restTime: 60 },
  { name: 'Burpees', sets: 3, reps: 10, restTime: 90 },
  { name: 'Mountain Climbers', sets: 3, reps: 20, restTime: 45 },
  { name: 'Jumping Jacks', sets: 3, reps: 30, restTime: 30 },
  { name: 'Deadlifts', sets: 4, reps: 8, weight: 60, restTime: 120 },
  { name: 'Bench Press', sets: 4, reps: 10, weight: 50, restTime: 90 },
  { name: 'Pull-ups', sets: 3, reps: 8, restTime: 90 }
]

export function WorkoutPlanner() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
  const [isWorking, setIsWorking] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [workoutTime, setWorkoutTime] = useState(0)
  const [history, setHistory] = useState<WorkoutHistory[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'workout' | 'history'>('list')

  // Create form state
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts')
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts).map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt)
      })))
    }
    const savedHistory = localStorage.getItem('workout-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((h: any) => ({
        ...h,
        date: new Date(h.date)
      })))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isWorking) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1)

        if (timeRemaining > 0) {
          setTimeRemaining(prev => prev - 1)
        } else if (isResting) {
          setIsResting(false)
          // Move to next set or exercise
          if (currentWorkout && currentExerciseIndex < currentWorkout.exercises.length) {
            const exercise = currentWorkout.exercises[currentExerciseIndex]
            if (currentSet < exercise.sets) {
              setCurrentSet(prev => prev + 1)
              if (exercise.duration) {
                setTimeRemaining(exercise.duration)
              }
            } else {
              // Move to next exercise
              if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1)
                setCurrentSet(1)
                const nextExercise = currentWorkout.exercises[currentExerciseIndex + 1]
                if (nextExercise.duration) {
                  setTimeRemaining(nextExercise.duration)
                }
              } else {
                // Workout complete
                completeWorkout()
              }
            }
          }
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isWorking, timeRemaining, isResting, currentWorkout, currentExerciseIndex, currentSet])

  const saveWorkouts = (newWorkouts: Workout[]) => {
    setWorkouts(newWorkouts)
    localStorage.setItem('workouts', JSON.stringify(newWorkouts))
  }

  const saveHistory = (newHistory: WorkoutHistory[]) => {
    setHistory(newHistory)
    localStorage.setItem('workout-history', JSON.stringify(newHistory))
  }

  const addExercise = (preset?: typeof EXERCISE_PRESETS[0]) => {
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: preset?.name || '',
      sets: preset?.sets || 3,
      reps: preset?.reps || 10,
      weight: preset?.weight,
      duration: preset?.duration,
      restTime: preset?.restTime || 60,
      completed: false
    }
    setExercises([...exercises, exercise])
  }

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id))
  }

  const saveWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) {
      alert('Please enter a workout name and add at least one exercise')
      return
    }

    const workout: Workout = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      exercises: exercises.map(e => ({ ...e, completed: false })),
      createdAt: new Date()
    }

    saveWorkouts([workout, ...workouts])
    setWorkoutName('')
    setExercises([])
    setMode('list')
  }

  const startWorkout = (workout: Workout) => {
    const workoutCopy: Workout = {
      ...workout,
      exercises: workout.exercises.map(e => ({ ...e, completed: false }))
    }
    setCurrentWorkout(workoutCopy)
    setCurrentExerciseIndex(0)
    setCurrentSet(1)
    setWorkoutTime(0)
    setIsResting(false)

    const firstExercise = workoutCopy.exercises[0]
    if (firstExercise.duration) {
      setTimeRemaining(firstExercise.duration)
    } else {
      setTimeRemaining(0)
    }

    setIsWorking(true)
    setMode('workout')
  }

  const completeSet = () => {
    if (!currentWorkout) return

    const exercise = currentWorkout.exercises[currentExerciseIndex]

    if (currentSet < exercise.sets) {
      setIsResting(true)
      setTimeRemaining(exercise.restTime)
    } else {
      // Mark exercise as complete
      const updatedExercises = [...currentWorkout.exercises]
      updatedExercises[currentExerciseIndex].completed = true
      setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises })

      if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        setIsResting(true)
        setTimeRemaining(exercise.restTime)
      } else {
        completeWorkout()
      }
    }
  }

  const completeWorkout = () => {
    if (!currentWorkout) return

    setIsWorking(false)

    const historyEntry: WorkoutHistory = {
      date: new Date(),
      workoutId: currentWorkout.id,
      workoutName: currentWorkout.name,
      duration: workoutTime,
      exercises: currentWorkout.exercises.length
    }

    saveHistory([historyEntry, ...history])

    alert(`Workout Complete! 🎉\nTime: ${formatTime(workoutTime)}\nExercises: ${currentWorkout.exercises.length}`)

    setMode('list')
    setCurrentWorkout(null)
  }

  const skipRest = () => {
    setTimeRemaining(0)
    setIsResting(false)
  }

  const deleteWorkout = (id: string) => {
    if (confirm('Delete this workout?')) {
      saveWorkouts(workouts.filter(w => w.id !== id))
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentExercise = currentWorkout?.exercises[currentExerciseIndex]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Navigation */}
        {mode !== 'workout' && (
          <div className="flex gap-2 mb-6">
            {['list', 'create', 'history'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as typeof mode)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  mode === m
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {m === 'list' ? 'Workouts' : m}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Workout List */}
          {mode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {workouts.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <p className="text-white/50 mb-4">No workouts yet</p>
                  <button
                    onClick={() => setMode('create')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg"
                  >
                    Create Workout
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {workouts.map(workout => (
                    <div
                      key={workout.id}
                      className="bg-white/5 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium text-lg">{workout.name}</h3>
                        <button
                          onClick={() => deleteWorkout(workout.id)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-4 h-4" />
                          {workout.exercises.length} exercises
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          ~{workout.exercises.reduce((sum, e) => sum + e.sets * (e.duration || 30) + e.sets * e.restTime, 0) / 60 | 0} min
                        </span>
                      </div>
                      <button
                        onClick={() => startWorkout(workout)}
                        className="w-full py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"
                      >
                        <Play className="w-5 h-5" />
                        Start Workout
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Create Workout */}
          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Workout Name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 mb-4"
              />

              {/* Preset exercises */}
              <div className="mb-4">
                <h4 className="text-white/70 text-sm mb-2">Quick Add</h4>
                <div className="flex flex-wrap gap-2">
                  {EXERCISE_PRESETS.slice(0, 5).map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => addExercise(preset)}
                      className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm hover:bg-white/20"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise list */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white/50 text-sm">{index + 1}.</span>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                        placeholder="Exercise name"
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      />
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="p-1 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-white/50 text-xs">Sets</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs">Reps</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs">Weight</label>
                        <input
                          type="number"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(exercise.id, 'weight', parseInt(e.target.value) || undefined)}
                          placeholder="kg"
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs">Rest (s)</label>
                        <input
                          type="number"
                          value={exercise.restTime}
                          onChange={(e) => updateExercise(exercise.id, 'restTime', parseInt(e.target.value) || 30)}
                          min="0"
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addExercise()}
                className="w-full py-2 border-2 border-dashed border-white/20 text-white/50 rounded-lg mb-4 hover:border-white/40"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Exercise
              </button>

              <button
                onClick={saveWorkout}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
              >
                Save Workout
              </button>
            </motion.div>
          )}

          {/* Active Workout */}
          {mode === 'workout' && currentWorkout && currentExercise && (
            <motion.div
              key="workout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Workout timer */}
              <div className="mb-6">
                <div className="text-white/50 text-sm">Total Time</div>
                <div className="text-3xl font-mono text-white">{formatTime(workoutTime)}</div>
              </div>

              {/* Current exercise */}
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                {isResting ? (
                  <div>
                    <Timer className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white mb-2">Rest</h2>
                    <div className="text-6xl font-mono text-yellow-400 mb-4">
                      {formatTime(timeRemaining)}
                    </div>
                    <button
                      onClick={skipRest}
                      className="px-6 py-2 bg-white/10 text-white rounded-lg"
                    >
                      Skip Rest
                    </button>
                  </div>
                ) : (
                  <div>
                    <Dumbbell className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white mb-2">{currentExercise.name}</h2>
                    <div className="text-white/70 mb-4">
                      Set {currentSet} of {currentExercise.sets}
                    </div>
                    <div className="text-5xl font-bold text-blue-400 mb-4">
                      {currentExercise.duration
                        ? formatTime(timeRemaining)
                        : `${currentExercise.reps} reps`
                      }
                    </div>
                    {currentExercise.weight && (
                      <div className="text-white/50">Weight: {currentExercise.weight} kg</div>
                    )}
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-white/50 text-sm mb-2">
                  <span>Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    animate={{ width: `${((currentExerciseIndex + (currentSet / currentExercise.sets)) / currentWorkout.exercises.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              {!isResting && !currentExercise.duration && (
                <button
                  onClick={completeSet}
                  className="w-full py-4 bg-green-500 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  Complete Set
                </button>
              )}
            </motion.div>
          )}

          {/* History */}
          {mode === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <p className="text-white/50">No workout history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{entry.workoutName}</h4>
                        <span className="text-white/50 text-sm">
                          {entry.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-white/50 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(entry.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-4 h-4" />
                          {entry.exercises} exercises
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
