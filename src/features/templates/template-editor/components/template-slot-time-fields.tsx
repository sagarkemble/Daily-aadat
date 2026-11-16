import { SlotTimeDialog } from "../../components/slot-time-dialog"
import type { TimedSlot } from "../../types/slots"
import { useUpsertTemplateSlotTime } from "../hooks/use-upsert-template-slot-time"

type TemplateSlotTimeFieldsProps = {
  templateId: string
  slot: TimedSlot
  title: string
  startTime: string | null
  endTime: string | null
  disabled?: boolean
}

function TemplateSlotTimeFields({
  templateId,
  slot,
  title,
  startTime,
  endTime,
  disabled = false,
}: TemplateSlotTimeFieldsProps) {
  const { mutateAsync: upsertSlotTime } = useUpsertTemplateSlotTime()

  return (
    <SlotTimeDialog
      slot={slot}
      title={title}
      startTime={startTime}
      endTime={endTime}
      disabled={disabled}
      onSave={({ start, end }) =>
        upsertSlotTime({
          template_id: templateId,
          slot,
          start_time: start,
          end_time: end,
        })
      }
    />
  )
}

export { TemplateSlotTimeFields }
