import { DynamicIcon } from "@/components/dynamic-icon"
import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import type { Todo } from "@/features/todos/types/todo"

const DEFAULT_TODO_ICON = "list-todo"

type AddTodoPickerRowProps = {
  todo: Todo
  assignmentLabel?: string
  onSelect: (todo: Todo) => void
}

export function AddTodoPickerRow({
  todo,
  assignmentLabel,
  onSelect,
}: AddTodoPickerRowProps) {
  return (
    <Item variant="outline" size="sm" onClick={() => onSelect(todo)}>
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <DynamicIcon name={todo.icon || DEFAULT_TODO_ICON} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{todo.name}</ItemTitle>
      </ItemContent>
      {assignmentLabel ? (
        <Badge variant="secondary">{assignmentLabel}</Badge>
      ) : null}
    </Item>
  )
}
