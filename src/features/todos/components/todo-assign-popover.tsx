import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { CalendarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  calendarDayFromDate,
  dateFromCalendarDay,
} from "@/features/day-plan/lib/calendar-day"
import { useAssignTodo } from "@/features/day-plan/hooks/use-assign-todo"
import { useReassignTodo } from "@/features/day-plan/hooks/use-reassign-todo"
import { SLOT_LABELS, SLOTS, type Slot } from "@/features/templates/types/slots"
import { formatTodoAssignment } from "../lib/format-todo-assignment"
import type { Todo } from "../types/todo"

type TodoAssignPopoverProps = {
  todo: Todo
  disabled?: boolean
}

function TodoAssignPopover({ todo, disabled }: TodoAssignPopoverProps) {
  const isAssigned = Boolean(todo.assignment)
  const defaultDate =
    todo.assignment?.plan_date ?? calendarDayFromDate(new Date())
  const defaultSlot: Slot = todo.assignment?.slot ?? "day_wide"

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(defaultDate)
  const [slot, setSlot] = useState<Slot>(defaultSlot)
  const { mutateAsync: assignTodo, isPending: isAssigning } = useAssignTodo()
  const { mutateAsync: reassignTodo, isPending: isReassigning } =
    useReassignTodo()
  const isPending = isAssigning || isReassigning

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDate(defaultDate)
      setSlot(defaultSlot)
    }
    setOpen(nextOpen)
  }

  function handleSubmit(event: React.MouseEvent) {
    event.stopPropagation()
    const promise = isAssigned
      ? reassignTodo({ todo, date, slot })
      : assignTodo({ todo, date, slot })
    toast
      .promise(promise, {
        loading: { title: isAssigned ? "Moving…" : "Assigning…" },
        success: { title: isAssigned ? "Todo moved" : "Todo assigned" },
        error: {
          title: isAssigned ? "Failed to move" : "Failed to assign",
        },
      })
      .then(() => setOpen(false))
  }

  const triggerLabel = isAssigned
    ? formatTodoAssignment(todo.assignment!)
    : "+ Day"

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        onClick={(event) => event.stopPropagation()}
        render={
          isAssigned ? (
            <Badge variant="secondary" className="cursor-pointer" />
          ) : (
            <Button variant="outline" size="sm" />
          )
        }
      >
        {triggerLabel}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="end"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-3 p-3">
          <Calendar
            mode="single"
            selected={dateFromCalendarDay(date)}
            onSelect={(next) => {
              if (next) setDate(calendarDayFromDate(next))
            }}
          />
          <ToggleGroup
            value={[slot]}
            onValueChange={(value) => {
              const next = value[0]
              if (SLOTS.includes(next as Slot)) setSlot(next as Slot)
            }}
            className="flex-wrap"
            size="sm"
          >
            {SLOTS.map((name) => (
              <ToggleGroupItem key={name} value={name}>
                {SLOT_LABELS[name]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              disabled={isPending}
              onClick={handleSubmit}
            >
              {isAssigned ? "Move" : "Assign"}
            </Button>
            {isAssigned ? (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                render={
                  <Link
                    to="/"
                    search={{ date }}
                    onClick={() => setOpen(false)}
                  />
                }
              >
                <CalendarIcon data-icon="inline-start" />
                Open day
              </Button>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TodoAssignPopover }
