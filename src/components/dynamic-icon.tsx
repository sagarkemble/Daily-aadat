import type { ReactElement } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { LucideProps } from "lucide-react"
import {
  DynamicIcon as LucideDynamicIcon,
  type IconName,
} from "lucide-react/dynamic"

const dynamicIconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const dynamicIconWellVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-foreground",
  {
    variants: {
      size: {
        xs: "p-1.5",
        sm: "p-2",
        md: "p-2.5",
        lg: "p-3",
        xl: "p-3.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const dynamicIconSizes = ["xs", "sm", "md", "lg", "xl"] as const
const dynamicIconVariantsList = ["default", "muted"] as const

type DynamicIconProps = {
  name: string
  fallback?: () => ReactElement | null
  variant?: (typeof dynamicIconVariantsList)[number]
} & Omit<LucideProps, "name" | "ref" | "size"> &
  VariantProps<typeof dynamicIconVariants>

function DynamicIcon({
  name,
  fallback,
  size = "md",
  variant = "default",
  className,
  ...props
}: DynamicIconProps) {
  const icon = (
    <LucideDynamicIcon
      name={name as IconName}
      fallback={fallback}
      className={cn(
        dynamicIconVariants({ size }),
        variant === "default" && className
      )}
      {...props}
    />
  )

  if (variant === "default") return icon

  return (
    <span className={cn(dynamicIconWellVariants({ size }), className)}>
      {icon}
    </span>
  )
}

export {
  DynamicIcon,
  dynamicIconSizes,
  dynamicIconVariants,
  dynamicIconVariantsList,
  dynamicIconWellVariants,
}
export type { DynamicIconProps }
