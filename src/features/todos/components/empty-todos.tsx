import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type EmptyTodosProps = {
  title: string
  description: string
  children: React.ReactNode
  icon: React.ReactNode
}

export function EmptyTodos({
  title,
  description,
  children,
  icon,
}: EmptyTodosProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
