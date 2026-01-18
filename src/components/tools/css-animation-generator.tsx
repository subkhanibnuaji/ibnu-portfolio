'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Play, RotateCcw, Sparkles } from 'lucide-react'

interface AnimationConfig {
  name: string
  duration: number
  timing: string
  delay: number
  iterations: string
  direction: string
  fillMode: string
  keyframes: { [key: string]: { [property: string]: string } }
}

const PRESETS: Record<string, AnimationConfig> = {
  bounce: {
    name: 'bounce',
    duration: 1,
    timing: 'ease',
    delay: 0,
    iterations: 'infinite',
    direction: 'normal',
    fillMode: 'both',
    keyframes: {
      '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
      '40%': { transform: 'translateY(-30px)' },
      '60%': { transform: 'translateY(-15px)' }
    }
  },
  pulse: {
    name: 'pulse',
    duration: 1.5,
    timing: 'ease-in-out',
    delay: 0,
    iterations: 'infinite',
    direction: 'normal',
    fillMode: 'both',
    keyframes: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(1.1)', opacity: '0.7' },
      '100%': { transform: 'scale(1)', opacity: '1' }
    }
  },
  shake: {
    name: 'shake',
    duration: 0.5,
    timing: 'ease-in-out',
    delay: 0,
    iterations: 'infinite',
    direction: 'normal',
    fillMode: 'both',
    keyframes: {
      '0%, 100%': { transform: 'translateX(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
    }
  },
  rotate: {
    name: 'rotate',
    duration: 2,
    timing: 'linear',
    delay: 0,
    iterations: 'infinite',
    direction: 'normal',
    fillMode: 'both',
    keyframes: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  },
  fadeIn: {
    name: 'fadeIn',
    duration: 1,
    timing: 'ease-out',
    delay: 0,
    iterations: '1',
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' }
    }
  },
  slideIn: {
    name: 'slideIn',
    duration: 0.5,
    timing: 'ease-out',
    delay: 0,
    iterations: '1',
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: {
      '0%': { transform: 'translateX(-100%)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' }
    }
  },
  glow: {
    name: 'glow',
    duration: 2,
    timing: 'ease-in-out',
    delay: 0,
    iterations: 'infinite',
    direction: 'alternate',
    fillMode: 'both',
    keyframes: {
      '0%': { boxShadow: '0 0 5px #00aaff, 0 0 10px #00aaff' },
      '100%': { boxShadow: '0 0 20px #00aaff, 0 0 40px #00aaff, 0 0 60px #00aaff' }
    }
  },
  float: {
    name: 'float',
    duration: 3,
    timing: 'ease-in-out',
    delay: 0,
    iterations: 'infinite',
    direction: 'alternate',
    fillMode: 'both',
    keyframes: {
      '0%': { transform: 'translateY(0px)' },
      '100%': { transform: 'translateY(-20px)' }
    }
  }
}

const TIMING_FUNCTIONS = [
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
]

const FILL_MODES = ['none', 'forwards', 'backwards', 'both']
const DIRECTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse']

export function CSSAnimationGenerator() {
  const [config, setConfig] = useState<AnimationConfig>(PRESETS.bounce)
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [previewKey, setPreviewKey] = useState(0)

  const generateKeyframesCSS = (): string => {
    const keyframeRules = Object.entries(config.keyframes)
      .map(([selector, properties]) => {
        const props = Object.entries(properties)
          .map(([prop, value]) => `    ${prop}: ${value};`)
          .join('\n')
        return `  ${selector} {\n${props}\n  }`
      })
      .join('\n')

    return `@keyframes ${config.name} {\n${keyframeRules}\n}`
  }

  const generateAnimationCSS = (): string => {
    return `.animated-element {
  animation-name: ${config.name};
  animation-duration: ${config.duration}s;
  animation-timing-function: ${config.timing};
  animation-delay: ${config.delay}s;
  animation-iteration-count: ${config.iterations};
  animation-direction: ${config.direction};
  animation-fill-mode: ${config.fillMode};
}`
  }

  const generateShorthandCSS = (): string => {
    return `.animated-element {
  animation: ${config.name} ${config.duration}s ${config.timing} ${config.delay}s ${config.iterations} ${config.direction} ${config.fillMode};
}`
  }

  const fullCSS = `${generateKeyframesCSS()}\n\n${generateShorthandCSS()}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName]
    if (preset) {
      setConfig(preset)
      setPreviewKey(prev => prev + 1)
    }
  }

  const resetAnimation = () => {
    setPreviewKey(prev => prev + 1)
  }

  // Generate inline style for preview
  const getPreviewStyle = (): React.CSSProperties => {
    if (!isPlaying) return {}

    return {
      animation: `${config.name} ${config.duration}s ${config.timing} ${config.delay}s ${config.iterations} ${config.direction} ${config.fillMode}`
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Animation Settings
            </h3>

            {/* Presets */}
            <div>
              <label className="text-white/70 text-sm mb-2 block">Presets</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PRESETS).map(preset => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      config.name === preset
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Name */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Animation Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Duration: {config.duration}s</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={config.duration}
                onChange={(e) => setConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Timing Function */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Timing Function</label>
              <select
                value={config.timing}
                onChange={(e) => setConfig(prev => ({ ...prev, timing: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {TIMING_FUNCTIONS.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>

            {/* Delay */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Delay: {config.delay}s</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={config.delay}
                onChange={(e) => setConfig(prev => ({ ...prev, delay: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Iterations */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Iterations</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={config.iterations === 'infinite' ? '' : config.iterations}
                  onChange={(e) => setConfig(prev => ({ ...prev, iterations: e.target.value || '1' }))}
                  placeholder="Number"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setConfig(prev => ({ ...prev, iterations: 'infinite' }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    config.iterations === 'infinite'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Infinite
                </button>
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Direction</label>
              <select
                value={config.direction}
                onChange={(e) => setConfig(prev => ({ ...prev, direction: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {DIRECTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Fill Mode */}
            <div>
              <label className="text-white/70 text-sm mb-1 block">Fill Mode</label>
              <select
                value={config.fillMode}
                onChange={(e) => setConfig(prev => ({ ...prev, fillMode: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {FILL_MODES.map(fm => (
                  <option key={fm} value={fm}>{fm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview & Output */}
          <div className="space-y-4">
            {/* Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-2 rounded-lg transition-colors ${
                      isPlaying ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
                    }`}
                  >
                    {isPlaying ? <Play className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={resetAnimation}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="h-48 bg-slate-900 rounded-xl flex items-center justify-center">
                <style dangerouslySetInnerHTML={{ __html: generateKeyframesCSS() }} />
                <div
                  key={previewKey}
                  style={getPreviewStyle()}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                />
              </div>
            </div>

            {/* Generated CSS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Generated CSS</h3>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 rounded-xl text-sm text-green-400 overflow-x-auto max-h-64 overflow-y-auto">
                <code>{fullCSS}</code>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
