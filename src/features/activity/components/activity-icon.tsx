import type { ReactElement } from "react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import type { LucideProps } from "lucide-react"

export function ActivityIcon({
  name,
  fallback,
  ...props
}: { name: string; fallback?: () => ReactElement | null } & LucideProps) {
  return <DynamicIcon name={name as IconName} fallback={fallback} {...props} />
}
