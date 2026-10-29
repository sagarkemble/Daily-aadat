import { useEffect, useState } from "react"
import { Trash2Icon } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { useUnassignTodo } from "@/features/day-plan/hooks/use-unassign-todo"
import { formatTodoAssignment } from "../lib/format-todo-assignment"
import { useDeleteTodo } from "../hooks/use-delete-todo"
import { useUpdateTodo } from "../hooks/use-update-todo"
import type { Todo, TodoPriority } from "../types/todo"
import { TodoDueDateField } from "./todo-due-date-field"
import { TodoPriorityField } from "./todo-priority-field"

type TodoDetailDialogProps = {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TodoDetailDialog({ todo, open, onOpenChange }: TodoDetailDialogProps) {
  const savedName = todo.name
  const savedNote = todo.note ?? ""
  const savedPriority = todo.priority
  const savedDueDate = todo.due_date
  const [name, setName] = useState(savedName)
  const [note, setNote] = useState(savedNote)
  const [priority, setPriority] = useState<TodoPriority>(savedPriority)
  const [dueDate, setDueDate] = useState<string | null>(savedDueDate)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutateAsync: updateTodo, isPending: isSaving } = useUpdateTodo()
  const { mutateAsync: unassignTodo, isPending: isUnassigning } =
    useUnassignTodo()
  const { mutateAsync: deleteTodo, isPending: isDeleting } = useDeleteTodo()
  const isPending = isSaving || isUnassigning || isDeleting
  const trimmedName = name.trim()
  const nameInvalid = trimmedName === ""

  useEffect(() => {
    if (open) {
      setName(savedName)
      setNote(savedNote)
      setPriority(savedPriority)
      setDueDate(savedDueDate)
      setDeleteOpen(false)
    }
  }, [open, savedName, savedNote, savedPriority, savedDueDate])

  function handleSave() {
    if (nameInvalid) return

    const nextNote = note.trim() === "" ? null : note.trim()
    const patch: {
      id: string
      name?: string
      note?: string | null
      priority?: TodoPriority
      due_date?: string | null
    } = { id: todo.id }

    if (trimmedName !== savedName) patch.name = trimmedName
    if (nextNote !== savedNote) patch.note = nextNote
    if (priority !== savedPriority) patch.priority = priority
    if (dueDate !== savedDueDate) patch.due_date = dueDate

    if (
      patch.name === undefined &&
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit to-do</DialogTitle>
          <DialogDescription>
            {todo.assignment
              ? formatTodoAssignment(todo.assignment)
              : "Update the details below."}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-6">
          <Field
            data-invalid={nameInvalid || undefined}
            data-disabled={isPending || undefined}
          >
            <FieldLabel htmlFor={`${todo.id}-detail-name`} className="sr-only">
              Name
            </FieldLabel>
            <Input
              id={`${todo.id}-detail-name`}
              value={name}
              disabled={isPending}
              aria-invalid={nameInvalid}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field data-disabled={isPending || undefined}>
            <FieldLabel htmlFor={`${todo.id}-detail-note`} className="sr-only">
              Description
            </FieldLabel>
            <Textarea
              id={`${todo.id}-detail-note`}
              value={note}
              placeholder="Add a note..."
              rows={3}
              disabled={isPending}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <TodoPriorityField
            value={priority}
            onChange={setPriority}
            disabled={isPending}
          />
          <TodoDueDateField
            mode="presets"
            value={dueDate}
            onChange={setDueDate}
            disabled={isPending}
          />
        </FieldGroup>

        <DialogFooter className="sm:justify-between">
          <div className="flex flex-wrap gap-2">
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
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-destructive hover:bg-destructive/10 hover:text-destructive"
                    )}
                  />
                }
                disabled={isPending}
              >
                <Trash2Icon data-icon="inline-start" />
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
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <DialogClose
              render={<Button variant="outline" disabled={isPending} />}
            >
              Cancel
            </DialogClose>
            <Button disabled={isPending || nameInvalid} onClick={handleSave}>
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
