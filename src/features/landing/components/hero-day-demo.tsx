import type { LucideIcon } from "lucide-react"
import {
  AlarmClockIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DumbbellIcon,
  FootprintsIcon,
  GlassWaterIcon,
  LandmarkIcon,
  LaptopIcon,
  LayoutTemplateIcon,
  MinusIcon,
  NotebookPenIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  UtensilsIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { dynamicIconWellVariants } from "@/components/dynamic-icon"
import { activityIconWellClass } from "@/features/activity/lib/activity-style"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import { SLOT_LABELS, type TimedSlot } from "@/features/templates/types/slots"
import earlyMorningArt from "@/features/day-plan/assets/early-morning.svg"
import morningArt from "@/features/day-plan/assets/morning.svg"
import afternoonArt from "@/features/day-plan/assets/afternoon.svg"
import eveningArt from "@/features/day-plan/assets/evening.svg"
import { DONE_CHECKBOX_CLASS } from "@/lib/done-checkbox-class"
import {
  Collapse,
  Count,
  Popover,
  Stage,
  States,
  Swap,
  Window,
  type Act,
  type Layout,
} from "@/lib/stageshow"
import { cn } from "@/lib/utils"
import { useIsDark } from "../hooks/use-is-dark"
import "./hero-day-demo.css"

type S = {
  day: number
  menu: boolean
  planned: boolean
  shown: number
  walk: boolean
  running: boolean
  elapsed: number
  water: number
}

type Row = {
  id: string
  name: string
  icon: LucideIcon
  kind: "check" | "timed" | "count" | "todo"
  detail?: string
}

const PLAN: { slot: TimedSlot; art: string; rows: Row[] }[] = [
  {
    slot: "early_morning",
    art: earlyMorningArt,
    rows: [
      { id: "walk", name: "Morning walk", icon: FootprintsIcon, kind: "check" },
      {
        id: "journal",
        name: "Journal",
        icon: NotebookPenIcon,
        kind: "check",
      },
    ],
  },
  {
    slot: "morning",
    art: morningArt,
    rows: [
      {
        id: "deep",
        name: "Deep work",
        icon: LaptopIcon,
        kind: "timed",
        detail: "90 min",
      },
      {
        id: "water",
        name: "Water",
        icon: GlassWaterIcon,
        kind: "count",
        detail: "of 8 glasses",
      },
    ],
  },
  {
    slot: "afternoon",
    art: afternoonArt,
    rows: [
      {
        id: "bank",
        name: "Call the bank",
        icon: LandmarkIcon,
        kind: "todo",
        detail: "Todo · due today",
      },
      { id: "lunch", name: "Lunch away", icon: UtensilsIcon, kind: "check" },
    ],
  },
  {
    slot: "evening",
    art: eveningArt,
    rows: [
      { id: "gym", name: "Gym", icon: DumbbellIcon, kind: "check" },
      {
        id: "read",
        name: "Read",
        icon: BookOpenIcon,
        kind: "timed",
        detail: "30 min",
      },
    ],
  },
]

const ACTIVITY_COUNT = PLAN.reduce((sum, slot) => sum + slot.rows.length, 0)

const TEMPLATES = [
  { name: "Weekday", count: ACTIVITY_COUNT },
  { name: "Weekend", count: 5 },
  { name: "Travel day", count: 4 },
]

const DAYS = [
  ["Monday", "Nov 16"],
  ["Tuesday", "Nov 17"],
  ["Wednesday", "Nov 18"],
  ["Thursday", "Nov 19"],
  ["Friday", "Nov 20"],
  ["Saturday", "Nov 21"],
  ["Sunday", "Nov 22"],
] as const

/** Days already moved past, so each loop opens on the day the last one ended on. */
let loops = 0

const initial: S = {
  day: 0,
  menu: false,
  planned: false,
  shown: 0,
  walk: false,
  running: false,
  elapsed: 0,
  water: 2,
}

const POSTER: S = {
  ...initial,
  planned: true,
  shown: PLAN.length,
  walk: true,
  running: true,
  elapsed: 754,
  water: 4,
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

/** Waits that keep a running timer ticking once a second. */
function timer(a: Act<S>) {
  let carry = 0
  return {
    start() {
      carry = 0
    },
    async hold(ms: number) {
      let left = ms
      while (left > 0) {
        const step = Math.min(1000 - carry, left)
        await a.wait(step)
        left -= step
        carry += step
        if (carry >= 1000) {
          carry = 0
          a.put((s) => (s.running ? { elapsed: s.elapsed + 1 } : {}))
        }
      }
    },
  }
}

async function script(a: Act<S>) {
  const clock = timer(a)
  await a.wait(900)

  await a.move("apply")
  await a.wait(200)
  await a.click()
  await a.set({ menu: true })
  await a.wait(500)
  await a.move("tpl-0")
  await a.wait(400)
  await a.click()
  await a.set({ menu: false })
  await a.wait(120)
  await a.set({ planned: true })
  for (let i = 1; i <= PLAN.length; i++) {
    await a.set({ shown: i })
    await a.wait(130)
  }
  await a.wait(700)

  await a.move("walk")
  await a.wait(200)
  await a.click()
  await a.set({ walk: true })
  await a.wait(500)

  await a.move("deep-play")
  await a.wait(200)
  await a.click()
  clock.start()
  await a.set({ running: true })
  await clock.hold(1200)

  await a.move("water-plus")
  await clock.hold(250)
  await a.click()
  await a.set((s) => ({ water: s.water + 1 }))
  await clock.hold(450)
  await a.click()
  await a.set((s) => ({ water: s.water + 1 }))
  await clock.hold(2600)

  await a.move("next")
  await clock.hold(300)
  await a.click()
  await a.set({ ...initial, day: 1 })
  await a.move("rest")
  await a.wait(1400)
  loops += 1
  await a.snap({ day: 0 })
}

const REST = { wide: { x: 930, y: 500 }, compact: { x: 300, y: 500 } }

export function HeroDayDemo() {
  const dark = useIsDark()

  return (
    <Stage
      width={1040}
      height={600}
      compact={{ below: 640, width: 358, height: 560 }}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      theme={dark ? "dark" : "light"}
      tokens={{ "--ss-font": "var(--font-sans)" }}
      className="hero-day-demo"
    >
      {(s, rect, layout) => {
        const [weekday, date] = DAYS[(s.day + loops) % DAYS.length]
        const apply = rect("apply")
        const done = (s.walk ? 1 : 0) + (s.water >= 8 ? 1 : 0)

        return (
          <>
            <div className="hdd-shot">
              <Window url="dailyaadat.app" urlShape="pill" className="hdd-window">
              <div className="flex h-full flex-col bg-background text-foreground">
                <header
                  className={cn(
                    "flex items-center gap-3 border-b",
                    layout === "wide" ? "px-7 py-4" : "px-4 py-3"
                  )}
                >
                  <div className="flex items-center">
                    <span
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon-sm",
                      })}
                    >
                      <ChevronLeftIcon />
                    </span>
                    <span
                      data-target="next"
                      data-cursor="pointer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-sm" }),
                        "data-hover:bg-muted"
                      )}
                    >
                      <ChevronRightIcon />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div
                      className={cn(
                        "leading-tight font-semibold tracking-tight",
                        layout === "wide" ? "text-lg" : "text-base"
                      )}
                    >
                      <Swap id={weekday}>{weekday}</Swap>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Swap id={date}>{date}</Swap>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    {layout === "wide" ? (
                      <span className="text-sm text-muted-foreground tabular-nums">
                        <Count value={done} /> of {ACTIVITY_COUNT} done
                      </span>
                    ) : null}
                    <span
                      data-target="apply"
                      data-cursor="pointer"
                      data-open={s.menu || undefined}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "data-hover:bg-muted data-open:bg-muted"
                      )}
                    >
                      <LayoutTemplateIcon />
                      <States
                        value={s.planned ? "applied" : "apply"}
                        align="start"
                        states={{
                          apply: "Apply template",
                          applied: "Weekday",
                        }}
                      />
                      <ChevronDownIcon className="text-muted-foreground" />
                    </span>
                  </div>
                </header>

                <div
                  className={cn(
                    "flex flex-col",
                    layout === "wide" ? "px-7 pt-6" : "px-4 pt-4"
                  )}
                >
                  <Collapse open={!s.planned}>
                    <EmptyDay layout={layout} />
                  </Collapse>
                  {PLAN.map((slot, index) => (
                    <Collapse
                      key={slot.slot}
                      open={s.planned && index < s.shown}
                    >
                      <SlotSection slot={slot} state={s} layout={layout} />
                    </Collapse>
                  ))}
                </div>
              </div>
            </Window>
            </div>

            <Popover
              show={s.menu}
              origin="top right"
              className="hdd-menu"
              style={{
                left: apply.x + apply.width - 232,
                top: apply.y + apply.height + 6,
              }}
            >
              <div className="px-2 pt-1.5 pb-1 text-xs text-muted-foreground">
                Templates
              </div>
              {TEMPLATES.map((template, index) => (
                <div
                  key={template.name}
                  data-target={`tpl-${index}`}
                  data-cursor="pointer"
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm data-hover:bg-accent"
                >
                  <LayoutTemplateIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{template.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {template.count} activities
                  </span>
                </div>
              ))}
            </Popover>

            <span
              data-target="rest"
              style={{
                position: "absolute",
                left: REST[layout].x,
                top: REST[layout].y,
              }}
            />
          </>
        )
      }}
    </Stage>
  )
}

