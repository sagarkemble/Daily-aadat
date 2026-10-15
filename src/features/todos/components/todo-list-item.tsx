import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { DynamicIcon } from "@/components/dynamic-icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "cn"
import type { Todo, TodoState } from "../types/todo"

const DEFAULT_TODO_ICON = "list-todo"

type TodoListItemProps = {
  todo: Todo
  disabled?: boolean
  isDeleting?: boolean
  onUpdateTodoState: (todo: Todo, state: TodoState) => void
  onDeleteTodo: (todo: Todo) => void
}

export function TodoListItem({
  todo,
  disabled,
  isDeleting,
  onUpdateTodoState,
  onDeleteTodo,
}: TodoListItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const skipped = todo.state === "skipped"
  const done = todo.state === "done"

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isDeleting) return
    setConfirmOpen(nextOpen)
  }

  function handleCheckedChange(checked: boolean) {
    onUpdateTodoState(todo, checked ? "done" : "pending")
  }

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <DynamicIcon
            name={todo.icon || DEFAULT_TODO_ICON}
            className="size-4"
          />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className={cn((done || skipped) && "text-muted-foreground")}>
          {todo.name}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        {skipped ? (
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onUpdateTodoState(todo, "pending")}
          >
            Unskip
          </Button>
        ) : (
          <>
            <Checkbox
              checked={done}
              disabled={disabled}
              onCheckedChange={handleCheckedChange}
              aria-label={done ? "Mark as open" : "Mark as done"}
            />
            {done ? null : (
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => onUpdateTodoState(todo, "skipped")}
              >
                Skip
              </Button>
            )}
          </>
        )}
        <AlertDialog
          open={confirmOpen}
          onOpenChange={handleConfirmOpenChange}
        >
          <AlertDialogTrigger
            render={<Button variant="outline" size="icon" />}
            disabled={disabled}
          >
            <Trash2Icon />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete {todo.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the todo from your pile. If it is on a day, that
                placement is removed too. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeleting}
                onClick={(event) => {
                  event.preventDefault()
                  onDeleteTodo(todo)
                }}
              >
                {isDeleting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  )
}
