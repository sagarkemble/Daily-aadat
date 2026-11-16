import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import { TIMED_SLOTS } from "@/features/templates/types/slots"
import { AadatWordmark } from "@/components/aadat-wordmark"

function ClosingCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 md:px-6 md:py-32 lg:px-8">
      <div className="flex flex-col items-center text-center brand-glow">
        <div aria-hidden className="flex -space-x-2">
          {TIMED_SLOTS.map((slot) => (
            <span
              key={slot}
              className="size-8 rounded-full ring-4 ring-background"
              style={{ backgroundColor: SLOT_COPY[slot].sky }}
            />
          ))}
        </div>
        <h2 className="mt-8 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tighter text-balance md:text-6xl">
          Give your days a shape you can come back to.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
          Start with one template. Most people's first is just “a normal
          weekday”.
        </p>
        <Link
          to="/sign-up"
          className={buttonVariants({
            size: "lg",
            className: "mt-8 h-11 px-5 text-base brand-ring",
          })}
        >
          Plan your first day
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <AadatWordmark className="text-foreground" />
          <p>
            <span lang="hi">आदत</span> (aadat): Hindi and Urdu for habit, the
            way you usually do things.
          </p>
        </div>
        <nav
          aria-label="Account"
          className="flex items-center gap-1 md:ml-auto"
        >
          <Link
            to="/sign-in"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Create account
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export { ClosingCta, LandingFooter }
