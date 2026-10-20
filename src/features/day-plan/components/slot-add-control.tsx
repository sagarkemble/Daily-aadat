import { useState } from "react"
import { ListIcon, ListTodoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import type { Slot } from "@/features/templates/types/slots"
import { AddTodoDialog } from "./add-todo-dialog/add-todo-dialog"

type SlotAddControlProps = {
  slot: Slot
  dayPlanId: string
  nextSlotOrder: number
  disabled?: boolean
  isAddingActivity?: boolean
  onAddActivities: (activities: ActivityWithConfiguration[]) => void
}

function SlotAddControl({
  slot,
  dayPlanId,
  nextSlotOrder,
  disabled = false,
  isAddingActivity = false,
  onAddActivities,
}: SlotAddControlProps) {
  const [activityOpen, setActivityOpen] = useState(false)
  const [todoOpen, setTodoOpen] = useState(false)
  const canAdd = dayPlanId !== "" && !disabled

  return (
    <>
      <div className="flex flex-col gap-1">
        <Button
          size="sm"
          variant="secondary"
          disabled={!canAdd}
          onClick={() => setActivityOpen(true)}
        >
          <ListIcon data-icon="inline-start" />
          Activity
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!canAdd}
          onClick={() => setTodoOpen(true)}
        >
          <ListTodoIcon data-icon="inline-start" />
          Todo
        </Button>
      </div>
      <ActivityPickerDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        onAdd={onAddActivities}
        isPending={isAddingActivity}
      />
      {dayPlanId !== "" ? (
        <AddTodoDialog
          slot={slot}
          dayPlanId={dayPlanId}
          nextSlotOrder={nextSlotOrder}
          open={todoOpen}
          onOpenChange={setTodoOpen}
        />
      ) : null}
    </>
  )
}

export { SlotAddControl }
