'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image, Type, Download, RefreshCw, Palette, Plus, Trash2, Move } from 'lucide-react'

interface TextBox {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  strokeColor: string
  fontFamily: string
}

const memeTemplates = [
  { id: 'drake', name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 'change-my-mind', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { id: 'distracted', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 'button', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { id: 'expanding-brain', name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg' },
  { id: 'one-does-not', name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bij.jpg' },
  { id: 'success-kid', name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg' },
  { id: 'disaster-girl', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg' }
]

const fonts = [
  { id: 'impact', name: 'Impact', value: 'Impact, sans-serif' },
  { id: 'arial', name: 'Arial Black', value: 'Arial Black, sans-serif' },
  { id: 'comic', name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
  { id: 'times', name: 'Times', value: 'Times New Roman, serif' }
]

export function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTemplate, setSelectedTemplate] = useState(memeTemplates[0])
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([
    { id: '1', text: 'TOP TEXT', x: 50, y: 10, fontSize: 40, color: '#ffffff', strokeColor: '#000000', fontFamily: 'Impact, sans-serif' },
    { id: '2', text: 'BOTTOM TEXT', x: 50, y: 90, fontSize: 40, color: '#ffffff', strokeColor: '#000000', fontFamily: 'Impact, sans-serif' }
  ])
  const [selectedTextBox, setSelectedTextBox] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageUrl = customImage || selectedTemplate.url

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      setImageLoaded(true)
      drawMeme(ctx, img)
    }
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (!imageLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      drawMeme(ctx, img)
    }
    img.src = imageUrl
  }, [textBoxes, imageLoaded])

  const drawMeme = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(img, 0, 0)

    textBoxes.forEach(box => {
      const x = (box.x / 100) * ctx.canvas.width
      const y = (box.y / 100) * ctx.canvas.height + box.fontSize

      ctx.font = `bold ${box.fontSize}px ${box.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Stroke
      ctx.strokeStyle = box.strokeColor
      ctx.lineWidth = box.fontSize / 15
      ctx.strokeText(box.text.toUpperCase(), x, y)

      // Fill
      ctx.fillStyle = box.color
      ctx.fillText(box.text.toUpperCase(), x, y)
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTextBox = () => {
    const newBox: TextBox = {
      id: Date.now().toString(),
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 40,
      color: '#ffffff',
      strokeColor: '#000000',
      fontFamily: 'Impact, sans-serif'
    }
    setTextBoxes([...textBoxes, newBox])
    setSelectedTextBox(newBox.id)
  }

  const removeTextBox = (id: string) => {
    setTextBoxes(textBoxes.filter(box => box.id !== id))
    if (selectedTextBox === id) setSelectedTextBox(null)
  }

  const updateTextBox = (id: string, updates: Partial<TextBox>) => {
    setTextBoxes(textBoxes.map(box =>
      box.id === id ? { ...box, ...updates } : box
    ))
  }

  const downloadMeme = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const selectedBox = textBoxes.find(box => box.id === selectedTextBox)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Canvas Preview */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Preview
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadMeme}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg border border-border"
          />
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        {/* Template Selection */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Templates</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {memeTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template)
                  setCustomImage(null)
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  !customImage && selectedTemplate.id === template.id
                    ? 'border-primary'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <img
                  src={template.url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <button className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <Plus className="w-5 h-5 mx-auto mb-1" />
              Upload Custom Image
            </button>
          </div>
        </div>

        {/* Text Boxes */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              Text Boxes
            </h3>
            <button
              onClick={addTextBox}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              Add Text
            </button>
          </div>

          <div className="space-y-2">
            {textBoxes.map((box, index) => (
              <div
                key={box.id}
                onClick={() => setSelectedTextBox(box.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedTextBox === box.id
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-border bg-muted/50 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Text {index + 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTextBox(box.id)
                    }}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={box.text}
                  onChange={(e) => updateTextBox(box.id, { text: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  placeholder="Enter text..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text Styling */}
        {selectedBox && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Text Style
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Position X</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedBox.x}
                  onChange={(e) => updateTextBox(selectedBox.id, { x: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Position Y</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedBox.y}
                  onChange={(e) => updateTextBox(selectedBox.id, { y: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Font Size</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={selectedBox.fontSize}
                  onChange={(e) => updateTextBox(selectedBox.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Font</label>
                <select
                  value={selectedBox.fontFamily}
                  onChange={(e) => updateTextBox(selectedBox.id, { fontFamily: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  {fonts.map(font => (
                    <option key={font.id} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedBox.color}
                    onChange={(e) => updateTextBox(selectedBox.id, { color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateTextBox(selectedBox.id, { color })}
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Stroke Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedBox.strokeColor}
                    onChange={(e) => updateTextBox(selectedBox.id, { strokeColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateTextBox(selectedBox.id, { strokeColor: color })}
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
