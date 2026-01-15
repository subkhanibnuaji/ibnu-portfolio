'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle,
  Archive,
  Loader2,
  Reply,
  Star,
  StarOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

// Mock data
const mockMessages = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Collaboration',
    message: 'Hi Ibnu, I saw your portfolio and I am impressed with your work on HUB PKP. I would love to discuss a potential collaboration on a government digitalization project.',
    status: 'NEW',
    priority: 'HIGH',
    starred: true,
    createdAt: '2025-01-14T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@startup.io',
    subject: 'Speaking Engagement',
    message: 'We are organizing a tech conference in Jakarta and would like to invite you as a speaker to talk about AI in government services.',
    status: 'READ',
    priority: 'MEDIUM',
    starred: false,
    createdAt: '2025-01-13T15:45:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@consulting.com',
    subject: 'Consulting Request',
    message: 'Looking for someone with your expertise in blockchain and government IT systems. Would you be available for a consulting engagement?',
    status: 'REPLIED',
    priority: 'MEDIUM',
    starred: false,
    createdAt: '2025-01-12T09:15:00Z',
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@venture.vc',
    subject: 'Investment Opportunity',
    message: 'Your background in both tech and business is very impressive. We have some portfolio companies that could benefit from your advisory.',
    status: 'NEW',
    priority: 'HIGH',
    starred: true,
    createdAt: '2025-01-11T14:20:00Z',
  },
]

const statusColors: Record<string, string> = {
  NEW: 'bg-cyber-cyan/20 text-cyber-cyan',
  READ: 'bg-muted text-muted-foreground',
  REPLIED: 'bg-cyber-green/20 text-cyber-green',
  ARCHIVED: 'bg-muted text-muted-foreground',
}

const priorityColors: Record<string, string> = {
  HIGH: 'text-red-500',
  MEDIUM: 'text-yellow-500',
  LOW: 'text-green-500',
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || msg.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const selectedMessage = messages.find((m) => m.id === selectedId)

  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'READ' } : m))
    )
  }

  const handleToggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    setDeleteId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selectedId === id) setSelectedId(null)
    setDeleteId(null)
  }

  const handleArchive = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'ARCHIVED' } : m))
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 24) {
      return `${hours}h ago`
    } else if (hours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <AdminLayout
      title="Messages"
      description="View and manage contact form submissions"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Messages List */}
        <div className="lg:w-1/2 xl:w-2/5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-cyber-cyan outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['All', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === (status === 'All' ? null : status) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status === 'All' ? null : status)}
              >
                {status}
                {status === 'NEW' && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-cyber-cyan/20 text-cyber-cyan rounded text-xs">
                    {messages.filter((m) => m.status === 'NEW').length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Message List */}
          <div className="space-y-2">
            {filteredMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedId(msg.id)
                  if (msg.status === 'NEW') handleMarkAsRead(msg.id)
                }}
                className={cn(
                  'glass rounded-lg p-4 cursor-pointer transition-all',
                  selectedId === msg.id && 'ring-2 ring-cyber-cyan',
                  msg.status === 'NEW' && 'border-l-4 border-l-cyber-cyan'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {msg.status === 'NEW' ? (
                      <Mail className="h-4 w-4 text-cyber-cyan" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">{msg.name}</span>
                    {msg.starred && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="font-medium text-sm mb-1 line-clamp-1">{msg.subject}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs',
                      statusColors[msg.status]
                    )}
                  >
                    {msg.status}
                  </span>
                  <span className={cn('text-xs', priorityColors[msg.priority])}>
                    {msg.priority}
                  </span>
                </div>
              </motion.div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:w-1/2 xl:w-3/5">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 sticky top-24"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{selectedMessage.name}</span>
                    <span>•</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-cyber-cyan hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStar(selectedMessage.id)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {selectedMessage.starred ? (
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <StarOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 text-sm">
                <span
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    statusColors[selectedMessage.status]
                  )}
                >
                  {selectedMessage.status}
                </span>
                <span className={cn('flex items-center gap-1', priorityColors[selectedMessage.priority])}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {selectedMessage.priority} Priority
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                  <Button variant="gradient" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArchive(selectedMessage.id)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={deleteId === selectedMessage.id}
                >
                  {deleteId === selectedMessage.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <Mail className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a message</h3>
              <p className="text-muted-foreground">
                Click on a message to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
