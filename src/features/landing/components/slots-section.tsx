import { CalendarDaysIcon } from "lucide-react"

import { SlotArt } from "@/features/day-plan/components/slot-art"
import { TIMED_SLOTS, type TimedSlot } from "@/features/templates/types/slots"
import { SectionHeading } from "./section-heading"

const SAMPLE_TIMES: Record<TimedSlot, string> = {
  early_morning: "5:00 – 7:00",
  morning: "7:00 – 12:00",
  afternoon: "12:00 – 17:00",
  evening: "17:00 – 22:00",
  night: "22:00 – 5:00",
}

function SlotsSection() {
  return (
    <section
      id="slots"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-24 md:px-6 md:py-32 lg:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <SectionHeading
          eyebrow="Soft slots"
          title="Five parts of the day, not a clock."
          description="Activities live in early morning, morning, afternoon, evening or night. Give a slot times if you like. They're labels, not alarms: nothing locks and nothing turns red when the clock moves on."
        />
        <div className="flex max-w-sm items-start gap-3 rounded-xl border bg-card p-4 text-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <CalendarDaysIcon className="size-4" />
          </span>
          <p className="leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Day-wide</span> holds
            what belongs to the date but not to a time: a birthday, a deadline,
            “pack for the trip”.
          </p>
        </div>
      </div>

      <div className="-mx-4 mt-12 [scrollbar-width:none] overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        <ul className="flex snap-x snap-mandatory gap-3 lg:grid lg:grid-cols-5">
          {TIMED_SLOTS.map((slot) => (
            <li
              key={slot}
              className="w-60 shrink-0 snap-start overflow-hidden rounded-2xl *:min-h-80 *:w-full lg:w-auto"
            >
              <SlotArt slot={slot}>
                <span className="inline-flex h-6 items-center rounded-full bg-black/70 px-2.5 text-xs font-medium text-white tabular-nums">
                  {SAMPLE_TIMES[slot]}
                </span>
              </SlotArt>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { SlotsSection }
