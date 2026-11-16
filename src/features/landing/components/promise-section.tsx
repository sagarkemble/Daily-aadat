import type { LucideIcon } from "lucide-react"
import { CalendarCheckIcon, ClockIcon, SkipForwardIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "./section-heading"

const PROMISES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: SkipForwardIcon,
    title: "Skipping is an answer",
    body: "Mark an activity skipped and move on. It stays on the day, honestly, without a red X.",
  },
  {
    icon: ClockIcon,
    title: "Times are labels",
    body: "A slot can say 7–12. Nothing locks when it's 12:01, and nothing nags you about it.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Tomorrow isn't blank",
    body: "Each day starts from the template you chose, not from zero, and not from yesterday's score.",
  },
]

function PromiseSection() {
  return (
    <section
      id="promise"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-24 md:px-6 md:py-32 lg:px-8"
    >
      <SectionHeading
        eyebrow="The promise"
        title="No streaks, no scoreboard."
        description="Daily Aadat keeps track of your day, not of you. Nothing here is designed to make a missed morning feel like failure."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PROMISES.map((promise) => {
          const Icon = promise.icon
          return (
            <Card
              key={promise.title}
              className="gap-3 bg-muted/40 py-6 ring-foreground/5"
            >
              <CardHeader className="gap-4 px-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-foreground/10">
                  <Icon className="size-4" />
                </span>
                <CardTitle className="text-base font-semibold tracking-tight">
                  {promise.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 leading-relaxed text-muted-foreground">
                {promise.body}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export { PromiseSection }
