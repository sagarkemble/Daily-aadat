import { Badge } from "@/components/ui/badge"
import { SLOT_LABELS, type Slot } from "@/features/templates/types/slots"
import { SLOT_COPY } from "../lib/slot-copy"
import earlyMorningArt from "../assets/early-morning.svg"
import morningArt from "../assets/morning.svg"
import afternoonArt from "../assets/afternoon.svg"
import eveningArt from "../assets/evening.svg"
import nightArt from "../assets/night.svg"

type SlotArtProps = {
  slot: Slot
  count: number
}

const SLOT_ART: Record<Slot, string> = {
  early_morning: earlyMorningArt,
  morning: morningArt,
  afternoon: afternoonArt,
  evening: eveningArt,
  night: nightArt,
}

function SlotArt({ slot, count }: SlotArtProps) {
  const copy = SLOT_COPY[slot]
  const Icon = copy.icon

  return (
    <div
      className="relative flex min-h-40 w-44 shrink-0 flex-col overflow-hidden"
      style={{ backgroundColor: copy.sky }}
    >
      <img
        src={SLOT_ART[slot]}
        alt=""
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full max-h-44 object-cover object-bottom"
      />
      <div className="relative flex flex-1 flex-col gap-2 p-4 text-primary-foreground">
        <div className="flex items-start justify-between gap-2">
          <Icon className="size-4 drop-shadow-sm" />
          <Badge variant="secondary">{count}</Badge>
        </div>
        <div className="mt-auto flex flex-col gap-1">
          <p className="font-heading text-lg font-semibold leading-tight drop-shadow-sm">
            {SLOT_LABELS[slot]}
          </p>
          <p className="text-xs/relaxed text-primary-foreground/90 drop-shadow-sm">
            {copy.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export { SlotArt }
