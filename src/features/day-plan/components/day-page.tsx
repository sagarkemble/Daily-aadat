import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ActivityPickerSheet,
  type ActivityPlacement,
} from "@/features/activity/components/activity-picker-sheet"
import { toast } from "@/components/ui/toast"
import { SLOTS, type Slot } from "@/features/templates/types/slots"
import { useAddDayItem } from "../hooks/use-add-day-item"
import { useDayItemAction } from "../hooks/use-day-item-action"
import { useDayPlan } from "../hooks/use-day-plan"
import { useEndDay, useReopenDay } from "../hooks/use-end-day"
import { useNow } from "../hooks/use-now"
import { useRemoveDayItem } from "../hooks/use-remove-day-item"
import { useReorderDayItems } from "../hooks/use-reorder-day-items"
import { useUnplanDay } from "../hooks/use-unplan-day"
import { addDays, formatDayHeading, todayDate } from "../lib/dates"
import { pendingCount } from "../lib/day-status"
import type { DayItem } from "../types/day-plan"
import { ApplyTemplateSheet } from "./apply-template-sheet"
import { ConfirmDialog } from "./confirm-dialog"
import { DayHeader } from "./day-header"
import { DaySlotSection } from "./day-slot-section"

type DayPageProps = {
  planDate: string
  onDateChange: (nextDate: string) => void
}

function emptyItemsBySlot(): Record<Slot, DayItem[]> {
  return {
    early_morning: [],
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  }
}

