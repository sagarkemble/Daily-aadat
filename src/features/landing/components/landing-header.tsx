import { Link } from "@tanstack/react-router"

import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AadatWordmark } from "@/components/aadat-wordmark"

const NAV = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Slots", href: "#slots" },
  { label: "Todos", href: "#todos" },
  { label: "No streaks", href: "#promise" },
] as const

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 md:px-6 lg:px-8">
        <Link to="/" aria-label="Daily Aadat home">
          <AadatWordmark />
        </Link>
        <nav
          aria-label="Sections"
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-muted-foreground",
              })}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <Link
            to="/sign-in"
            className={buttonVariants({
              variant: "ghost",
              className: "hidden sm:inline-flex",
            })}
          >
            Sign in
          </Link>
          <Link to="/sign-up" className={buttonVariants()}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}

export { LandingHeader }
