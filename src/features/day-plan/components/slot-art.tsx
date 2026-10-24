import type { ReactNode } from "react"

import { SLOT_LABELS, type Slot } from "@/features/templates/types/slots"
import { SLOT_COPY } from "../lib/slot-copy"
import dayWideArt from "../assets/day-wide.svg"
import earlyMorningArt from "../assets/early-morning.svg"
import morningArt from "../assets/morning.svg"
import afternoonArt from "../assets/afternoon.svg"
import eveningArt from "../assets/evening.svg"
import nightArt from "../assets/night.svg"

type SlotArtProps = {
  slot: Slot
  children?: ReactNode
}

const SLOT_ART: Record<Slot, string> = {
  day_wide: dayWideArt,
  early_morning: earlyMorningArt,
  morning: morningArt,
  afternoon: afternoonArt,
  evening: eveningArt,
  night: nightArt,
}

function SlotArt({ slot, children }: SlotArtProps) {
  const copy = SLOT_COPY[slot]
  const Icon = copy.icon

  return (
    <div
      className="relative flex min-h-40 w-52 shrink-0 flex-col overflow-hidden"
      style={{ backgroundColor: copy.sky }}
    >
      <img
        src={SLOT_ART[slot]}
        alt=""
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full max-h-52 object-cover object-bottom"
      />
      <div className="relative flex flex-1 flex-col p-4 text-primary-foreground">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-heading text-xl font-semibold leading-tight">
              {SLOT_LABELS[slot]}
            </p>
            <p className="text-sm text-primary-foreground/80">
              {copy.description}
            </p>
          </div>
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black"
            style={{ color: copy.sky }}
          >
            <Icon className="size-5" />
          </span>
        </div>
        {children ? <div className="mt-auto pt-3">{children}</div> : null}
      </div>
    </div>
  )
}

export { SlotArt }
