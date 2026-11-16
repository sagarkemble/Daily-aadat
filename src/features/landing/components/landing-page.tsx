import { HeroSection } from "./hero-section"
import { HowItWorksSection } from "./how-it-works-section"
import { ClosingCta, LandingFooter } from "./landing-footer"
import { LandingHeader } from "./landing-header"
import { ProblemSection } from "./problem-section"
import { PromiseSection } from "./promise-section"
import { SlotsSection } from "./slots-section"
import { TodosSection } from "./todos-section"

function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <SlotsSection />
        <TodosSection />
        <PromiseSection />
        <ClosingCta />
      </main>
      <LandingFooter />
    </div>
  )
}

export { LandingPage }
