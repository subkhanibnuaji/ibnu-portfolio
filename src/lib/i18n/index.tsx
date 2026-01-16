'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en, Translations } from './translations/en'
import { id } from './translations/id'

export type Locale = 'en' | 'id'

const translations: Record<Locale, Translations> = { en, id }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | null>(null)

const LOCALE_KEY = 'preferred-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    // Get saved locale or detect from browser
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null
    if (saved && translations[saved]) {
      setLocaleState(saved)
    } else {
      // Detect from browser
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'id') {
        setLocaleState('id')
      } else {
        setLocaleState('en')
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_KEY, newLocale)
    document.documentElement.lang = newLocale
  }

  const t = translations[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // Return default translations if used outside provider
    return {
      locale: 'id' as Locale,
      setLocale: () => {},
      t: id
    }
  }
  return context
}

export function useLocale() {
  const { locale, setLocale } = useTranslation()
  return { locale, setLocale }
}

// Helper to get nested translation key
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) || path
}

// Export types and translations
export { en, id }
export type { Translations }
