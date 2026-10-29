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
import { activityTypeLabels } from "@/features/activity/types/activity"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import { useUpdateTodo } from "@/features/todos/hooks/use-update-todo"
import type { TodoState } from "@/features/todos/types/todo"
import { todoStateFromDayActivity } from "@/features/todos/lib/todo-state-from-day-activity"
import type { DayPlanActivity } from "../types/day-plan"
import { useUpdateDayItemNote } from "../hooks/use-update-day-item-note"
import { placementIconName } from "../lib/placement-icon"

type DayActivityDetailDialogProps = {
  activity: DayPlanActivity
  open: boolean
  onOpenChange: (open: boolean) => void
}

function kindLabel(activity: DayPlanActivity) {
  if (activity.kind === "todo") return "Todo"
  if (activity.type) return activityTypeLabels[activity.type]
  return "Activity"
}

function todoStateFromActivity(state: DayPlanActivity["state"]): TodoState {
  return todoStateFromDayActivity(state)
}

function DayActivityDetailDialog({
  activity,
  open,
  onOpenChange,
}: DayActivityDetailDialogProps) {
  const isTodo = activity.kind === "todo"
  const savedNote = activity.note_snapshot ?? ""
  const [note, setNote] = useState(savedNote)
  const { mutateAsync: updateItemNote, isPending: isSavingItem } =
    useUpdateDayItemNote()
  const { mutateAsync: updateTodo, isPending: isSavingTodo } = useUpdateTodo()
  const name = activity.name_snapshot
  const icon = placementIconName(activity)
  const isPending = isSavingItem || isSavingTodo

  useEffect(() => {
    if (open) {
      setNote(savedNote)
    }
  }, [open, savedNote])

  function handleSave() {
    const nextNote = note.trim() === "" ? null : note.trim()
    if (isTodo && activity.todo_id) {
      if (nextNote === savedNote) {
        onOpenChange(false)
        return
      }

      toast.promise(
        updateTodo({ id: activity.todo_id, note: nextNote }).then(() => {
          onOpenChange(false)
        }),
        {
          loading: { title: "Saving…" },
          success: { title: "Todo saved" },
          error: { title: "Failed to save" },
        }
      )
      return
    }

    if ((nextNote ?? "") === savedNote) {
      onOpenChange(false)
      return
    }
    toast.promise(
      updateItemNote({ id: activity.id, note_snapshot: nextNote }).then(() => {
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
            {icon ? (
              <DynamicIcon name={icon} size="md" variant="muted" />
            ) : null}
            <div className="flex min-w-0 flex-col gap-1">
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription>{kindLabel(activity)}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <FieldGroup>
          {isTodo && activity.priority ? (
            <TodoMeta
              priority={activity.priority}
              dueDate={activity.due_date}
              state={todoStateFromActivity(activity.state)}
            />
          ) : null}
          <Field data-disabled={isPending || undefined}>
            <FieldLabel htmlFor={`${activity.id}-detail-note`}>
              Description
            </FieldLabel>
            <Textarea
              id={`${activity.id}-detail-note`}
              value={note}
              placeholder="Add note"
              disabled={isPending}
              onChange={(event) => setNote(event.target.value)}
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

export { DayActivityDetailDialog }
