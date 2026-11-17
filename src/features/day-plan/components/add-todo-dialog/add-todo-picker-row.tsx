import { DynamicIcon } from "@/components/dynamic-icon"
import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { TODO_ICON } from "@/features/todos/lib/todo-icon"
import type { Todo } from "@/features/todos/types/todo"

type AddTodoPickerRowProps = {
  todo: Todo
  assignmentLabel?: string
  disabled?: boolean
  onSelect: (todo: Todo) => void
}

export function AddTodoPickerRow({
  todo,
  assignmentLabel,
  disabled,
  onSelect,
}: AddTodoPickerRowProps) {
  return (
    <Item
      variant="outline"
      size="sm"
      render={<button type="button" disabled={disabled} />}
      className="text-left disabled:pointer-events-none disabled:opacity-50"
      onClick={() => onSelect(todo)}
    >
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-icon-well text-foreground">
          <DynamicIcon name={TODO_ICON} />
        </span>
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="w-full truncate">{todo.name}</ItemTitle>
      </ItemContent>
      {assignmentLabel ? (
        <Badge variant="secondary">{assignmentLabel}</Badge>
      ) : null}
    </Item>
  )
}
