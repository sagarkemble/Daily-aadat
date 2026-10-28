import { useEffect, useState } from "react"

import { DynamicIcon } from "@/components/dynamic-icon"
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
import { formatTodoAssignment } from "../lib/format-todo-assignment"
import { useUpdateTodoNote } from "../hooks/use-update-todo-note"
import type { Todo } from "../types/todo"

const DEFAULT_TODO_ICON = "list-todo"

type TodoDetailDialogProps = {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TodoDetailDialog({ todo, open, onOpenChange }: TodoDetailDialogProps) {
  const saved = todo.note ?? ""
  const [value, setValue] = useState(saved)
  const { mutateAsync: updateNote, isPending } = useUpdateTodoNote()

  useEffect(() => {
    if (open) setValue(saved)
  }, [open, saved])

  function handleSave() {
    const next = value.trim()
    const nextNote = next === "" ? null : next
    if ((nextNote ?? "") === saved) {
      onOpenChange(false)
      return
    }
    toast.promise(
      updateNote({ id: todo.id, note: nextNote }).then(() => {
        onOpenChange(false)
      }),
      {
        loading: { title: "Saving note…" },
        success: { title: "Note saved" },
        error: { title: "Failed to save note" },
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
          <Field data-disabled={isPending || undefined}>
            <FieldLabel htmlFor={`${todo.id}-detail-note`}>
              Description
            </FieldLabel>
            <Textarea
              id={`${todo.id}-detail-note`}
              value={value}
              placeholder="Add note"
              disabled={isPending}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={isPending} />}
          >
            Cancel
          </DialogClose>
          <Button disabled={isPending} onClick={handleSave}>
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { TodoDetailDialog }
