import { ListTodoIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import type { Todo } from "@/features/todos/types/todo"
import { AddTodoPickerRow } from "./add-todo-picker-row"

export type AddTodoPickerSection = {
  id: string
  label: string
  todos: Todo[]
  assignmentLabel?: (todo: Todo) => string | undefined
  onSelect: (todo: Todo) => void
}

type AddTodoPickerListProps = {
  sections: AddTodoPickerSection[]
  isLoading: boolean
  disabled?: boolean
  emptyTitle: string
  emptyDescription: string
}

export function AddTodoPickerList({
  sections,
  isLoading,
  disabled,
  emptyTitle,
  emptyDescription,
}: AddTodoPickerListProps) {
  const visibleSections = sections.filter((section) => section.todos.length > 0)

  return (
    <ScrollArea className="h-72">
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : visibleSections.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodoIcon />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleSections.map((section) => (
            <section
              key={section.id}
              aria-label={section.label}
              className="flex flex-col gap-2"
            >
              <h3 className="text-xs font-medium text-muted-foreground">
                {section.label} · {section.todos.length}
              </h3>
              <ItemGroup>
                {section.todos.map((todo) => (
                  <div key={todo.id} role="listitem">
                    <AddTodoPickerRow
                      todo={todo}
                      disabled={disabled}
                      assignmentLabel={section.assignmentLabel?.(todo)}
                      onSelect={section.onSelect}
                    />
                  </div>
                ))}
              </ItemGroup>
            </section>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
