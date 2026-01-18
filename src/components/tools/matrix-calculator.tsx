'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator, Plus, Minus, X, Grid3X3,
  RotateCcw, ArrowRight, Copy, Check
} from 'lucide-react'

type Matrix = number[][]
type Operation = 'add' | 'subtract' | 'multiply' | 'transpose' | 'determinant' | 'inverse' | 'scalar'

export function MatrixCalculator() {
  const [matrixA, setMatrixA] = useState<Matrix>([[1, 2], [3, 4]])
  const [matrixB, setMatrixB] = useState<Matrix>([[5, 6], [7, 8]])
  const [result, setResult] = useState<Matrix | number | null>(null)
  const [operation, setOperation] = useState<Operation>('add')
  const [scalar, setScalar] = useState(2)
  const [rowsA, setRowsA] = useState(2)
  const [colsA, setColsA] = useState(2)
  const [rowsB, setRowsB] = useState(2)
  const [colsB, setColsB] = useState(2)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const createEmptyMatrix = (rows: number, cols: number): Matrix => {
    return Array(rows).fill(null).map(() => Array(cols).fill(0))
  }

  const resizeMatrix = (matrix: Matrix, newRows: number, newCols: number): Matrix => {
    const newMatrix = createEmptyMatrix(newRows, newCols)
    for (let i = 0; i < Math.min(matrix.length, newRows); i++) {
      for (let j = 0; j < Math.min(matrix[0]?.length || 0, newCols); j++) {
        newMatrix[i][j] = matrix[i][j] || 0
      }
    }
    return newMatrix
  }

  const updateMatrixA = (row: number, col: number, value: number) => {
    const newMatrix = matrixA.map(r => [...r])
    newMatrix[row][col] = value
    setMatrixA(newMatrix)
  }

  const updateMatrixB = (row: number, col: number, value: number) => {
    const newMatrix = matrixB.map(r => [...r])
    newMatrix[row][col] = value
    setMatrixB(newMatrix)
  }

  const handleRowsAChange = (newRows: number) => {
    setRowsA(newRows)
    setMatrixA(resizeMatrix(matrixA, newRows, colsA))
  }

  const handleColsAChange = (newCols: number) => {
    setColsA(newCols)
    setMatrixA(resizeMatrix(matrixA, rowsA, newCols))
  }

  const handleRowsBChange = (newRows: number) => {
    setRowsB(newRows)
    setMatrixB(resizeMatrix(matrixB, newRows, colsB))
  }

  const handleColsBChange = (newCols: number) => {
    setColsB(newCols)
    setMatrixB(resizeMatrix(matrixB, rowsB, newCols))
  }

  // Matrix operations
  const addMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) return null
    return a.map((row, i) => row.map((val, j) => val + b[i][j]))
  }

  const subtractMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) return null
    return a.map((row, i) => row.map((val, j) => val - b[i][j]))
  }

  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a[0].length !== b.length) return null
    const result: Matrix = []
    for (let i = 0; i < a.length; i++) {
      result[i] = []
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j]
        }
        result[i][j] = sum
      }
    }
    return result
  }

  const transposeMatrix = (m: Matrix): Matrix => {
    return m[0].map((_, i) => m.map(row => row[i]))
  }

  const scalarMultiply = (m: Matrix, s: number): Matrix => {
    return m.map(row => row.map(val => val * s))
  }

  const determinant = (m: Matrix): number | null => {
    if (m.length !== m[0].length) return null
    const n = m.length

    if (n === 1) return m[0][0]
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]

    let det = 0
    for (let j = 0; j < n; j++) {
      const minor = m.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)])
      det += Math.pow(-1, j) * m[0][j] * (determinant(minor) || 0)
    }
    return det
  }

  const inverseMatrix = (m: Matrix): Matrix | null => {
    if (m.length !== m[0].length) return null
    const n = m.length
    const det = determinant(m)
    if (det === null || det === 0) return null

    if (n === 2) {
      return [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det]
      ]
    }

    // For larger matrices, use adjugate method
    const adjugate: Matrix = createEmptyMatrix(n, n)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const minor = m
          .filter((_, ri) => ri !== i)
          .map(row => row.filter((_, ci) => ci !== j))
        const cofactor = Math.pow(-1, i + j) * (determinant(minor) || 0)
        adjugate[j][i] = cofactor / det
      }
    }
    return adjugate
  }

  const calculate = () => {
    setError(null)
    let res: Matrix | number | null = null

    switch (operation) {
      case 'add':
        res = addMatrices(matrixA, matrixB)
        if (!res) setError('Matrices must have the same dimensions for addition')
        break
      case 'subtract':
        res = subtractMatrices(matrixA, matrixB)
        if (!res) setError('Matrices must have the same dimensions for subtraction')
        break
      case 'multiply':
        res = multiplyMatrices(matrixA, matrixB)
        if (!res) setError('Number of columns in A must equal number of rows in B')
        break
      case 'transpose':
        res = transposeMatrix(matrixA)
        break
      case 'determinant':
        res = determinant(matrixA)
        if (res === null) setError('Matrix must be square for determinant')
        break
      case 'inverse':
        res = inverseMatrix(matrixA)
        if (!res) setError('Matrix must be square and non-singular for inverse')
        break
      case 'scalar':
        res = scalarMultiply(matrixA, scalar)
        break
    }

    setResult(res)
  }

  const copyResult = () => {
    if (!result) return
    const text = Array.isArray(result)
      ? result.map(row => row.join('\t')).join('\n')
      : result.toString()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetAll = () => {
    setMatrixA([[1, 2], [3, 4]])
    setMatrixB([[5, 6], [7, 8]])
    setRowsA(2)
    setColsA(2)
    setRowsB(2)
    setColsB(2)
    setResult(null)
    setError(null)
  }

  const renderMatrix = (
    matrix: Matrix,
    updateFn: (row: number, col: number, value: number) => void,
    label: string
  ) => (
    <div>
      <label className="text-white/70 text-sm mb-2 block">{label}</label>
      <div className="inline-block bg-white/5 rounded-lg p-3">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2 last:mb-0">
            {row.map((val, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => updateFn(i, j, parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  const operations: { id: Operation; name: string; icon: any; needsB: boolean }[] = [
    { id: 'add', name: 'A + B', icon: Plus, needsB: true },
    { id: 'subtract', name: 'A - B', icon: Minus, needsB: true },
    { id: 'multiply', name: 'A × B', icon: X, needsB: true },
    { id: 'transpose', name: 'Aᵀ', icon: Grid3X3, needsB: false },
    { id: 'determinant', name: 'det(A)', icon: Calculator, needsB: false },
    { id: 'inverse', name: 'A⁻¹', icon: Calculator, needsB: false },
    { id: 'scalar', name: 'k × A', icon: Calculator, needsB: false }
  ]

  const needsMatrixB = operations.find(op => op.id === operation)?.needsB ?? false

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Operation Selection */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">Operation</label>
          <div className="flex flex-wrap gap-2">
            {operations.map(op => (
              <button
                key={op.id}
                onClick={() => { setOperation(op.id); setResult(null); setError(null); }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  operation === op.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {op.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Matrix A */}
          <div>
            <div className="flex gap-4 mb-4">
              <div>
                <label className="text-white/50 text-xs">Rows</label>
                <select
                  value={rowsA}
                  onChange={(e) => handleRowsAChange(Number(e.target.value))}
                  className="block w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs">Columns</label>
                <select
                  value={colsA}
                  onChange={(e) => handleColsAChange(Number(e.target.value))}
                  className="block w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            {renderMatrix(matrixA, updateMatrixA, 'Matrix A')}
          </div>

          {/* Matrix B or Scalar */}
          {needsMatrixB ? (
            <div>
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="text-white/50 text-xs">Rows</label>
                  <select
                    value={rowsB}
                    onChange={(e) => handleRowsBChange(Number(e.target.value))}
                    className="block w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs">Columns</label>
                  <select
                    value={colsB}
                    onChange={(e) => handleColsBChange(Number(e.target.value))}
                    className="block w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              {renderMatrix(matrixB, updateMatrixB, 'Matrix B')}
            </div>
          ) : operation === 'scalar' ? (
            <div>
              <label className="text-white/70 text-sm mb-2 block">Scalar (k)</label>
              <input
                type="number"
                value={scalar}
                onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : null}
        </div>

        {/* Calculate Button */}
        <div className="flex gap-2 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculate}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate
          </motion.button>
          <button
            onClick={resetAll}
            className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Result */}
        {result !== null && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/70 text-sm">Result</label>
              <button
                onClick={copyResult}
                className="text-white/50 hover:text-white text-sm flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              {typeof result === 'number' ? (
                <div className="text-3xl font-bold text-green-400 text-center">
                  {Number.isInteger(result) ? result : result.toFixed(4)}
                </div>
              ) : (
                <div className="inline-block">
                  {result.map((row, i) => (
                    <div key={i} className="flex gap-4 mb-2 last:mb-0">
                      {row.map((val, j) => (
                        <span
                          key={`${i}-${j}`}
                          className="w-20 text-center text-green-400 font-mono"
                        >
                          {Number.isInteger(val) ? val : val.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
