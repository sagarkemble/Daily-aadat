import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { Link } from "@tanstack/react-router"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "cn"
import { formatTodoAssignment } from "../lib/format-todo-assignment"
import type { Todo, TodoState } from "../types/todo"
import { TodoDetailDialog } from "./todo-detail-dialog"

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
  const [detailOpen, setDetailOpen] = useState(false)
  const skipped = todo.state === "skipped"
  const done = todo.state === "done"
  const note = todo.note?.trim()

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isDeleting) return
    setConfirmOpen(nextOpen)
  }

  function handleCheckedChange(checked: boolean) {
    onUpdateTodoState(todo, checked ? "done" : "pending")
  }

  return (
    <>
      <Item
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setDetailOpen(true)}
      >
        <ItemMedia variant="icon">
          <DynamicIcon
            name={todo.icon || DEFAULT_TODO_ICON}
            size="md"
            variant="muted"
          />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle
            className={cn((done || skipped) && "text-muted-foreground")}
          >
            {todo.name}
          </ItemTitle>
          {note ? <ItemDescription>{note}</ItemDescription> : null}
          {todo.assignment ? (
          <Badge
            variant="secondary"
            onClick={(event) => event.stopPropagation()}
            render={
              <Link to="/" search={{ date: todo.assignment.plan_date }} />
            }
          >
              {formatTodoAssignment(todo.assignment)}
            </Badge>
          ) : null}
        </ItemContent>
        <ItemActions
          className="shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
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
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
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
      <TodoDetailDialog
        todo={todo}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
