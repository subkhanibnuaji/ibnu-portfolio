'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Shuffle, Plus, Trash2, RotateCcw, Trophy, Download, Upload } from 'lucide-react'

export function NamePicker() {
  const [names, setNames] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'David', 'Eve'])
  const [newName, setNewName] = useState('')
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [removePicked, setRemovePicked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addName = () => {
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames([...names, newName.trim()])
      setNewName('')
    }
  }

  const removeName = (nameToRemove: string) => {
    setNames(names.filter(name => name !== nameToRemove))
    if (selectedName === nameToRemove) {
      setSelectedName(null)
    }
  }

  const clearAll = () => {
    setNames([])
    setSelectedName(null)
    setHistory([])
  }

  const pickRandom = () => {
    if (names.length === 0 || isSpinning) return

    setIsSpinning(true)
    setSelectedName(null)

    // Animate through names quickly
    let iterations = 0
    const maxIterations = 20 + Math.floor(Math.random() * 10)
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length)
      setSelectedName(names[randomIndex])
      iterations++

      if (iterations >= maxIterations) {
        clearInterval(interval)
        const finalIndex = Math.floor(Math.random() * names.length)
        const winner = names[finalIndex]
        setSelectedName(winner)
        setHistory(prev => [winner, ...prev].slice(0, 20))
        setIsSpinning(false)

        if (removePicked) {
          setNames(prev => prev.filter(name => name !== winner))
        }
      }
    }, 50 + iterations * 5)
  }

  const resetPicker = () => {
    setSelectedName(null)
    setHistory([])
  }

  const exportNames = () => {
    const blob = new Blob([names.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'names.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importNames = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const importedNames = text.split('\n').map(name => name.trim()).filter(name => name)
      setNames(prev => [...new Set([...prev, ...importedNames])])
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addMultipleNames = (text: string) => {
    const newNames = text.split(/[,\n]/).map(name => name.trim()).filter(name => name && !names.includes(name))
    if (newNames.length > 0) {
      setNames([...names, ...newNames])
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Add Name Input */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
            <Users className="w-4 h-4" />
            Add Names
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addName()
              }}
              placeholder="Enter a name (or paste multiple separated by commas)"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30"
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('text')
                if (pastedText.includes(',') || pastedText.includes('\n')) {
                  e.preventDefault()
                  addMultipleNames(pastedText)
                }
              }}
            />
            <button
              onClick={addName}
              disabled={!newName.trim()}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Import/Export */}
        <div className="flex gap-2 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={importNames}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={exportNames}
            disabled={names.length === 0}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={clearAll}
            disabled={names.length === 0}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 flex items-center gap-2 text-sm ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Names List */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">
            Names ({names.length})
          </label>
          {names.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl max-h-48 overflow-y-auto">
              {names.map((name, i) => (
                <motion.div
                  key={`${name}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: selectedName === name && isSpinning ? 1.1 : 1,
                    backgroundColor: selectedName === name ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                  }}
                  className="px-3 py-1.5 rounded-lg flex items-center gap-2 group"
                >
                  <span className="text-white">{name}</span>
                  <button
                    onClick={() => removeName(name)}
                    className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white/5 rounded-xl text-center text-white/30">
              No names added yet. Add some names above!
            </div>
          )}
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removePicked}
              onChange={(e) => setRemovePicked(e.target.checked)}
              className="w-4 h-4 rounded bg-white/10 border-white/20"
            />
            <span className="text-white/70 text-sm">Remove picked name from list</span>
          </label>
        </div>

        {/* Pick Button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={pickRandom}
            disabled={names.length === 0 || isSpinning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg"
          >
            <Shuffle className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Picking...' : 'Pick Random Name'}
          </motion.button>
        </div>

        {/* Winner Display */}
        <AnimatePresence>
          {selectedName && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{selectedName}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset */}
        {(selectedName || history.length > 0) && (
          <div className="flex justify-center">
            <button
              onClick={resetPicker}
              className="px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4">Pick History</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((name, i) => (
              <div
                key={i}
                className={`px-3 py-1.5 rounded-lg ${
                  i === 0 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-white/70'
                }`}
              >
                {i === 0 && <span className="mr-1">🏆</span>}
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
