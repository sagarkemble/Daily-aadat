import type { ReactElement } from "react"
import type { LucideProps } from "lucide-react"
import {
  DynamicIcon as LucideDynamicIcon,
  type IconName,
} from "lucide-react/dynamic"

type DynamicIconProps = {
  name: string
  fallback?: () => ReactElement | null
} & Omit<LucideProps, "name" | "ref">

export function DynamicIcon({ name, fallback, ...props }: DynamicIconProps) {
  return (
    <LucideDynamicIcon name={name as IconName} fallback={fallback} {...props} />
  )
}
