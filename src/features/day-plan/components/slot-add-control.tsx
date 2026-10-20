import { useState } from "react"
import { ListIcon, ListTodoIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import type { Slot } from "@/features/templates/types/slots"
import { AddTodoDialog } from "./add-todo-dialog/add-todo-dialog"

type SlotAddControlProps = {
  slot: Slot
  dayPlanId: string
  nextSlotOrder: number
  empty: boolean
  disabled?: boolean
  isAddingActivity?: boolean
  onAddActivities: (activities: ActivityWithConfiguration[]) => void
}

function SlotAddControl({
  slot,
  dayPlanId,
  nextSlotOrder,
  empty,
  disabled = false,
  isAddingActivity = false,
  onAddActivities,
}: SlotAddControlProps) {
  const [activityOpen, setActivityOpen] = useState(false)
  const [todoOpen, setTodoOpen] = useState(false)
  const canAddTodo = dayPlanId !== ""

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            empty ? (
              <Button
                variant="outline"
                className="h-16 w-full border-dashed"
                disabled={disabled}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Add to slot"
                disabled={disabled}
              />
            )
          }
        >
          <PlusIcon data-icon="inline-start" />
          {empty ? "Add" : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={empty ? "center" : "end"}>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setActivityOpen(true)}>
              <ListIcon />
              Activity
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!canAddTodo}
              onClick={() => setTodoOpen(true)}
            >
              <ListTodoIcon />
              Todo
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ActivityPickerDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        onAdd={onAddActivities}
        isPending={isAddingActivity}
      />
      {canAddTodo ? (
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
