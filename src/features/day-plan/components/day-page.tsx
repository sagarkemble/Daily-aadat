import { useEffect, useState } from "react"

import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import { toast } from "@/components/ui/toast"
import { SLOTS, type Slot } from "@/features/templates/types/slots"
import { useAddActivity } from "../hooks/use-add-activity"
import { useFetchDayPlan } from "../hooks/use-fetch-day-plan"
import type { NewDayPlanActivity } from "../types/day-plan"
import { DayPlanActions } from "./day-plan-actions"
import DaySlot from "./day-slot"
import { DayRail } from "./day-rail"

type DayPageProps = {
  date: string
}

function nextSortOrder(slotOrders: number[]) {
  if (slotOrders.length === 0) return 0
  return Math.max(...slotOrders) + 1
}

const DayPage = ({ date }: DayPageProps) => {
  const { data, isLoading, error } = useFetchDayPlan(date)
  const [editing, setEditing] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const { mutateAsync: addActivities, isPending: isAdding } = useAddActivity()
  const isPlanned = data != null

  useEffect(() => {
    if (!isPlanned) {
      setEditing(false)
    }
  }, [isPlanned])

  if (error) return <div>Error: {error.message}</div>

  function handleAddActivities(
    configured: ActivityWithConfiguration[],
    slot?: Slot
  ) {
    if (!slot || !data) return
    const sortOrderStart = nextSortOrder(
      (data.activities[slot]?.activities ?? []).map(
        (activity) => activity.slot_order
      )
    )
    const dayItems: NewDayPlanActivity[] = configured.map(
      (activity, index) => ({
        day_plan_id: data.id,
        kind: "activity",
        activity_id: activity.id,
        name_snapshot: activity.name,
        icon_snapshot: activity.icon,
        type: activity.type,
        target: activity.type === "count" ? activity.target : null,
        unit: activity.type === "count" ? activity.unit : null,
        slot,
        sort_order: sortOrderStart + index,
        state: "pending",
        note_snapshot: null,
      })
    )
    toast.promise(addActivities(dayItems), {
      loading: { title: "Adding activities…" },
      success: { title: "Activities added" },
      error: { title: "Failed to add activities" },
    })
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="lg:hidden">
          <DayPlanActions
            date={date}
            isPlanned={isPlanned}
            editing={editing}
            onEditingChange={setEditing}
            onAddActivity={() => setPickerOpen(true)}
            isAddingActivity={isAdding}
          />
        </div>
        {SLOTS.map((slot) => (
          <DaySlot
            key={slot}
            slot={slot}
            activities={data?.activities[slot]?.activities ?? []}
            startTime={data?.activities[slot]?.start_time ?? null}
            endTime={data?.activities[slot]?.end_time ?? null}
            dayPlanId={data?.id || ""}
            isLoading={isLoading}
            editing={editing}
          />
        ))}
      </div>
      <DayRail
        date={date}
        isPlanned={isPlanned}
        editing={editing}
        onEditingChange={setEditing}
        onAddActivity={() => setPickerOpen(true)}
        isAddingActivity={isAdding}
      />
      {isPlanned ? (
        <ActivityPickerDialog
          requireSlot
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onAdd={handleAddActivities}
          isPending={isAdding}
        />
      ) : null}
    </div>
  )
}

export { DayPage }
