import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  dateFromCalendarDay,
  calendarDayFromDate,
} from "@/features/day-plan/lib/calendar-day"
import { formatDueDateLabel } from "../lib/format-due-date"

type TodoDueDateFieldProps = {
  id?: string
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  label?: string
}

function TodoDueDateField({
  id,
  value,
  onChange,
  disabled,
  label = "Due date",
}: TodoDueDateFieldProps) {
  const [open, setOpen] = useState(false)
  const today = calendarDayFromDate(new Date())
  const selected = value ? dateFromCalendarDay(value) : undefined
  const buttonLabel = value
    ? formatDueDateLabel(value, today)
    : "No due date"

  return (
    <Field data-disabled={disabled || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start font-normal"
              disabled={disabled}
            />
          }
        >
          <CalendarIcon data-icon="inline-start" />
          {buttonLabel}
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col gap-2 p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(next) => {
              if (!next) return
              onChange(format(next, "yyyy-MM-dd"))
              setOpen(false)
            }}
            captionLayout="dropdown"
          />
          {value ? (
            <div className="border-t p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                disabled={disabled}
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                Clear due date
              </Button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </Field>
  )
}

export { TodoDueDateField }