function EmptyDay({ layout }: { layout: Layout }) {
  return (
    <div className="pb-6">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center",
          layout === "wide" ? "h-72" : "h-64 px-6"
        )}
      >
        <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
          <CalendarDaysIcon className="size-5" />
        </span>
        <div className="text-sm font-medium tracking-tight">
          Nothing on this day
        </div>
        <div className="max-w-64 text-sm text-muted-foreground">
          Start by adding an activity or todo, or choose a template above.
        </div>
      </div>
    </div>
  )
}

function SlotSection({
  slot,
  state,
  layout,
}: {
  slot: (typeof PLAN)[number]
  state: S
  layout: Layout
}) {
  const heading = (
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="text-sm leading-tight font-semibold">
        {SLOT_LABELS[slot.slot]}
      </div>
      <div className="text-sm leading-snug text-muted-foreground">
        {SLOT_COPY[slot.slot].description}
      </div>
    </div>
  )

  const list = (
    <div className="min-w-0 flex-1 divide-y overflow-hidden rounded-xl border">
      {slot.rows.map((row) => (
        <ActivityRow key={row.id} row={row} state={state} />
      ))}
    </div>
  )

  if (layout === "compact") {
    return (
      <section className="flex flex-col gap-2.5 pb-5">
        <div className="flex items-center gap-3">
          <img
            src={slot.art}
            alt=""
            className="size-9 shrink-0 rounded-full object-cover object-bottom"
          />
          {heading}
        </div>
        {list}
      </section>
    )
  }

  return (
    <section className="flex items-start gap-4 pb-4">
      <img
        src={slot.art}
        alt=""
        className="size-14 shrink-0 rounded-full object-cover object-bottom"
      />
      <div className="w-40 shrink-0 pt-2">{heading}</div>
      {list}
    </section>
  )
}

