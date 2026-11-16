import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { HeroDayDemo } from "./hero-day-demo"

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-14 md:pt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center md:px-6 lg:px-8">
        <Badge
          variant="outline"
          className="h-7 gap-2 px-3 text-muted-foreground"
        >
          <span lang="hi">आदत</span>
          <span aria-hidden>·</span>
          <span>aadat, the things you do without thinking</span>
        </Badge>
        <h1 className="mt-6 max-w-4xl text-[2.5rem] leading-[1.02] font-semibold tracking-tighter text-balance sm:text-5xl md:text-7xl">
          Your days repeat.
          <br />
          <span className="text-muted-foreground">
            Your planner should too.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
          Save the shape of a good day as a template: activities in soft
          time-of-day slots, todos on the side. Apply it in one tap, then live
          the day: tick, time and count. No streaks to protect.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/sign-up"
            className={buttonVariants({
              size: "lg",
              className: "h-11 px-5 text-base",
            })}
          >
            Plan your first day
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
          <Link
            to="/sign-in"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "h-11 px-5 text-base",
            })}
          >
            I already have an account
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl px-0 md:mt-16 md:px-4 lg:px-2">
        <div
          role="img"
          aria-label="A day plan: the Weekday template is applied, Morning walk is ticked, the Deep work timer runs and Water counts up to four of eight glasses."
        >
          <div aria-hidden inert>
            <HeroDayDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
