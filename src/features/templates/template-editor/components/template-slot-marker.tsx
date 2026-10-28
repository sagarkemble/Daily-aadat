import { SLOT_LABELS, type Slot } from "../../types/slots"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import dayWideArt from "@/features/day-plan/assets/day-wide.svg"
import earlyMorningArt from "@/features/day-plan/assets/early-morning.svg"
import morningArt from "@/features/day-plan/assets/morning.svg"
import afternoonArt from "@/features/day-plan/assets/afternoon.svg"
import eveningArt from "@/features/day-plan/assets/evening.svg"
import nightArt from "@/features/day-plan/assets/night.svg"

const SLOT_ART: Record<Slot, string> = {
  day_wide: dayWideArt,
  early_morning: earlyMorningArt,
  morning: morningArt,
  afternoon: afternoonArt,
  evening: eveningArt,
  night: nightArt,
}

type TemplateSlotMarkerProps = {
  slot: Slot
  showConnector?: boolean
}

function TemplateSlotMarker({
  slot,
  showConnector = true,
}: TemplateSlotMarkerProps) {
  return (
    <div className="pointer-events-none relative flex w-20 shrink-0 flex-col items-center self-stretch">
      <img
        src={SLOT_ART[slot]}
        alt=""
        aria-hidden
        draggable={false}
        className="relative z-10 size-20 shrink-0 rounded-full object-cover object-bottom"
      />
      {showConnector ? (
        <div
          className="absolute top-[calc(5rem-2px)] -bottom-8 left-1/2 z-0 w-0 -translate-x-1/2 border-l-2 border-dashed border-border"
          aria-hidden
        />
      ) : null}
      <span className="sr-only">{SLOT_LABELS[slot]}</span>
      <span className="sr-only">{SLOT_COPY[slot].description}</span>
    </div>
  )
}

export { TemplateSlotMarker }
