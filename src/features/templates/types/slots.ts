export type Slot =
  | "day_wide"
  | "early_morning"
  | "morning"
  | "afternoon"
  | "evening"
  | "night"

export const SLOTS = [
  "day_wide",
  "early_morning",
  "morning",
  "afternoon",
  "evening",
  "night",
] as const

export const SLOT_LABELS: Record<Slot, string> = {
  day_wide: "Day-wide",
  early_morning: "Early morning",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
}

export const TIMED_SLOTS = [
  "early_morning",
  "morning",
  "afternoon",
  "evening",
  "night",
] as const

export type TimedSlot = (typeof TIMED_SLOTS)[number]

export function isTimedSlot(slot: Slot): slot is TimedSlot {
  return slot !== "day_wide"
}

export function emptySlotBuckets<T>(): Record<Slot, T[]> {
  return Object.fromEntries(SLOTS.map((slot) => [slot, [] as T[]])) as unknown as Record<
    Slot,
    T[]
  >
}
