import type { TimedSlot } from "../types/slots"

/** Typical hours for each band, used to seed the picker — not enforced. */
const SLOT_DEFAULT_RANGE: Record<TimedSlot, { start: string; end: string }> = {
  early_morning: { start: "05:00", end: "07:00" },
  morning: { start: "07:00", end: "12:00" },
  afternoon: { start: "12:00", end: "17:00" },
  evening: { start: "17:00", end: "21:00" },
  night: { start: "21:00", end: "23:30" },
}

function toClock(value: string | null | undefined): string | null {
  if (!value) return null
  return value.slice(0, 5)
}

function toMinutes(clock: string): number {
  const [hour, minute] = clock.split(":").map(Number)
  return hour * 60 + minute
}

function fromMinutes(total: number): string {
  const clamped = Math.max(0, Math.min(total, 23 * 60 + 59))
  const hour = Math.floor(clamped / 60)
  const minute = clamped % 60
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function meridiem(clock: string) {
  return Number(clock.slice(0, 2)) < 12 ? "AM" : "PM"
}

function formatClock(clock: string, { withMeridiem = true } = {}) {
  const [hour, minute] = clock.split(":").map(Number)
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const base = `${displayHour}:${String(minute).padStart(2, "0")}`
  return withMeridiem ? `${base} ${meridiem(clock)}` : base
}

/** "7:00 – 9:30 AM" when both share AM/PM, otherwise "11:00 AM – 1:00 PM". */
function formatSlotRange(start: string, end: string) {
  const sameHalf = meridiem(start) === meridiem(end)
  return `${formatClock(start, { withMeridiem: !sameHalf })} – ${formatClock(end)}`
}

function formatDuration(start: string, end: string) {
  const minutes = toMinutes(end) - toMinutes(start)
  if (minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

export {
  SLOT_DEFAULT_RANGE,
  formatClock,
  formatDuration,
  formatSlotRange,
  fromMinutes,
  toClock,
  toMinutes,
}
