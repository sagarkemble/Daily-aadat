import { useId, useState } from "react"
import { format, parseISO } from "date-fns"
import { SkipForwardIcon, Trash2Icon } from "lucide-react"

import { DynamicIcon } from "@/components/dynamic-icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { activityIconWellClass } from "@/features/activity/lib/activity-style"
import {
  activityTypeItems,
  type ActivityType,
} from "@/features/activity/types/activity"
import { formatSlotRange, toClock } from "@/features/templates/lib/slot-time"
import { SLOT_LABELS, SLOTS, type Slot } from "@/features/templates/types/slots"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import { useUpdateTodo } from "@/features/todos/hooks/use-update-todo"
import { todoStateFromDayActivity } from "@/features/todos/lib/todo-state-from-day-activity"
import { cn } from "@/lib/utils"
import { useDeleteActivity } from "../hooks/use-delete-activity"
import { useUnassignTodo } from "../hooks/use-unassign-todo"
import {
  useUpdateDayItem,
  type DayItemPatch,
} from "../hooks/use-update-day-item"
import type { DayItemCommand } from "../lib/day-item-command"
import { useDayPlanContext } from "../lib/day-plan-context"
import { placementIconName } from "../lib/placement-icon"
import {
  PLACEMENT_STATUS_BADGE_CLASS,
  PLACEMENT_STATUS_LABELS,
} from "../lib/placement-status"
import type { DayPlanActivity } from "../types/day-plan"
import { DayActivityProgress } from "./day-activity-progress"

type DayActivityDetailDialogProps = {
  activity: DayPlanActivity
  open: boolean
  disabled?: boolean
  onOpenChange: (open: boolean) => void
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}

type Draft = {
  note: string
  slot: Slot
  type: ActivityType | null
  target: number | null
  unit: string
}

function draftFrom(activity: DayPlanActivity): Draft {
  return {
    note: activity.note_snapshot ?? "",
    slot: activity.slot,
    type: activity.type,
    target: activity.target,
    unit: activity.unit ?? "",
  }
}

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed === "" ? null : trimmed
}

