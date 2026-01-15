'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLocale, Locale } from '@/lib/i18n'

interface Language {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
]

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'icon'
  className?: string
}

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find(l => l.code === locale) || languages[0]

  if (variant === 'toggle') {
    return (
      <div className={`flex items-center gap-1 p-1 rounded-full bg-muted ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${locale === lang.code
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {lang.flag} {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={() => {
          const nextLocale = locale === 'id' ? 'en' : 'id'
          setLocale(nextLocale)
        }}
        className={`
          p-2 rounded-lg hover:bg-accent transition-colors
          ${className}
        `}
        title={`Switch to ${locale === 'id' ? 'English' : 'Indonesian'}`}
      >
        <span className="text-lg">{currentLang.flag}</span>
      </button>
    )
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors
                    ${locale === lang.code ? 'bg-accent' : ''}
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{lang.name}</div>
                  </div>
                  {locale === lang.code && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact switcher for mobile
export function LanguageSwitcherCompact() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent transition-colors text-sm"
    >
      <span>{locale === 'id' ? '🇮🇩' : '🇬🇧'}</span>
      <span className="font-medium">{locale.toUpperCase()}</span>
    </button>
  )
}
