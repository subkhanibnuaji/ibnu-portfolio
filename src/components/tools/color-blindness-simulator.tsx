'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Eye, Upload, Download, Palette, Info,
  Image as ImageIcon
} from 'lucide-react'

type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

interface SimulationType {
  id: ColorBlindnessType
  name: string
  description: string
  percentage: string
}

const SIMULATION_TYPES: SimulationType[] = [
  { id: 'normal', name: 'Normal Vision', description: 'Standard color perception', percentage: '~92%' },
  { id: 'protanopia', name: 'Protanopia', description: 'Red-blind, missing L-cones', percentage: '~1.3%' },
  { id: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind, missing M-cones', percentage: '~1.2%' },
  { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind, missing S-cones', percentage: '~0.001%' },
  { id: 'achromatopsia', name: 'Achromatopsia', description: 'Complete color blindness', percentage: '~0.003%' }
]

export function ColorBlindnessSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [simulationType, setSimulationType] = useState<ColorBlindnessType>('normal')
  const [testColor, setTestColor] = useState('#ff6b6b')

  // Color blindness simulation matrices
  const matrices: Record<ColorBlindnessType, number[][]> = {
    normal: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ],
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114]
    ]
  }

  const applyColorBlindness = (r: number, g: number, b: number, type: ColorBlindnessType): [number, number, number] => {
    const matrix = matrices[type]
    return [
      Math.min(255, Math.max(0, matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b)),
      Math.min(255, Math.max(0, matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b)),
      Math.min(255, Math.max(0, matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b))
    ]
  }

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0]
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
  }

  useEffect(() => {
    if (!image) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    canvas.width = image.width
    canvas.height = image.height

    ctx.drawImage(image, 0, 0)

    if (simulationType !== 'normal') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = applyColorBlindness(data[i], data[i + 1], data[i + 2], simulationType)
        data[i] = r
        data[i + 1] = g
        data[i + 2] = b
      }

      ctx.putImageData(imageData, 0, 0)
    }
  }, [image, simulationType])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => setImage(img)
    img.src = URL.createObjectURL(file)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `colorblind-simulation-${simulationType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const getSimulatedColor = (hex: string): string => {
    const [r, g, b] = hexToRgb(hex)
    const [nr, ng, nb] = applyColorBlindness(r, g, b, simulationType)
    return rgbToHex(nr, ng, nb)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Simulation Type Selection */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-3 block flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Vision Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {SIMULATION_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSimulationType(type.id)}
                className={`p-3 rounded-xl text-left transition-all ${
                  simulationType === type.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="font-medium text-sm">{type.name}</div>
                <div className={`text-xs ${simulationType === type.id ? 'text-white/70' : 'text-white/50'}`}>
                  {type.percentage} of population
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-medium">
              {SIMULATION_TYPES.find(t => t.id === simulationType)?.name}
            </div>
            <div className="text-white/70 text-sm">
              {SIMULATION_TYPES.find(t => t.id === simulationType)?.description}
            </div>
          </div>
        </div>

        {/* Color Test */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-3 block flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Comparison
          </label>
          <div className="flex items-center gap-4">
            <div>
              <input
                type="color"
                value={testColor}
                onChange={(e) => setTestColor(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer"
              />
              <div className="text-white/50 text-xs text-center mt-1">Original</div>
            </div>
            <div className="text-white/30 text-2xl">→</div>
            <div>
              <div
                className="w-16 h-16 rounded-lg"
                style={{ backgroundColor: getSimulatedColor(testColor) }}
              />
              <div className="text-white/50 text-xs text-center mt-1">Simulated</div>
            </div>
            <div className="ml-4 text-white/70 text-sm">
              <div>Original: <span className="font-mono">{testColor}</span></div>
              <div>Simulated: <span className="font-mono">{getSimulatedColor(testColor)}</span></div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="text-white/70 text-sm mb-3 block flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Test with Image
          </label>

          <div className="flex gap-2 mb-4">
            <label className="flex-1 py-3 border-2 border-dashed border-white/20 rounded-xl text-white/70 hover:border-white/40 cursor-pointer flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {image && (
              <button
                onClick={downloadImage}
                className="px-4 py-3 bg-green-500 text-white rounded-xl flex items-center gap-2 hover:bg-green-600"
              >
                <Download className="w-5 h-5" />
                Save
              </button>
            )}
          </div>

          {/* Canvas Preview */}
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            {image ? (
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto mx-auto"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-white/30">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
                  <p>Upload an image to see how it appears</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette Demo */}
        <div>
          <label className="text-white/70 text-sm mb-3 block">Common Colors Comparison</label>
          <div className="grid grid-cols-6 gap-2">
            {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#88ff00', '#0088ff', '#ff0088', '#8800ff', '#00ff88'].map(color => (
              <div key={color} className="text-center">
                <div className="flex gap-1 justify-center mb-1">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: color }}
                    title="Original"
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: getSimulatedColor(color) }}
                    title="Simulated"
                  />
                </div>
                <div className="text-white/30 text-xs font-mono">{color}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
