'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Trash2, Edit2, Save, Download, RotateCcw,
  ZoomIn, ZoomOut, Move, Palette
} from 'lucide-react'

interface Node {
  id: string
  text: string
  x: number
  y: number
  color: string
  parentId: string | null
  children: string[]
}

interface MindMapData {
  nodes: { [key: string]: Node }
  rootId: string
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
]

export function MindMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<MindMapData>(() => {
    const rootId = 'root'
    return {
      nodes: {
        [rootId]: {
          id: rootId,
          text: 'Main Idea',
          x: 400,
          y: 300,
          color: '#3b82f6',
          parentId: null,
          children: []
        }
      },
      rootId
    }
  })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    // Apply transformations
    ctx.save()
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y)
    ctx.scale(zoom, zoom)
    ctx.translate(-width / 2, -height / 2)

    // Draw connections
    ctx.lineWidth = 2
    Object.values(data.nodes).forEach(node => {
      if (node.parentId && data.nodes[node.parentId]) {
        const parent = data.nodes[node.parentId]

        ctx.beginPath()
        ctx.strokeStyle = node.color + '80'

        // Curved line
        const midX = (node.x + parent.x) / 2
        ctx.moveTo(parent.x, parent.y)
        ctx.quadraticCurveTo(midX, parent.y, midX, (node.y + parent.y) / 2)
        ctx.quadraticCurveTo(midX, node.y, node.x, node.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    Object.values(data.nodes).forEach(node => {
      const isSelected = selectedNode === node.id
      const isEditing = editingNode === node.id
      const isRoot = node.id === data.rootId

      // Node background
      ctx.beginPath()
      const padding = isRoot ? 20 : 15
      const textWidth = ctx.measureText(node.text).width
      const nodeWidth = Math.max(textWidth + padding * 2, isRoot ? 120 : 80)
      const nodeHeight = isRoot ? 50 : 40

      // Rounded rectangle
      const radius = nodeHeight / 2
      ctx.moveTo(node.x - nodeWidth / 2 + radius, node.y - nodeHeight / 2)
      ctx.lineTo(node.x + nodeWidth / 2 - radius, node.y - nodeHeight / 2)
      ctx.arc(node.x + nodeWidth / 2 - radius, node.y, radius, -Math.PI / 2, Math.PI / 2)
      ctx.lineTo(node.x - nodeWidth / 2 + radius, node.y + nodeHeight / 2)
      ctx.arc(node.x - nodeWidth / 2 + radius, node.y, radius, Math.PI / 2, -Math.PI / 2)
      ctx.closePath()

      // Fill
      ctx.fillStyle = node.color
      ctx.fill()

      // Selection outline
      if (isSelected) {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Text
      ctx.fillStyle = '#ffffff'
      ctx.font = isRoot ? 'bold 16px sans-serif' : '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (!isEditing) {
        ctx.fillText(node.text, node.x, node.y)
      }

      // Add button indicator
      if (isSelected && !isEditing) {
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(node.x + nodeWidth / 2 + 10, node.y, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = node.color
        ctx.font = 'bold 16px sans-serif'
        ctx.fillText('+', node.x + nodeWidth / 2 + 10, node.y)
      }
    })

    ctx.restore()
  }, [data, selectedNode, editingNode, zoom, pan])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 500
        draw()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [draw])

  useEffect(() => {
    draw()
  }, [draw])

  const getNodeAt = (x: number, y: number): string | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const canvasX = (x - rect.left - canvas.width / 2 - pan.x) / zoom + canvas.width / 2
    const canvasY = (y - rect.top - canvas.height / 2 - pan.y) / zoom + canvas.height / 2

    for (const node of Object.values(data.nodes)) {
      const isRoot = node.id === data.rootId
      const nodeWidth = isRoot ? 120 : 80
      const nodeHeight = isRoot ? 50 : 40

      if (
        canvasX >= node.x - nodeWidth / 2 &&
        canvasX <= node.x + nodeWidth / 2 &&
        canvasY >= node.y - nodeHeight / 2 &&
        canvasY <= node.y + nodeHeight / 2
      ) {
        return node.id
      }
    }

    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const nodeId = getNodeAt(e.clientX, e.clientY)

    if (nodeId) {
      setDragNode(nodeId)
      setSelectedNode(nodeId)
    } else {
      setIsDragging(true)
      setSelectedNode(null)
    }

    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y

    if (dragNode) {
      setData(prev => ({
        ...prev,
        nodes: {
          ...prev.nodes,
          [dragNode]: {
            ...prev.nodes[dragNode],
            x: prev.nodes[dragNode].x + dx / zoom,
            y: prev.nodes[dragNode].y + dy / zoom
          }
        }
      }))
    } else if (isDragging) {
      setPan(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }))
    }

    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragNode(null)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    const nodeId = getNodeAt(e.clientX, e.clientY)
    if (nodeId) {
      startEditing(nodeId)
    }
  }

  const startEditing = (nodeId: string) => {
    setEditingNode(nodeId)
    setEditText(data.nodes[nodeId].text)
  }

  const saveEditing = () => {
    if (editingNode && editText.trim()) {
      setData(prev => ({
        ...prev,
        nodes: {
          ...prev.nodes,
          [editingNode]: {
            ...prev.nodes[editingNode],
            text: editText.trim()
          }
        }
      }))
    }
    setEditingNode(null)
    setEditText('')
  }

  const addChildNode = () => {
    if (!selectedNode) return

    const parent = data.nodes[selectedNode]
    const newId = Date.now().toString()
    const angle = (parent.children.length * Math.PI / 4) - Math.PI / 2
    const distance = 150

    const newNode: Node = {
      id: newId,
      text: 'New Idea',
      x: parent.x + Math.cos(angle) * distance,
      y: parent.y + Math.sin(angle) * distance,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      parentId: selectedNode,
      children: []
    }

    setData(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [newId]: newNode,
        [selectedNode]: {
          ...prev.nodes[selectedNode],
          children: [...prev.nodes[selectedNode].children, newId]
        }
      }
    }))

    setSelectedNode(newId)
    startEditing(newId)
  }

  const deleteNode = () => {
    if (!selectedNode || selectedNode === data.rootId) return

    const deleteRecursive = (nodeId: string, nodes: { [key: string]: Node }): { [key: string]: Node } => {
      const node = nodes[nodeId]
      let updatedNodes = { ...nodes }

      // Delete children first
      node.children.forEach(childId => {
        updatedNodes = deleteRecursive(childId, updatedNodes)
      })

      // Remove from parent's children list
      if (node.parentId && updatedNodes[node.parentId]) {
        updatedNodes[node.parentId] = {
          ...updatedNodes[node.parentId],
          children: updatedNodes[node.parentId].children.filter(id => id !== nodeId)
        }
      }

      // Delete the node
      delete updatedNodes[nodeId]

      return updatedNodes
    }

    setData(prev => ({
      ...prev,
      nodes: deleteRecursive(selectedNode, prev.nodes)
    }))

    setSelectedNode(null)
  }

  const changeNodeColor = (color: string) => {
    if (!selectedNode) return

    setData(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [selectedNode]: {
          ...prev.nodes[selectedNode],
          color
        }
      }
    }))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const exportAsImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'mind-map.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={addChildNode}
            disabled={!selectedNode}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Child
          </button>

          <button
            onClick={deleteNode}
            disabled={!selectedNode || selectedNode === data.rootId}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          {selectedNode && (
            <button
              onClick={() => startEditing(selectedNode)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}

          <div className="flex-1" />

          <button
            onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={resetView}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={exportAsImage}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Color picker for selected node */}
        {selectedNode && (
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-white/70" />
            <div className="flex gap-1">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => changeNodeColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    data.nodes[selectedNode]?.color === color
                      ? 'border-white'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          />

          {/* Edit input overlay */}
          {editingNode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-slate-800 rounded-lg p-4 flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditing()
                    if (e.key === 'Escape') setEditingNode(null)
                  }}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={saveEditing}
                  className="px-4 py-2 bg-blue-500 rounded-lg text-white"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-white/50 text-sm">
          Click to select • Double-click to edit • Drag to move • Select a node and click "Add Child"
        </div>
      </motion.div>
    </div>
  )
}
