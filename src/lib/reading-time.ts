// Reading Time Estimator
// Calculates estimated reading time based on word count

const WORDS_PER_MINUTE = 200 // Average reading speed

export interface ReadingTimeResult {
  text: string
  minutes: number
  words: number
  time: number // in milliseconds
}

export function calculateReadingTime(content: string): ReadingTimeResult {
  // Remove HTML tags if present
  const cleanContent = content.replace(/<[^>]*>/g, '')

  // Remove markdown syntax
  const textOnly = cleanContent
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]*`/g, '') // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links
    .replace(/[#*_~`>]/g, '') // markdown characters
    .replace(/\n+/g, ' ') // newlines
    .trim()

  // Count words
  const words = textOnly.split(/\s+/).filter(word => word.length > 0).length

  // Calculate reading time
  const minutes = Math.ceil(words / WORDS_PER_MINUTE)
  const time = Math.round(words / WORDS_PER_MINUTE * 60 * 1000)

  // Format text
  let text: string
  if (minutes < 1) {
    text = 'Kurang dari 1 menit'
  } else if (minutes === 1) {
    text = '1 menit baca'
  } else {
    text = `${minutes} menit baca`
  }

  return {
    text,
    minutes,
    words,
    time
  }
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}
