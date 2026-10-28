import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { TimePicker } from "@/components/ui/time-picker"
import { toast } from "@/components/ui/toast"
import type { TimedSlot } from "@/features/templates/types/slots"
import { useUpsertDaySlotTime } from "../hooks/use-upsert-day-slot-time"

type DaySlotTimeFieldsProps = {
  dayPlanId: string
  slot: TimedSlot
  title: string
  startTime: string | null
  endTime: string | null
  disabled?: boolean
}

function toClock(value: string | null): string | null {
  if (!value) return null
  return value.slice(0, 5)
}

function DaySlotTimeFields({
  dayPlanId,
  slot,
  title,
  startTime,
  endTime,
  disabled = false,
}: DaySlotTimeFieldsProps) {
  const savedStart = toClock(startTime)
  const savedEnd = toClock(endTime)
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState<string | null>(savedStart)
  const [end, setEnd] = useState<string | null>(savedEnd)
  const { mutateAsync: upsertSlotTime, isPending } = useUpsertDaySlotTime()

  useEffect(() => {
    if (open) {
      setStart(savedStart)
      setEnd(savedEnd)
    }
  }, [open, savedStart, savedEnd])

  const bothEmpty = start === null && end === null
  const bothSet = start !== null && end !== null
  const incomplete = !bothEmpty && !bothSet
  const label =
    savedStart && savedEnd ? `${savedStart} – ${savedEnd}` : "Set time"

  function handleSave() {
    if (incomplete) {
      toast.add({
        title: "Set start and end, or clear both",
        type: "error",
      })
      return
    }
    toast.promise(
      upsertSlotTime({
        day_plan_id: dayPlanId,
        slot,
        start_time: bothEmpty ? null : start,
        end_time: bothEmpty ? null : end,
      }).then(() => setOpen(false)),
      {
        loading: { title: "Saving slot time…" },
        success: { title: "Slot time saved" },
        error: { title: "Failed to save slot time" },
      }
    )
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto w-fit self-start px-0 text-muted-foreground"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title} time</DialogTitle>
            <DialogDescription>
              Set start and end, or clear both.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Field data-disabled={isPending || undefined}>
                <FieldLabel>Start</FieldLabel>
                <TimePicker
                  value={start}
                  onChange={setStart}
                  disabled={isPending}
                />
              </Field>
              <Field data-disabled={isPending || undefined}>
                <FieldLabel>End</FieldLabel>
                <TimePicker value={end} onChange={setEnd} disabled={isPending} />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" disabled={isPending} />}
            >
              Cancel
            </DialogClose>
            <Button disabled={isPending || incomplete} onClick={handleSave}>
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { DaySlotTimeFields }
