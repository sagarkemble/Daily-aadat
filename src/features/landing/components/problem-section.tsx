import type { LucideIcon } from "lucide-react"
import { AlarmClockIcon, LayoutTemplateIcon, ListIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

type Approach = {
  icon: LucideIcon
  name: string
  verdict: string
  body: string
  ours?: boolean
}

const APPROACHES: Approach[] = [
  {
    icon: ListIcon,
    name: "Todo apps",
    verdict: "A blank list every morning",
    body: "You rebuild the same day from memory, every day. The routine never gets written down anywhere.",
  },
  {
    icon: AlarmClockIcon,
    name: "Habit trackers",
    verdict: "A timetable with a scoreboard",
    body: "Every habit gets a clock time and a streak. Miss 7:00 once and the whole day feels broken.",
  },
  {
    icon: LayoutTemplateIcon,
    name: "Daily Aadat",
    verdict: "The shape of your day, reusable",
    body: "Write a good day down once as a template. Bring it back when it fits, bend it when it doesn't.",
    ours: true,
  },
]

function ProblemSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 md:px-6 md:py-32 lg:px-8">
      <SectionHeading
        eyebrow="Why it exists"
        title="Somewhere between a blank list and a timetable."
        description="Most days are roughly the same: the same activities, in roughly the same part of the day. Travel, meetings and bad sleep move things around, and that is fine."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {APPROACHES.map((approach) => {
          const Icon = approach.icon
          return (
            <Card
              key={approach.name}
              className={cn(
                "gap-6 py-6",
                approach.ours &&
                  "bg-primary text-primary-foreground ring-primary"
              )}
            >
              <CardHeader className="px-6">
                <span
                  className={cn(
                    "mb-4 flex size-10 items-center justify-center rounded-full",
                    approach.ours
                      ? "bg-primary-foreground/15"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <CardDescription
                  className={cn(approach.ours && "text-primary-foreground/80")}
                >
                  {approach.name}
                </CardDescription>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {approach.verdict}
                </CardTitle>
              </CardHeader>
              <CardContent
                className={cn(
                  "px-6 text-base leading-relaxed",
                  approach.ours
                    ? "text-primary-foreground/90"
                    : "text-muted-foreground"
                )}
              >
                {approach.body}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export { ProblemSection }
