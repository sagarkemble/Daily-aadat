import { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { useUnassignTodo } from "@/features/day-plan/hooks/use-unassign-todo"
import { formatTodoAssignment } from "../lib/format-todo-assignment"
import { useChangeTodoState } from "../hooks/use-change-todo-state"
import { useDeleteTodo } from "../hooks/use-delete-todo"
import { useUpdateTodo } from "../hooks/use-update-todo"
import type { Todo, TodoPriority } from "../types/todo"
import { TodoDueDateField } from "./todo-due-date-field"
import { TodoPriorityField } from "./todo-priority-field"

const DEFAULT_TODO_ICON = "list-todo"

type TodoDetailDialogProps = {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TodoDetailDialog({ todo, open, onOpenChange }: TodoDetailDialogProps) {
  const savedNote = todo.note ?? ""
  const savedPriority = todo.priority
  const savedDueDate = todo.due_date
  const [note, setNote] = useState(savedNote)
  const [priority, setPriority] = useState<TodoPriority>(savedPriority)
  const [dueDate, setDueDate] = useState<string | null>(savedDueDate)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutateAsync: updateTodo, isPending: isSaving } = useUpdateTodo()
  const { mutateAsync: changeTodoState, isPending: isChangingState } =
    useChangeTodoState()
  const { mutateAsync: unassignTodo, isPending: isUnassigning } =
    useUnassignTodo()
  const { mutateAsync: deleteTodo, isPending: isDeleting } = useDeleteTodo()
  const isPending =
    isSaving || isChangingState || isUnassigning || isDeleting
  const skipped = todo.state === "skipped"
  const done = todo.state === "done"

  useEffect(() => {
    if (open) {
      setNote(savedNote)
      setPriority(savedPriority)
      setDueDate(savedDueDate)
      setDeleteOpen(false)
    }
  }, [open, savedNote, savedPriority, savedDueDate])

  function handleSave() {
    const nextNote = note.trim() === "" ? null : note.trim()
    const patch: {
      id: string
      note?: string | null
      priority?: TodoPriority
      due_date?: string | null
    } = { id: todo.id }

    if (nextNote !== savedNote) patch.note = nextNote
    if (priority !== savedPriority) patch.priority = priority
    if (dueDate !== savedDueDate) patch.due_date = dueDate

    if (
      patch.note === undefined &&
      patch.priority === undefined &&
      patch.due_date === undefined
    ) {
      onOpenChange(false)
      return
    }

    toast.promise(
      updateTodo(patch).then(() => {
        onOpenChange(false)
      }),
      {
        loading: { title: "Saving…" },
        success: { title: "Todo saved" },
        error: { title: "Failed to save" },
      }
    )
  }

  function handleSkipToggle() {
    const nextState = skipped ? "pending" : "skipped"
    toast.promise(
      changeTodoState({ id: todo.id, state: nextState }).then(() => {
        onOpenChange(false)
      }),
      {
        loading: { title: "Updating…" },
        success: { title: "Todo updated" },
        error: { title: "Failed to update" },
      }
    )
  }

  function handleUnassign() {
    toast.promise(
      unassignTodo({ todoId: todo.id }).then(() => {
        onOpenChange(false)
      }),
      {
        loading: { title: "Unassigning…" },
        success: { title: "Todo unassigned" },
        error: { title: "Failed to unassign" },
      }
    )
  }

  function handleDelete() {
    toast.promise(
      deleteTodo(todo.id).then(() => {
        setDeleteOpen(false)
        onOpenChange(false)
      }),
      {
        loading: { title: "Deleting…" },
        success: { title: "Todo deleted" },
        error: { title: "Failed to delete" },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DynamicIcon
              name={todo.icon || DEFAULT_TODO_ICON}
              size="md"
              variant="muted"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <DialogTitle>{todo.name}</DialogTitle>
              <DialogDescription>
                {todo.assignment
                  ? formatTodoAssignment(todo.assignment)
                  : "Todo"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <FieldGroup>
          <TodoPriorityField
            value={priority}
            onChange={setPriority}
            disabled={isPending}
          />
          <TodoDueDateField
            value={dueDate}
            onChange={setDueDate}
            disabled={isPending}
          />
          <Field data-disabled={isPending || undefined}>
            <FieldLabel htmlFor={`${todo.id}-detail-note`}>
              Description
            </FieldLabel>
            <Textarea
              id={`${todo.id}-detail-note`}
              value={note}
              placeholder="Add note"
              disabled={isPending}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {!done ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={handleSkipToggle}
              >
                {skipped ? "Unskip" : "Skip"}
              </Button>
            ) : null}
            {todo.assignment ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={handleUnassign}
              >
                Unassign
              </Button>
            ) : null}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={<Button variant="outline" size="sm" />}
                disabled={isPending}
              >
                Delete
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
                      handleDelete()
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
          </div>
          <div className="flex gap-2 sm:justify-end">
            <DialogClose
              render={<Button variant="outline" disabled={isPending} />}
            >
              Cancel
            </DialogClose>
            <Button disabled={isPending} onClick={handleSave}>
              {isSaving ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { TodoDetailDialog }
