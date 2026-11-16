import { SlotTimeDialog } from "@/features/templates/components/slot-time-dialog"
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

function DaySlotTimeFields({
  dayPlanId,
  slot,
  title,
  startTime,
  endTime,
  disabled = false,
}: DaySlotTimeFieldsProps) {
  const { mutateAsync: upsertSlotTime } = useUpsertDaySlotTime()

  return (
    <SlotTimeDialog
      slot={slot}
      title={title}
      startTime={startTime}
      endTime={endTime}
      disabled={disabled}
      onSave={({ start, end }) =>
        upsertSlotTime({
          day_plan_id: dayPlanId,
          slot,
          start_time: start,
          end_time: end,
        })
      }
    />
  )
}

export { DaySlotTimeFields }
