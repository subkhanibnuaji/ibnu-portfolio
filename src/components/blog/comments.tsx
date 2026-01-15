'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, User, Calendar, ThumbsUp, Reply, Trash2, Flag } from 'lucide-react'
import { toast } from 'sonner'

interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: string
  likes: number
  replies?: Comment[]
  parentId?: string
}

interface CommentsProps {
  postId: string
  postSlug: string
}

export function Comments({ postId, postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  })

  // Load comments
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.content) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          postSlug,
          parentId: replyTo,
          ...formData
        })
      })

      if (res.ok) {
        toast.success('Komentar berhasil ditambahkan!')
        setFormData({ name: '', email: '', content: '' })
        setReplyTo(null)
        loadComments()
      } else {
        toast.error('Gagal menambahkan komentar')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    // Store liked comments in localStorage
    const likedKey = `comment-liked-${commentId}`
    if (localStorage.getItem(likedKey)) {
      toast.info('Anda sudah menyukai komentar ini')
      return
    }

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST'
      })

      if (res.ok) {
        localStorage.setItem(likedKey, 'true')
        setComments(prev =>
          prev.map(c =>
            c.id === commentId ? { ...c, likes: c.likes + 1 } : c
          )
        )
      }
    } catch (error) {
      console.error('Failed to like comment')
    }
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isLiked = typeof window !== 'undefined' && localStorage.getItem(`comment-liked-${comment.id}`)

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}
      >
        <div className="p-4 rounded-lg bg-card border border-border">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{comment.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className={`
                flex items-center gap-1 text-sm transition-colors
                ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes || 0}</span>
            </button>

            {depth < 2 && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}

        {/* Reply Form */}
        {replyTo === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 ml-8"
          >
            <CommentForm
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              isReply
              onCancel={() => setReplyTo(null)}
            />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">
          Komentar ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {!replyTo && (
        <CommentForm
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Comments List */}
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence>
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Comment Form Component
function CommentForm({
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  isReply = false,
  onCancel
}: {
  onSubmit: (e: React.FormEvent) => void
  formData: { name: string; email: string; content: string }
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; content: string }>>
  isSubmitting: boolean
  isReply?: boolean
  onCancel?: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Nama *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nama Anda"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@example.com"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Komentar *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder={isReply ? 'Tulis balasan Anda...' : 'Tulis komentar Anda...'}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Mengirim...' : isReply ? 'Kirim Balasan' : 'Kirim Komentar'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  )
}
