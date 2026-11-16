import { Link } from "@tanstack/react-router"

import logo from "@/assets/logo.png"
import { cn } from "@/lib/utils"

type AadatLogoProps = {
  className?: string
  size?: "sm" | "md" | "lg"
}

const LOGO_SIZE = {
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
} as const

function AadatLogo({ className, size = "md" }: AadatLogoProps) {
  return (
    <img
      src={logo}
      alt=""
      aria-hidden
      className={cn(
        "shrink-0 rounded-full object-cover",
        LOGO_SIZE[size],
        className
      )}
    />
  )
}

type AadatWordmarkProps = {
  className?: string
  logoSize?: AadatLogoProps["size"]
}

function AadatWordmark({ className, logoSize = "md" }: AadatWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-base font-semibold tracking-tight",
        className
      )}
    >
      <AadatLogo size={logoSize} />
      <span>
        Daily <span className="text-muted-foreground">Aadat</span>
      </span>
    </span>
  )
}

type AadatLogoLinkProps = AadatLogoProps & {
  className?: string
}

/** Centered mark on auth screens; links home when the router is available. */
function AadatLogoLink({ className, size = "lg" }: AadatLogoLinkProps) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex rounded-full focus-visible:outline-none",
        className
      )}
      aria-label="Daily Aadat home"
    >
      <AadatLogo size={size} />
    </Link>
  )
}

export { AadatLogo, AadatLogoLink, AadatWordmark }
