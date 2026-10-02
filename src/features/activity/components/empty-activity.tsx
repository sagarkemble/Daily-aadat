import { ClipboardListIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type EmptyActivityProps = {
  title: string
  description: string
  children: React.ReactNode
  icon: React.ReactNode
}

export function EmptyActivity({
  title,
  description,
  children,
  icon,
}: EmptyActivityProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
        {children}
      </EmptyHeader>
    </Empty>
  )
}
