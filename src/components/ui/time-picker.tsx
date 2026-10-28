import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const HOURS = Array.from({ length: 24 }, (_, index) => index)
const MINUTES = Array.from({ length: 60 }, (_, index) => index)
const ROW_CLASS = "h-8"

type TimePickerProps = {
  value: string | null
  onChange: (next: string | null) => void
  disabled?: boolean
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function parseTime(value: string | null): { hour: number; minute: number } | null {
  if (!value) return null
  const [hourText, minuteText] = value.split(":")
  const hour = Number(hourText)
  const minute = Number(minuteText)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null
  return { hour, minute }
}

function formatTime(hour: number, minute: number) {
  return `${pad(hour)}:${pad(minute)}`
}

function TimeColumn({
  label,
  values,
  selected,
  onSelect,
  disabled,
}: {
  label: string
  values: number[]
  selected: number | null
  onSelect: (value: number) => void
  disabled?: boolean
}) {
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center" })
  }, [selected])

  return (
    <div className="flex min-w-14 flex-col items-stretch">
      <p className="px-2 pb-1 text-center text-xs text-muted-foreground">
        {label}
      </p>
      <ScrollArea className="h-40">
        <div
          role="listbox"
          aria-label={label}
          className="flex flex-col items-stretch"
        >
          <div className={ROW_CLASS} aria-hidden />
          <div className={ROW_CLASS} aria-hidden />
          {values.map((value) => {
            const isSelected = value === selected
            return (
              <Button
                key={value}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                variant="ghost"
                size="sm"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                className={cn(
                  "h-8 w-full rounded-full font-normal text-muted-foreground",
                  isSelected &&
                    "bg-background text-foreground hover:bg-background hover:text-foreground"
                )}
                onClick={() => onSelect(value)}
              >
                {pad(value)}
              </Button>
            )
          })}
          <div className={ROW_CLASS} aria-hidden />
          <div className={ROW_CLASS} aria-hidden />
        </div>
      </ScrollArea>
    </div>
  )
}

function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const parsed = parseTime(value)
  const hour = parsed?.hour ?? null
  const minute = parsed?.minute ?? null

  function setHour(nextHour: number) {
    onChange(formatTime(nextHour, minute ?? 0))
  }

  function setMinute(nextMinute: number) {
    onChange(formatTime(hour ?? 0, nextMinute))
  }

  function handleNow() {
    const now = new Date()
    onChange(formatTime(now.getHours(), now.getMinutes()))
  }

  return (
    <div className="w-fit rounded-xl bg-popover p-2 text-popover-foreground ring-1 ring-foreground/10">
      <div className="flex gap-1">
        <TimeColumn
          label="Hour"
          values={HOURS}
          selected={hour}
          onSelect={setHour}
          disabled={disabled}
        />
        <TimeColumn
          label="Minute"
          values={MINUTES}
          selected={minute}
          onSelect={setMinute}
          disabled={disabled}
        />
      </div>
      <div className="flex">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1"
          disabled={disabled}
          onClick={handleNow}
        >
          Now
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1"
          disabled={disabled}
          onClick={() => onChange(null)}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

export { TimePicker, formatTime, parseTime }
export type { TimePickerProps }
