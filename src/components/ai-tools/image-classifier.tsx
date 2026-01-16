'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Loader2, RefreshCw, Sparkles, Image as ImageIcon, Tag } from 'lucide-react'

type MobileNetModule = typeof import('@tensorflow-models/mobilenet')
type TensorFlowModule = typeof import('@tensorflow/tfjs')

interface Prediction {
  className: string
  probability: number
}

export function ImageClassifier() {
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<any>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current

    setIsModelLoading(true)
    setProgress('Loading TensorFlow.js...')

    try {
      const tf: TensorFlowModule = await import('@tensorflow/tfjs')
      await tf.ready()
      setProgress('Loading MobileNet model...')

      const mobilenet: MobileNetModule = await import('@tensorflow-models/mobilenet')
      const model = await mobilenet.load({
        version: 2,
        alpha: 1.0
      })

      modelRef.current = model
      setProgress('')
      setIsModelLoading(false)
      return model
    } catch (error) {
      console.error('Failed to load model:', error)
      setProgress('Failed to load model')
      setIsModelLoading(false)
      throw error
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setPredictions([])
    }
    reader.readAsDataURL(file)
  }

  const classifyImage = async () => {
    if (!image || !imgRef.current) return

    setIsLoading(true)
    setProgress('Classifying image...')

    try {
      const model = await loadModel()
      const results = await model.classify(imgRef.current, 5)

      setPredictions(results.map((r: any) => ({
        className: r.className,
        probability: r.probability
      })))

      setProgress('')
    } catch (error) {
      console.error('Error classifying image:', error)
      setProgress('Error classifying image')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setImage(null)
    setPredictions([])
    setProgress('')
  }

  const getConfidenceColor = (prob: number) => {
    if (prob > 0.7) return 'bg-green-500'
    if (prob > 0.4) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-medium mb-4">
          <Tag className="w-4 h-4" />
          MobileNet v2
        </div>
        <h2 className="text-3xl font-bold mb-2">Image Classification</h2>
        <p className="text-muted-foreground">
          Identify objects in images using deep learning. Recognizes 1000+ categories.
        </p>
      </div>

      {/* Upload Area */}
      {!image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Upload an image to classify</p>
          <p className="text-sm text-muted-foreground">
            Supports animals, objects, food, places, and more
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Image Display */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Input Image</h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
                <img
                  ref={imgRef}
                  src={image}
                  alt="Input"
                  className="max-w-full max-h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center">Classifications</h3>
              <div className="aspect-square rounded-xl border border-border overflow-hidden bg-muted/30 p-4">
                <AnimatePresence mode="wait">
                  {predictions.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {predictions.map((pred, index) => (
                        <motion.div
                          key={pred.className}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-1"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="font-medium capitalize">
                              {pred.className.split(',')[0]}
                            </span>
                            <span className="text-muted-foreground">
                              {(pred.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.probability * 100}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className={`h-full ${getConfidenceColor(pred.probability)} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click "Classify" to identify</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {(isLoading || isModelLoading) && progress && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={classifyImage}
              disabled={isLoading || isModelLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Classify Image
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Image
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <strong>Privacy:</strong> All processing happens locally in your browser.
        </p>
      </div>
    </div>
  )
}
