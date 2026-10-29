import { useState } from "react"
import { ListTodoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Slot } from "@/features/templates/types/slots"
import { AddTodoDialog } from "./add-todo-dialog/add-todo-dialog"

type SlotAddControlProps = {
  slot: Slot
  date: string
  dayPlanId: string
  nextSlotOrder: number
  disabled?: boolean
}

function SlotAddControl({
  slot,
  date,
  dayPlanId,
  nextSlotOrder,
  disabled = false,
}: SlotAddControlProps) {
  const [todoOpen, setTodoOpen] = useState(false)
  const canAdd = !disabled

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
      <AddTodoDialog
        slot={slot}
        date={date}
        dayPlanId={dayPlanId || undefined}
        nextSlotOrder={nextSlotOrder}
        open={todoOpen}
        onOpenChange={setTodoOpen}
      />
    </>
  )
}

export { SlotAddControl }
