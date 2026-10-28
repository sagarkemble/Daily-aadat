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
import type { TemplateActivity } from "../../types/template"
import { DeleteTemplateActivityDialog } from "./delete-template-activity-dialog"
import { useUpdateTemplateItemNote } from "../hooks/use-update-template-item-note"

type TemplateActivityDetailDialogProps = {
  activity: TemplateActivity
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TemplateActivityDetailDialog({
  activity,
  open,
  onOpenChange,
}: TemplateActivityDetailDialogProps) {
  const saved = activity.note ?? ""
  const [value, setValue] = useState(saved)
  const { mutateAsync: updateNote, isPending } = useUpdateTemplateItemNote()
  const name = activity.activity?.name ?? "Activity"
  const icon = activity.activity?.icon

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
      updateNote({ id: activity.id, note: nextNote }).then(() => {
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
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              {icon ? <DynamicIcon name={icon} /> : null}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription>
                {activityTypeLabels[activity.type]}
              </DialogDescription>
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
          <DeleteTemplateActivityDialog
            activityId={activity.id}
            name={name}
            onDeleted={() => onOpenChange(false)}
          />
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

export { TemplateActivityDetailDialog }
