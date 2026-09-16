import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import type { LucideProps } from "lucide-react"

export function ActivityIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  return <DynamicIcon name={name as IconName} {...props} />
}
