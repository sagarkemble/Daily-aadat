import type { Slot } from "@/features/templates/types/slots"
import { SLOT_LABELS, SLOTS } from "@/features/templates/types/slots"

export const SLOT_SURFACE: Record<Slot, string> = {
  early_morning: "bg-slot-early-morning text-ink",
  morning: "bg-slot-morning text-ink",
  afternoon: "bg-slot-afternoon text-ink",
  evening: "bg-slot-evening text-ink",
  night: "bg-slot-night text-ink",
}

export const SLOT_CARD_COPY: Record<Slot, string> = {
  early_morning: "Quiet start. Water, stretch, no clock.",
  morning: "The loud part of the day.",
  afternoon: "Work block. Keep it one thing.",
  evening: "Wind down. People, food, walk.",
  night: "Lights out rituals.",
}

export const SLOT_SWATCHES = SLOTS.map((slot) => ({
  slot,
  label: SLOT_LABELS[slot],
  surface: SLOT_SURFACE[slot],
  copy: SLOT_CARD_COPY[slot],
}))
