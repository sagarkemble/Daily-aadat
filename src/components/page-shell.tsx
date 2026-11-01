import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageShellProps = {
  children: ReactNode
  className?: string
}

/** Shared vertical rhythm for authenticated tab pages. */
function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>{children}</div>
  )
}

export { PageShell }
