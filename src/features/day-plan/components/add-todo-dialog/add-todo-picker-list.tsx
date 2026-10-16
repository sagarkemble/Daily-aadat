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

type AddTodoPickerListProps = {
  todos: Todo[]
  isLoading: boolean
  emptyTitle: string
  emptyDescription: string
  assignmentLabel?: (todo: Todo) => string | undefined
  onSelect: (todo: Todo) => void
}

export function AddTodoPickerList({
  todos,
  isLoading,
  emptyTitle,
  emptyDescription,
  assignmentLabel,
  onSelect,
}: AddTodoPickerListProps) {
  return (
    <ScrollArea className="h-72">
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : todos.length === 0 ? (
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
        <ItemGroup>
          {todos.map((todo) => (
            <AddTodoPickerRow
              key={todo.id}
              todo={todo}
              assignmentLabel={assignmentLabel?.(todo)}
              onSelect={onSelect}
            />
          ))}
        </ItemGroup>
      )}
    </ScrollArea>
  )
}
