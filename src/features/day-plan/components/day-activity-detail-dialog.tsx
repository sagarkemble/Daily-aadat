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
import { useUpdateTodoNote } from "@/features/todos/hooks/use-update-todo-note"
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

function DayActivityDetailDialog({
  activity,
  open,
  onOpenChange,
  editing = false,
  onUnassign,
}: DayActivityDetailDialogProps) {
  const saved = activity.note_snapshot ?? ""
  const [value, setValue] = useState(saved)
  const { mutateAsync: updateItemNote, isPending: isSavingItem } =
    useUpdateDayItemNote()
  const { mutateAsync: updateTodoNote, isPending: isSavingTodo } =
    useUpdateTodoNote()
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity()
  const name = activity.name_snapshot
  const icon = activity.icon_snapshot
  const isPending = isSavingItem || isSavingTodo

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
    const save =
      activity.kind === "todo" && activity.todo_id
        ? updateTodoNote({ id: activity.todo_id, note: nextNote })
        : updateItemNote({ id: activity.id, note_snapshot: nextNote })
    toast.promise(
      save.then(() => {
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
          <Field data-disabled={isPending || undefined}>
            <FieldLabel htmlFor={`${activity.id}-detail-note`}>
              Description
            </FieldLabel>
            <Textarea
              id={`${activity.id}-detail-note`}
              value={value}
              placeholder="Add note"
              disabled={isPending}
              onChange={(event) => setValue(event.target.value)}
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
