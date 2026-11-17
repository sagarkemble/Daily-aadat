import { SLOTS, TIMED_SLOTS, type Slot } from "../types/slots"
import type { TemplateSummary } from "../types/template"

export const SLOT_STRIP_LABEL: Record<Slot, string> = {
  day_wide: "All",
  early_morning: "Early",
  morning: "Morning",
  afternoon: "Noon",
  evening: "Evening",
  night: "Night",
}

const STRIP_SLOTS: Slot[] = [...TIMED_SLOTS, "day_wide"]

const EMPTY_SLOT_COUNTS = Object.fromEntries(
  SLOTS.map((slot) => [slot, 0])
) as Record<Slot, number>

export function emptySlotCounts(): Record<Slot, number> {
  return { ...EMPTY_SLOT_COUNTS }
}

export function stripSlotCounts(template: TemplateSummary) {
  return STRIP_SLOTS.map((slot) => ({
    slot,
    count: template.slot_counts[slot],
  }))
}

export function activityCount(template: TemplateSummary) {
  return SLOTS.reduce((sum, slot) => sum + template.slot_counts[slot], 0)
}
