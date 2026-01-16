import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero'
import { InterestsSection } from '@/components/sections/interests'
import { FeaturedProjectSection } from '@/components/sections/featured-project'
import { AIPlaygroundSection } from '@/components/sections/ai-playground'
import { SkillsSection } from '@/components/sections/skills'
import { CredentialsSection } from '@/components/sections/credentials'
import { ContactCTASection } from '@/components/sections/contact-cta'
import { NetworkingGallery } from '@/components/sections/networking-gallery'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ParticleBackground } from '@/components/effects/particle-background'
import { CustomCursor } from '@/components/effects/custom-cursor'
import { ScrollProgress } from '@/components/effects/scroll-progress'
import { AIChatbot } from '@/components/chat/ai-chatbot'
import { Terminal } from '@/components/terminal/terminal'
import { CommandPalette } from '@/components/layout/command-palette'
import { StatsCounter } from '@/components/stats/stats-counter'
import { TestimonialsSection } from '@/components/testimonials/testimonials-section'
import { BackToTop } from '@/components/ui/back-to-top'
import { KeyboardShortcuts } from '@/components/ui/keyboard-shortcuts'

export default function HomePage() {
  return (
    <>
      {/* Background Effects */}
      <ParticleBackground />
      <CustomCursor />
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <StatsCounter />
        <InterestsSection />
        <FeaturedProjectSection />
        <AIPlaygroundSection />
        <SkillsSection />
        <TestimonialsSection />
        <NetworkingGallery />
        <CredentialsSection />
        <ContactCTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Components */}
      <Suspense fallback={null}>
        <AIChatbot />
        <Terminal />
        <CommandPalette />
        <BackToTop />
        <KeyboardShortcuts />
      </Suspense>
    </>
  )
}
