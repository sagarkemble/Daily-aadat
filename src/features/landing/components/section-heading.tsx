import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: "start" | "center"
  className?: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { SectionHeading }
