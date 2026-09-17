export type Slot =
  "early_morning" | "morning" | "afternoon" | "evening" | "night"

export const SLOTS = [
  "early_morning",
  "morning",
  "afternoon",
  "evening",
  "night",
] as const

export const SLOT_LABELS: Record<Slot, string> = {
  early_morning: "Early morning",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
}