function ActivityRow({ row, state }: { row: Row; state: S }) {
  const Icon = row.icon
  const checked = row.id === "walk" && state.walk

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 text-sm">
      <span
        className={cn(
          dynamicIconWellVariants({ size: "sm" }),
          activityIconWellClass(row.id)
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="truncate leading-snug font-medium">{row.name}</div>
        {row.kind === "count" ? (
          <div className="leading-normal text-muted-foreground tabular-nums">
            <Count value={state.water} /> {row.detail}
          </div>
        ) : row.detail ? (
          <div className="truncate leading-normal text-muted-foreground">
            {row.detail}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center">
        {row.kind === "check" || row.kind === "todo" ? (
          <span
            data-target={row.id}
            data-cursor="pointer"
            data-checked={checked || undefined}
            className={cn(
              "mr-1 flex size-4 items-center justify-center rounded-[4px] border border-input transition-colors dark:bg-input/30",
              DONE_CHECKBOX_CLASS
            )}
          >
            <CheckIcon
              className={cn(
                "size-3.5 transition-opacity",
                checked ? "opacity-100" : "opacity-0"
              )}
            />
          </span>
        ) : null}
        {row.kind === "timed" ? (
          <TimedControls row={row} state={state} />
        ) : null}
        {row.kind === "count" ? (
          <div className="flex items-center">
            <span
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <MinusIcon />
            </span>
            <span
              data-target="water-plus"
              data-cursor="pointer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "data-hover:bg-muted"
              )}
            >
              <PlusIcon />
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TimedControls({ row, state }: { row: Row; state: S }) {
  const live = row.id === "deep"
  const running = live && state.running

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex items-center gap-1 text-sm tabular-nums",
          running ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <AlarmClockIcon className="size-3.5" />
        <Count value={live ? state.elapsed : 0} format={formatElapsed} />
      </span>
      <span
        data-target={live ? "deep-play" : undefined}
        data-cursor="pointer"
        className={cn(
          buttonVariants({
            variant: running ? "default" : "outline",
            size: "icon-sm",
          }),
          "rounded-full",
          running ? "data-hover:bg-primary/80" : "data-hover:bg-muted"
        )}
      >
        <States
          value={running ? "pause" : "play"}
          states={{ play: <PlayIcon />, pause: <PauseIcon /> }}
        />
      </span>
      <span className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
        <RotateCcwIcon />
      </span>
    </div>
  )
}
