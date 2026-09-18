import type { ReactNode } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

/** Page chrome inside the outlet — replaces the old shell top bar. */
export function PageHeader({
  title,
  description,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {/* Mobile only — desktop uses brand hover-toggle in the sidebar */}
          <SidebarTrigger className="-ml-1 md:hidden" />
          {children ??
            (title ? (
              <div className="min-w-0">
                <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                {description ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
              </div>
            ) : null)}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}
