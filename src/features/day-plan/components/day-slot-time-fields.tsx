import { useEffect, useState } from "react"
import { ClockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import type { TimedSlot } from "@/features/templates/types/slots"
import { useUpsertDaySlotTime } from "../hooks/use-upsert-day-slot-time"

type DaySlotTimeFieldsProps = {
  dayPlanId: string
  slot: TimedSlot
  startTime: string | null
  endTime: string | null
  disabled?: boolean
}

function toClockInput(value: string | null): string {
  if (!value) return ""
  return value.slice(0, 5)
}

function DaySlotTimeFields({
  dayPlanId,
  slot,
  startTime,
  endTime,
  disabled = false,
}: DaySlotTimeFieldsProps) {
  const savedStart = toClockInput(startTime)
  const savedEnd = toClockInput(endTime)
  const [start, setStart] = useState(savedStart)
  const [end, setEnd] = useState(savedEnd)
  const { mutateAsync: upsertSlotTime, isPending } = useUpsertDaySlotTime()

  useEffect(() => {
    setStart(savedStart)
    setEnd(savedEnd)
  }, [savedStart, savedEnd])

  const bothEmpty = start === "" && end === ""
  const bothSet = start !== "" && end !== ""
  const incomplete = !bothEmpty && !bothSet
  const dirty = start !== savedStart || end !== savedEnd

  function handleSave() {
    if (incomplete || !dirty) return
    toast.promise(
      upsertSlotTime({
        day_plan_id: dayPlanId,
        slot,
        start_time: bothEmpty ? null : start,
        end_time: bothEmpty ? null : end,
      }),
      {
        loading: { title: "Saving slot time…" },
        success: { title: "Slot time saved" },
        error: { title: "Failed to save slot time" },
      }
    )
  }

  return (
    <FieldGroup>
      <div className="flex flex-wrap items-end gap-2">
        <Field
          orientation="horizontal"
          className="w-auto"
          data-invalid={incomplete || undefined}
          data-disabled={disabled || undefined}
        >
          <FieldLabel htmlFor={`day-${slot}-start`}>
            <ClockIcon />
            Start
          </FieldLabel>
          <Input
            id={`day-${slot}-start`}
            type="time"
            value={start}
            disabled={disabled || isPending}
            aria-invalid={incomplete || undefined}
            onChange={(event) => setStart(event.target.value)}
          />
        </Field>
        <Field
          orientation="horizontal"
          className="w-auto"
          data-invalid={incomplete || undefined}
          data-disabled={disabled || undefined}
        >
          <FieldLabel htmlFor={`day-${slot}-end`}>End</FieldLabel>
          <Input
            id={`day-${slot}-end`}
            type="time"
            value={end}
            disabled={disabled || isPending}
            aria-invalid={incomplete || undefined}
            onChange={(event) => setEnd(event.target.value)}
          />
        </Field>
        {dirty ? (
          <Button
            size="sm"
            disabled={incomplete || isPending || disabled}
            onClick={handleSave}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Save
          </Button>
        ) : null}
      </div>
    </FieldGroup>
  )
}

export { DaySlotTimeFields }
