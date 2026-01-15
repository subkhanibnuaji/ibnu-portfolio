'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    role: 'CEO',
    company: 'PT Digital Nusantara',
    content: 'Ibnu delivered exceptional RPA solutions that automated 80% of our manual processes. His technical expertise combined with business acumen made the project a huge success.',
    rating: 5
  },
  {
    id: '2',
    name: 'Sarah Wijaya',
    role: 'CTO',
    company: 'HealthTech Indonesia',
    content: 'Working with Ibnu on our healthcare platform was a great experience. He understood complex requirements quickly and delivered scalable solutions on time.',
    rating: 5
  },
  {
    id: '3',
    name: 'Dr. Bambang Sutrisno',
    role: 'Director',
    company: 'RS Premier Jakarta',
    content: 'The feasibility study and turnaround strategy from Virtus Futura was instrumental in our hospital\'s transformation. Highly professional and data-driven approach.',
    rating: 5
  },
  {
    id: '4',
    name: 'Michael Chen',
    role: 'Founder',
    company: 'Web3 Ventures',
    content: 'Ibnu\'s understanding of blockchain and DeFi is impressive. He helped us build a secure and efficient dApp on the Internet Computer protocol.',
    rating: 5
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const testimonial = TESTIMONIALS[currentIndex]

  return (
    <section className="py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-cyber-cyan text-sm font-medium tracking-wider uppercase"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mt-2"
          >
            What People Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            Feedback from clients, colleagues, and collaborators
          </motion.p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 -left-6 z-10">
              <div className="w-12 h-12 rounded-full bg-cyber-gradient flex items-center justify-center">
                <Quote className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 md:p-12"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < testimonial.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-cyber-gradient flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentIndex
                          ? 'w-8 bg-cyber-cyan'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prev}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={next}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Compact version for sidebars
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < testimonial.rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-muted-foreground'
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-4">"{testimonial.content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cyber-gradient flex items-center justify-center text-white font-bold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-sm">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </div>
  )
}
