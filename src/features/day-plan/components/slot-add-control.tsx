import { useState } from "react"
import { ListTodoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isTimedSlot, type Slot } from "@/features/templates/types/slots"
import { AddTodoDialog } from "./add-todo-dialog/add-todo-dialog"

type SlotAddControlProps = {
  slot: Slot
  dayPlanId: string
  nextSlotOrder: number
  disabled?: boolean
}

function SlotAddControl({
  slot,
  dayPlanId,
  nextSlotOrder,
  disabled = false,
}: SlotAddControlProps) {
  const [todoOpen, setTodoOpen] = useState(false)
  const canAdd = dayPlanId !== "" && !disabled

  if (!isTimedSlot(slot)) return null

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        disabled={!canAdd}
        onClick={() => setTodoOpen(true)}
      >
        <ListTodoIcon data-icon="inline-start" />
        Todo
      </Button>
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
