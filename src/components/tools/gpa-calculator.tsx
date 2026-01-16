'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Plus, Trash2, RotateCcw } from 'lucide-react'

interface Course {
  id: string
  name: string
  credits: string
  grade: string
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
}

const GRADES = Object.keys(GRADE_POINTS)

function getGPAColor(gpa: number): string {
  if (gpa >= 3.7) return 'text-green-500'
  if (gpa >= 3.0) return 'text-blue-500'
  if (gpa >= 2.0) return 'text-yellow-500'
  return 'text-red-500'
}

function getGPALabel(gpa: number): string {
  if (gpa >= 3.9) return 'Summa Cum Laude'
  if (gpa >= 3.7) return 'Magna Cum Laude'
  if (gpa >= 3.5) return 'Cum Laude'
  if (gpa >= 3.0) return 'Good Standing'
  if (gpa >= 2.0) return 'Satisfactory'
  return 'Needs Improvement'
}

export function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: '3', grade: 'A' },
    { id: '2', name: '', credits: '3', grade: 'A' },
    { id: '3', name: '', credits: '3', grade: 'A' },
  ])

  const addCourse = () => {
    setCourses([...courses, {
      id: Date.now().toString(),
      name: '',
      credits: '3',
      grade: 'A'
    }])
  }

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id))
    }
  }

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const resetAll = () => {
    setCourses([
      { id: '1', name: '', credits: '3', grade: 'A' },
      { id: '2', name: '', credits: '3', grade: 'A' },
      { id: '3', name: '', credits: '3', grade: 'A' },
    ])
  }

  const calculations = useMemo(() => {
    let totalCredits = 0
    let totalPoints = 0

    courses.forEach(course => {
      const credits = parseFloat(course.credits) || 0
      const gradePoint = GRADE_POINTS[course.grade] ?? 0
      totalCredits += credits
      totalPoints += credits * gradePoint
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0

    return {
      gpa,
      totalCredits,
      totalPoints,
      label: getGPALabel(gpa),
      colorClass: getGPAColor(gpa),
    }
  }, [courses])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">GPA Calculator</h1>
        <p className="text-muted-foreground">Calculate your Grade Point Average</p>
      </div>

      <div className="bg-card rounded-xl p-6 border">
        {/* GPA Display */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-2 text-blue-500" />
          <div className={`text-5xl font-bold ${calculations.colorClass}`}>
            {calculations.gpa.toFixed(2)}
          </div>
          <div className="text-lg text-muted-foreground mt-1">{calculations.label}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {calculations.totalCredits} credits • {calculations.totalPoints.toFixed(1)} quality points
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-3">Credits</div>
            <div className="col-span-3">Grade</div>
            <div className="col-span-1"></div>
          </div>

          {courses.map((course, index) => (
            <div key={course.id} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder={`Course ${index + 1}`}
                className="col-span-5 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                placeholder="3"
                min="0"
                max="10"
                step="0.5"
                className="col-span-3 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="col-span-3 px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>{grade} ({GRADE_POINTS[grade].toFixed(1)})</option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
                className="col-span-1 p-2 bg-muted hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={addCourse}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
          <button
            onClick={resetAll}
            className="py-2 px-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Grade Scale */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Grade Scale</h3>
          <div className="grid grid-cols-4 gap-2 text-sm">
            {GRADES.map(grade => (
              <div key={grade} className="flex justify-between">
                <span className="font-medium">{grade}</span>
                <span className="text-muted-foreground">{GRADE_POINTS[grade].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GPA Scale */}
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg text-sm">
          <h3 className="font-semibold text-blue-600 mb-2">GPA Scale</h3>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <div><span className="text-green-500 font-medium">3.9+</span> Summa Cum Laude</div>
            <div><span className="text-green-500 font-medium">3.7+</span> Magna Cum Laude</div>
            <div><span className="text-blue-500 font-medium">3.5+</span> Cum Laude</div>
            <div><span className="text-blue-500 font-medium">3.0+</span> Good Standing</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