function DayActivityDetailDialog({
  activity,
  open,
  disabled = false,
  onOpenChange,
  onCommand,
}: DayActivityDetailDialogProps) {
  const formId = useId()
  const { date, board } = useDayPlanContext()
  const isTodo = activity.kind === "todo"
  const [draft, setDraft] = useState<Draft>(() => draftFrom(activity))
  const [confirmRemove, setConfirmRemove] = useState(false)
  const { mutateAsync: updateItem, isPending: isSavingItem } =
    useUpdateDayItem()
  const { mutateAsync: updateTodo, isPending: isSavingTodo } = useUpdateTodo()
  const { mutateAsync: deleteActivity, isPending: isDeleting } =
    useDeleteActivity()
  const { mutateAsync: unassignTodo, isPending: isUnassigning } =
    useUnassignTodo()
  const isSaving = isSavingItem || isSavingTodo
  const isRemoving = isDeleting || isUnassigning
  const isBusy = isSaving || isRemoving
  const icon = placementIconName(activity)

  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    // Reset only on open; live progress updates must not wipe edits.
    if (open) setDraft(draftFrom(activity))
  }

  const slotGroup = board?.[activity.slot]
  const start = toClock(slotGroup?.start_time)
  const end = toClock(slotGroup?.end_time)
  const whenParts = [
    SLOT_LABELS[activity.slot],
    start && end ? formatSlotRange(start, end) : null,
    format(parseISO(date), "EEE, MMM d"),
  ].filter(Boolean)

  const savedNote = activity.note_snapshot ?? ""
  const noteChanged = draft.note.trim() !== savedNote.trim()
  const slotChanged = draft.slot !== activity.slot
  const typeChanged = !isTodo && draft.type !== activity.type
  const targetChanged =
    !isTodo &&
    (draft.target !== activity.target ||
      emptyToNull(draft.unit) !== (activity.unit ?? null))
  const isDirty = noteChanged || slotChanged || typeChanged || targetChanged
  const targetInvalid =
    !isTodo &&
    draft.type === "count" &&
    (draft.target == null || draft.target < 1)

  function patchDraft(next: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...next }))
  }

  function handleTypeChange(next: ActivityType) {
    if (next === "count") {
      patchDraft({
        type: next,
        target: activity.type === "count" ? activity.target : null,
        unit: activity.type === "count" ? (activity.unit ?? "") : "",
      })
      return
    }
    patchDraft({
      type: next,
      target:
        next === "timed" && activity.type === "timed" ? activity.target : null,
      unit: next === "timed" ? "min" : "",
    })
  }

  function nextSortOrder(slot: Slot) {
    const orders = (board?.[slot]?.activities ?? []).map(
      (item) => item.slot_order
    )
    return orders.length === 0 ? 0 : Math.max(...orders) + 1
  }

  async function save() {
    const patch: DayItemPatch = {}
    if (slotChanged) {
      patch.slot = draft.slot
      patch.sort_order = nextSortOrder(draft.slot)
    }
    if (!isTodo) {
      if (noteChanged) patch.note_snapshot = emptyToNull(draft.note)
      if (typeChanged && draft.type) {
        patch.type = draft.type
        patch.state = "pending"
        patch.count_value = 0
        patch.duration_ms = 0
        patch.started_at = null
        patch.stopped_at = null
      }
      if (typeChanged || targetChanged) {
        patch.target = draft.type === "check" ? null : draft.target
        patch.unit = draft.type === "check" ? null : emptyToNull(draft.unit)
      }
    }

    const writes: Promise<unknown>[] = []
    if (Object.keys(patch).length > 0) {
      writes.push(updateItem({ id: activity.id, patch }))
    }
    if (isTodo && noteChanged && activity.todo_id) {
      writes.push(
        updateTodo({ id: activity.todo_id, note: emptyToNull(draft.note) })
      )
    }
    await Promise.all(writes)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isDirty) {
      onOpenChange(false)
      return
    }
    if (targetInvalid) return
    toast
      .promise(save(), {
        loading: { title: "Saving…" },
        success: {
          title: slotChanged ? `Moved to ${SLOT_LABELS[draft.slot]}` : "Saved",
        },
        error: (error: Error) => ({
          title: "Couldn't save",
          description: error.message.includes("one_activity_per_slot")
            ? `${activity.name_snapshot} is already in ${SLOT_LABELS[draft.slot]}.`
            : undefined,
        }),
      })
      .then(() => onOpenChange(false))
  }

  function handleRemove() {
    const removal = isTodo
      ? unassignTodo({ dayItemId: activity.id })
      : deleteActivity(activity.id)
    toast
      .promise(removal, {
        loading: { title: "Removing…" },
        success: {
          title: isTodo ? "Todo sent back to your pile" : "Removed from day",
        },
        error: { title: "Couldn't remove" },
      })
      .then(() => {
        setConfirmRemove(false)
        onOpenChange(false)
      })
  }

  const skipped = activity.state === "skipped"
  const canSkip = !isTodo

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-start gap-3 pr-8">
              {icon ? (
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-md",
                    activityIconWellClass(activity.activity_id ?? activity.id)
                  )}
                >
                  <DynamicIcon name={icon} size="md" />
                </span>
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-lg">
                    {activity.name_snapshot}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={PLACEMENT_STATUS_BADGE_CLASS[activity.state]}
                  >
                    {PLACEMENT_STATUS_LABELS[activity.state]}
                  </Badge>
                </div>
                <DialogDescription>{whenParts.join(" · ")}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DayActivityProgress
            activity={activity}
            disabled={disabled || isBusy}
            onCommand={(command) => onCommand(activity, command)}
          />

          <form id={formId} onSubmit={handleSubmit}>
            <FieldGroup>
              {isTodo && activity.priority ? (
                <TodoMeta
                  priority={activity.priority}
                  dueDate={activity.due_date}
                  state={todoStateFromDayActivity(activity.state)}
                />
              ) : null}

              <Field data-disabled={isBusy || undefined}>
                <FieldLabel htmlFor={`${formId}-slot`}>Slot</FieldLabel>
                <Select
                  items={SLOTS.map((slot) => ({
                    value: slot,
                    label: SLOT_LABELS[slot],
                  }))}
                  value={draft.slot}
                  onValueChange={(value) => {
                    if (value) patchDraft({ slot: value as Slot })
                  }}
                  disabled={isBusy}
                >
                  <SelectTrigger id={`${formId}-slot`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {SLOT_LABELS[slot]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {!isTodo && draft.type ? (
                <FieldSet>
                  <FieldLegend variant="label">Type</FieldLegend>
                  <Field data-disabled={isBusy || undefined}>
                    <ToggleGroup
                      value={[draft.type]}
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
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                    >
                      {activityTypeItems.map(
                        ({ icon: TypeIcon, label, value }) => (
                          <ToggleGroupItem key={value} value={value}>
                            <TypeIcon data-icon="inline-start" />
                            {label}
                          </ToggleGroupItem>
                        )
                      )}
                    </ToggleGroup>
                    {typeChanged ? (
                      <p className="text-xs text-muted-foreground">
                        Changing the type resets today's progress.
                      </p>
                    ) : null}
                  </Field>
                </FieldSet>
              ) : null}

              {!isTodo && draft.type === "count" ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    data-invalid={targetInvalid || undefined}
                    data-disabled={isBusy || undefined}
                  >
                    <FieldLabel htmlFor={`${formId}-target`}>Target</FieldLabel>
                    <Input
                      id={`${formId}-target`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="8"
                      aria-invalid={targetInvalid}
                      disabled={isBusy}
                      value={draft.target ?? ""}
                      onChange={(event) =>
                        patchDraft({
                          target:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </Field>
                  <Field data-disabled={isBusy || undefined}>
                    <FieldLabel htmlFor={`${formId}-unit`}>Unit</FieldLabel>
                    <Input
                      id={`${formId}-unit`}
                      placeholder="glasses"
                      disabled={isBusy}
                      value={draft.unit}
                      onChange={(event) =>
                        patchDraft({ unit: event.target.value })
                      }
                    />
                  </Field>
                </div>
              ) : null}

              {!isTodo && draft.type === "timed" ? (
                <Field data-disabled={isBusy || undefined}>
                  <FieldLabel htmlFor={`${formId}-goal`}>
                    Goal in minutes
                  </FieldLabel>
                  <Input
                    id={`${formId}-goal`}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder="Optional, e.g. 30"
                    disabled={isBusy}
                    value={draft.target ?? ""}
                    onChange={(event) =>
                      patchDraft({
                        target:
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                        unit: "min",
                      })
                    }
                  />
                </Field>
              ) : null}

              <Field data-disabled={isBusy || undefined}>
                <FieldLabel htmlFor={`${formId}-note`}>Note</FieldLabel>
                <Textarea
                  id={`${formId}-note`}
                  value={draft.note}
                  placeholder={
                    isTodo
                      ? "Details for this todo"
                      : "Anything to remember for today"
                  }
                  disabled={isBusy}
                  onChange={(event) => patchDraft({ note: event.target.value })}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      (event.metaKey || event.ctrlKey)
                    ) {
                      event.currentTarget.form?.requestSubmit()
                    }
                  }}
                />
              </Field>
            </FieldGroup>
          </form>

          <DialogFooter className="sm:justify-between">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={isBusy}
                onClick={() => setConfirmRemove(true)}
              >
                <Trash2Icon data-icon="inline-start" />
                {isTodo ? "Back to pile" : "Remove"}
              </Button>
              {canSkip && !skipped ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled || isBusy}
                  onClick={() => onCommand(activity, { type: "skip" })}
                >
                  <SkipForwardIcon data-icon="inline-start" />
                  Skip today
                </Button>
              ) : null}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <DialogClose
                render={
                  <Button type="button" variant="outline" disabled={isSaving} />
                }
              >
                {isDirty ? "Cancel" : "Close"}
              </DialogClose>
              <Button
                type="submit"
                form={formId}
                disabled={isBusy || !isDirty || targetInvalid}
              >
                {isSaving ? <Spinner data-icon="inline-start" /> : null}
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmRemove}
        onOpenChange={(next) => {
          if (!isRemoving) setConfirmRemove(next)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isTodo
                ? "Send this todo back to your pile?"
                : "Remove from today?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isTodo
                ? `${activity.name_snapshot} stays in your todos, just not on this day.`
                : `${activity.name_snapshot} and today's progress on it will be removed. Your template is not changed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isRemoving}
              onClick={(event) => {
                event.preventDefault()
                handleRemove()
              }}
            >
              {isRemoving ? <Spinner data-icon="inline-start" /> : null}
              {isTodo ? "Back to pile" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { DayActivityDetailDialog }
