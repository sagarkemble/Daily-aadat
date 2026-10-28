import { useEffect, useState } from "react"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/toast"
import {
  activityTypeItems,
  type ActivityType,
} from "@/features/activity/types/activity"
import type { TemplateActivity } from "../../types/template"
import { DeleteTemplateActivityDialog } from "./delete-template-activity-dialog"
import { useUpdateTemplateItem } from "../hooks/use-update-template-item"

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
  const savedNote = activity.note ?? ""
  const [note, setNote] = useState(savedNote)
  const [type, setType] = useState<ActivityType>(activity.type)
  const [target, setTarget] = useState<number | null>(activity.target)
  const [unit, setUnit] = useState(activity.unit ?? "")
  const { mutateAsync: updateItem, isPending } = useUpdateTemplateItem()
  const name = activity.activity?.name ?? "Activity"
  const icon = activity.activity?.icon

  useEffect(() => {
    if (!open) return
    setNote(savedNote)
    setType(activity.type)
    setTarget(activity.target)
    setUnit(activity.unit ?? "")
  }, [open, savedNote, activity.type, activity.target, activity.unit])

  function handleTypeChange(next: ActivityType) {
    setType(next)
    if (next !== "count") {
      setTarget(null)
      setUnit("")
      return
    }
    setTarget(activity.target ?? activity.activity?.suggested_target ?? null)
    setUnit(activity.unit ?? activity.activity?.suggested_unit ?? "")
  }

  function handleSave() {
    const nextNote = note.trim() === "" ? null : note.trim()
    const nextTarget = type === "count" ? target : null
    const nextUnit =
      type === "count" ? (unit.trim() === "" ? null : unit.trim()) : null
    const unchanged =
      (nextNote ?? "") === savedNote &&
      type === activity.type &&
      nextTarget === activity.target &&
      (nextUnit ?? null) === (activity.unit ?? null)
    if (unchanged) {
      onOpenChange(false)
      return
    }
    toast.promise(
      updateItem({
        id: activity.id,
        note: nextNote,
        type,
        target: nextTarget,
        unit: nextUnit,
      }).then(() => {
        onOpenChange(false)
      }),
      {
        loading: { title: "Saving activity…" },
        success: { title: "Activity saved" },
        error: { title: "Failed to save activity" },
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
            <DialogTitle>{name}</DialogTitle>
          </div>
        </DialogHeader>
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">Type</FieldLegend>
            <Field data-disabled={isPending || undefined}>
              <ToggleGroup
                value={[type]}
                onValueChange={(value) => {
                  const next = value[0]
                  if (
                    next === "check" ||
                    next === "timed" ||
                    next === "count"
                  ) {
                    handleTypeChange(next)
                  }
                }}
                className="flex-wrap"
                size="sm"
                disabled={isPending}
              >
                {activityTypeItems.map((item) => (
                  <ToggleGroupItem key={item.value} value={item.value}>
                    {item.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
          </FieldSet>
          {type === "count" ? (
            <FieldGroup className="flex-row gap-3">
              <Field data-disabled={isPending || undefined}>
                <FieldLabel htmlFor={`${activity.id}-detail-target`}>
                  Target
                </FieldLabel>
                <Input
                  id={`${activity.id}-detail-target`}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="10"
                  disabled={isPending}
                  value={target ?? ""}
                  onChange={(event) =>
                    setTarget(
                      event.target.value === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                />
              </Field>
              <Field data-disabled={isPending || undefined}>
                <FieldLabel htmlFor={`${activity.id}-detail-unit`}>
                  Unit
                </FieldLabel>
                <Input
                  id={`${activity.id}-detail-unit`}
                  placeholder="glasses"
                  disabled={isPending}
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                />
              </Field>
            </FieldGroup>
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
