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
import { TodoDueDateField } from "@/features/todos/components/todo-due-date-field"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import { TodoPriorityField } from "@/features/todos/components/todo-priority-field"
import { useUpdateTodo } from "@/features/todos/hooks/use-update-todo"
import type { TodoPriority, TodoState } from "@/features/todos/types/todo"
import type { DayPlanActivity } from "../types/day-plan"
import { useDeleteActivity } from "../hooks/use-delete-activity"
import { useUpdateDayItemNote } from "../hooks/use-update-day-item-note"
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
import { Trash2Icon } from "lucide-react"

type DayActivityDetailDialogProps = {
  activity: DayPlanActivity
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: boolean
  onUnassign?: (activityId: string) => void
}

function kindLabel(activity: DayPlanActivity) {
  if (activity.kind === "todo") return "Todo"
  if (activity.type) return activityTypeLabels[activity.type]
  return "Activity"
}

function todoStateFromActivity(state: DayPlanActivity["state"]): TodoState {
  if (state === "running") return "pending"
  return state
}

function DayActivityDetailDialog({
  activity,
  open,
  onOpenChange,
  editing = false,
  onUnassign,
}: DayActivityDetailDialogProps) {
  const isTodo = activity.kind === "todo"
  const savedNote = activity.note_snapshot ?? ""
  const savedPriority = activity.priority ?? "medium"
  const savedDueDate = activity.due_date
  const [note, setNote] = useState(savedNote)
  const [priority, setPriority] = useState<TodoPriority>(savedPriority)
  const [dueDate, setDueDate] = useState<string | null>(savedDueDate)
  const { mutateAsync: updateItemNote, isPending: isSavingItem } =
    useUpdateDayItemNote()
  const { mutateAsync: updateTodo, isPending: isSavingTodo } = useUpdateTodo()
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity()
  const name = activity.name_snapshot
  const icon = activity.icon_snapshot
  const isPending = isSavingItem || isSavingTodo

  useEffect(() => {
    if (open) {
      setNote(savedNote)
      setPriority(savedPriority)
      setDueDate(savedDueDate)
    }
  }, [open, savedNote, savedPriority, savedDueDate])

  function handleSave() {
    const nextNote = note.trim() === "" ? null : note.trim()
    if (isTodo && activity.todo_id) {
      const patch: {
        id: string
        note?: string | null
        priority?: TodoPriority
        due_date?: string | null
      } = { id: activity.todo_id }

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

  const todoMetaEditable = isTodo && editing

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
          {isTodo && !todoMetaEditable && activity.priority ? (
            <TodoMeta
              priority={activity.priority}
              dueDate={activity.due_date}
              state={todoStateFromActivity(activity.state)}
            />
          ) : null}
          {todoMetaEditable ? (
            <>
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
            </>
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
        <DialogFooter className="sm:justify-between">
          {editing && activity.kind === "todo" ? (
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                onUnassign?.(activity.id)
                onOpenChange(false)
              }}
            >
              Unassign
            </Button>
          ) : editing ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" disabled={isDeleting} />}
              >
                <Trash2Icon data-icon="inline-start" />
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes it from the day. This cannot be undone.
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
                      deleteActivity(activity.id, {
                        onSuccess: () => onOpenChange(false),
                      })
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
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DayActivityDetailDialog }
