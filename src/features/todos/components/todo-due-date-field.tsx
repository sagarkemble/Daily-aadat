import { useMemo, useState } from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
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
  mode?: "calendar" | "presets"
}

function TodoDueDateField({
  id,
  value,
  onChange,
  disabled,
  label = "Due date",
  mode = "calendar",
}: TodoDueDateFieldProps) {
  const [open, setOpen] = useState(false)
  const today = calendarDayFromDate(new Date())
  const presetDays = useMemo(
    () => ({
      today,
      tomorrow: calendarDayFromDate(addDays(new Date(), 1)),
      nextWeek: calendarDayFromDate(addDays(new Date(), 7)),
    }),
    [today]
  )

  const presetValues = useMemo(
    () => [presetDays.today, presetDays.tomorrow, presetDays.nextWeek],
    [presetDays]
  )

  const isCustomDate =
    value != null && !presetValues.includes(value)

  if (mode === "presets") {
    const toggleValue =
      value != null && presetValues.includes(value) ? [value] : []

    const pickLabel =
      value != null && isCustomDate
        ? formatDueDateLabel(value, today)
        : "Pick date"

    return (
      <FieldSet>
        <FieldLegend variant="label">{label}</FieldLegend>
        <Field data-disabled={disabled || undefined}>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              value={toggleValue}
              onValueChange={(next) => {
                const picked = next[0]
                if (typeof picked === "string" && presetValues.includes(picked)) {
                  onChange(picked)
                }
              }}
              disabled={disabled}
              variant="outline"
              size="sm"
              className="flex-wrap"
            >
              <ToggleGroupItem value={presetDays.today}>Today</ToggleGroupItem>
              <ToggleGroupItem value={presetDays.tomorrow}>
                Tomorrow
              </ToggleGroupItem>
              <ToggleGroupItem value={presetDays.nextWeek}>
                Next week
              </ToggleGroupItem>
            </ToggleGroup>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                id={id}
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className={cn(
                      "border-dashed font-normal",
                      (isCustomDate || open) &&
                        "border-primary text-foreground aria-pressed:bg-muted"
                    )}
                    aria-pressed={isCustomDate}
                  />
                }
              >
                <CalendarIcon data-icon="inline-start" />
                {pickLabel}
              </PopoverTrigger>
              <PopoverContent
                className="flex w-auto flex-col gap-2 p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={value ? dateFromCalendarDay(value) : undefined}
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
          </div>
        </Field>
      </FieldSet>
    )
  }

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