export function DayPage({ planDate, onDateChange }: DayPageProps) {
  const today = todayDate()
  const { data, isPending, isError, error } = useDayPlan(planDate)
  const { mutate: addItem, isPending: isAdding } = useAddDayItem(planDate)
  const { mutate: runAction, isPending: isActing } = useDayItemAction(planDate)
  const { mutate: removeItem, isPending: isRemoving } =
    useRemoveDayItem(planDate)
  const { mutate: reorderItems } = useReorderDayItems(planDate)
  const { mutate: unplanDay, isPending: isUnplanning } = useUnplanDay(planDate)
  const { mutate: endDay, isPending: isEnding } = useEndDay(planDate)
  const { mutate: reopenDay, isPending: isReopening } = useReopenDay(planDate)

  const [applyOpen, setApplyOpen] = useState(false)
  const [pickerSlot, setPickerSlot] = useState<Slot | null>(null)
  const [endOpen, setEndOpen] = useState(false)
  const [reopenOpen, setReopenOpen] = useState(false)
  const [unplanOpen, setUnplanOpen] = useState(false)
  const [undoTimedItem, setUndoTimedItem] = useState<DayItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const plan = data?.plan ?? null
  const items = data?.items
  const locked = plan?.status === "ended"
  const status = plan?.status ?? "empty"
  const isEditingView = isEditing && !locked && status !== "empty"
  const activityItems = (items ?? []).filter((item) => item.kind === "activity")
  const openCount = pendingCount(items ?? [])
  const hasRunning = (items ?? []).some((item) => item.state === "running")
  const now = useNow(hasRunning)

  const itemsBySlot = useMemo(() => {
    const map = emptyItemsBySlot()
    for (const item of items ?? []) {
      if (item.kind !== "activity" || item.slot === "unslotted") continue
      map[item.slot].push(item)
    }
    for (const slot of SLOTS) {
      map[slot].sort((a, b) => a.sort_order - b.sort_order)
    }
    return map
  }, [items])

  const excludeActivityIds = useMemo(() => {
    if (!pickerSlot) return []
    return itemsBySlot[pickerSlot]
      .map((item) => item.activity_id)
      .filter((id): id is string => !!id)
  }, [itemsBySlot, pickerSlot])

  function handleActionError(err: Error) {
    toast.add({
      title: "Error",
      description: err.message,
      type: "error",
    })
  }

  function handleConfirmPlacement(placement: ActivityPlacement) {
    if (!pickerSlot) return
    addItem(
      { planDate, slot: pickerSlot, placement },
      {
        onSuccess: () => {
          toast.add({ title: "Activity added", type: "success" })
          setPickerSlot(null)
        },
        onError: handleActionError,
      }
    )
  }

  if (isPending) return <div>Loading…</div>
  if (isError) return <div>{error.message}</div>

  return (
    <div className="flex flex-col gap-6">
      <DayHeader
        heading={formatDayHeading(planDate, today)}
        isToday={planDate === today}
        templateName={plan?.templates?.name ?? "No template"}
        status={status}
        locked={locked}
        isEditing={isEditingView}
        onPrev={() => onDateChange(addDays(planDate, -1))}
        onNext={() => onDateChange(addDays(planDate, 1))}
        onToday={() => onDateChange(today)}
        onApply={() => setApplyOpen(true)}
        onEdit={() => setIsEditing((value) => !value)}
        onUnplan={() => setUnplanOpen(true)}
        onEnd={() => setEndOpen(true)}
        onReopen={() => setReopenOpen(true)}
      />

      {isEditingView ? (
        <p className="text-sm text-muted-foreground">
          Rearrange or delete activities on this date. The template stays
          unchanged.
        </p>
      ) : null}

      {status === "empty" ? (
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <p className="text-sm font-medium">Let’s plan this day</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply a template to fill the five slots, or add activities one by
            one.
          </p>
          <Button
            type="button"
            className="mt-3"
            size="sm"
            onClick={() => setApplyOpen(true)}
          >
            Apply template
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {SLOTS.map((slot) => (
          <DaySlotSection
            key={slot}
            slot={slot}
            items={itemsBySlot[slot]}
            locked={locked}
            isEditing={isEditingView}
            now={now}
            isPending={isActing || isRemoving}
            onAdd={setPickerSlot}
            onAction={(action) =>
              runAction(action, { onError: handleActionError })
            }
            onUndoTimed={setUndoTimedItem}
            onRemove={(itemId) => {
              if (!plan) return
              removeItem(
                { itemId, planId: plan.id },
                {
                  onSuccess: () => {
                    toast.add({
                      title: "Removed from this day",
                      type: "success",
                    })
                  },
                  onError: handleActionError,
                }
              )
            }}
            onReorder={(orderedIds) =>
              reorderItems(orderedIds, { onError: handleActionError })
            }
          />
        ))}
      </div>

      <ApplyTemplateSheet
        open={applyOpen}
        onOpenChange={setApplyOpen}
        planDate={planDate}
        activityCount={activityItems.length}
      />

      <ActivityPickerSheet
        open={pickerSlot != null}
        onOpenChange={(open) => {
          if (!open) setPickerSlot(null)
        }}
        excludeActivityIds={excludeActivityIds}
        onConfirm={handleConfirmPlacement}
        isPending={isAdding}
      />

      <ConfirmDialog
        open={unplanOpen}
        onOpenChange={setUnplanOpen}
        title="Unplan this day?"
        description="All activities on this date will be cleared. Templates stay unchanged. You can apply a different one after."
        confirmLabel="Unplan day"
        confirmVariant="destructive"
        isPending={isUnplanning}
        onConfirm={() => {
          if (!plan) {
            setUnplanOpen(false)
            return
          }
          unplanDay(plan.id, {
            onSuccess: () => {
              toast.add({ title: "Day cleared", type: "success" })
              setUnplanOpen(false)
              setIsEditing(false)
            },
            onError: handleActionError,
          })
        }}
      />

      <ConfirmDialog
        open={endOpen}
        onOpenChange={setEndOpen}
        title="End this day?"
        description={
          openCount > 0
            ? `${openCount} still open — end anyway? Running timers will be stopped and saved.`
            : "This locks Done, Start, and +1 until you re-open."
        }
        confirmLabel="End day"
        isPending={isEnding}
        onConfirm={() => {
          if (!plan) {
            setEndOpen(false)
            return
          }
          endDay(plan.id, {
            onSuccess: () => {
              toast.add({ title: "Day ended", type: "success" })
              setEndOpen(false)
            },
            onError: handleActionError,
          })
        }}
      />

      <ConfirmDialog
        open={reopenOpen}
        onOpenChange={setReopenOpen}
        title="Re-open this day?"
        description="You can edit activities again, then end the day later."
        confirmLabel="Re-open"
        isPending={isReopening}
        onConfirm={() => {
          if (!plan) {
            setReopenOpen(false)
            return
          }
          reopenDay(plan.id, {
            onSuccess: () => {
              toast.add({ title: "Day re-opened", type: "success" })
              setReopenOpen(false)
            },
            onError: handleActionError,
          })
        }}
      />

      <ConfirmDialog
        open={undoTimedItem != null}
        onOpenChange={(open) => {
          if (!open) setUndoTimedItem(null)
        }}
        title="Clear this session?"
        description="Duration will be removed and the activity goes back to pending."
        confirmLabel="Clear session"
        confirmVariant="destructive"
        onConfirm={() => {
          if (!undoTimedItem) return
          runAction(
            { type: "undo", item: undoTimedItem },
            {
              onSuccess: () => setUndoTimedItem(null),
              onError: handleActionError,
            }
          )
        }}
      />
    </div>
  )
}
