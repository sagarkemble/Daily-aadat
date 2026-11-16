import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  AlarmClockIcon,
  BookOpenIcon,
  DumbbellIcon,
  FootprintsIcon,
  GlassWaterIcon,
  LaptopIcon,
  MinusIcon,
  NotebookPenIcon,
  PauseIcon,
  PlusIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { dynamicIconWellVariants } from "@/components/dynamic-icon"
import { activityIconWellClass } from "@/features/activity/lib/activity-style"
import { SLOT_LABELS, type TimedSlot } from "@/features/templates/types/slots"
import earlyMorningArt from "@/features/day-plan/assets/early-morning.svg"
import morningArt from "@/features/day-plan/assets/morning.svg"
import eveningArt from "@/features/day-plan/assets/evening.svg"
import { DONE_CHECKBOX_CLASS } from "@/lib/done-checkbox-class"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

function IconWell({ id, icon: Icon }: { id: string; icon: LucideIcon }) {
  return (
    <span
      className={cn(
        dynamicIconWellVariants({ size: "sm" }),
        activityIconWellClass(id)
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}

const CATALOG = [
  { id: "walk", name: "Morning walk", icon: FootprintsIcon },
  { id: "deep", name: "Deep work", icon: LaptopIcon },
  { id: "water", name: "Water", icon: GlassWaterIcon },
  { id: "read", name: "Read", icon: BookOpenIcon },
  { id: "gym", name: "Gym", icon: DumbbellIcon },
  { id: "journal", name: "Journal", icon: NotebookPenIcon },
]

function CatalogVisual() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATALOG.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-2.5 rounded-xl border bg-background p-2.5 text-sm"
        >
          <IconWell id={activity.id} icon={activity.icon} />
          <span className="min-w-0 flex-1 truncate font-medium">
            {activity.name}
          </span>
        </div>
      ))}
    </div>
  )
}

const TEMPLATE: {
  slot: TimedSlot
  art: string
  time: string
  items: string
}[] = [
  {
    slot: "early_morning",
    art: earlyMorningArt,
    time: "5–7 AM",
    items: "Morning walk, Journal",
  },
  {
    slot: "morning",
    art: morningArt,
    time: "7–12",
    items: "Deep work, Water",
  },
  {
    slot: "evening",
    art: eveningArt,
    time: "5–10 PM",
    items: "Gym, Read",
  },
]

function TemplateVisual() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">Weekday</span>
        <Badge variant="secondary">6 activities</Badge>
      </div>
      <div className="divide-y">
        {TEMPLATE.map((row) => (
          <div key={row.slot} className="flex items-center gap-3 px-4 py-3">
            <img
              src={row.art}
              alt=""
              className="size-9 shrink-0 rounded-full object-cover object-bottom"
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm leading-tight font-medium">
                {SLOT_LABELS[row.slot]}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {row.time}
                </span>
              </span>
              <span className="truncate text-sm text-muted-foreground">
                {row.items}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LiveRow({
  id,
  icon,
  name,
  detail,
  children,
}: {
  id: string
  icon: LucideIcon
  name: string
  detail?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 text-sm">
      <IconWell id={id} icon={icon} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate leading-snug font-medium">{name}</span>
        {detail ? (
          <span className="text-muted-foreground tabular-nums">{detail}</span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">{children}</div>
    </div>
  )
}

function LiveVisual() {
  return (
    <div className="divide-y overflow-hidden rounded-xl border bg-background">
      <LiveRow id="walk" icon={FootprintsIcon} name="Morning walk">
        <Checkbox checked className={cn("mr-1", DONE_CHECKBOX_CLASS)} />
      </LiveRow>
      <LiveRow id="deep" icon={LaptopIcon} name="Deep work" detail="90 min">
        <span className="mr-1 flex items-center gap-1 text-sm tabular-nums">
          <AlarmClockIcon className="size-3.5" />
          12:34
        </span>
        <Button size="icon-sm" className="rounded-full">
          <PauseIcon />
        </Button>
      </LiveRow>
      <LiveRow
        id="water"
        icon={GlassWaterIcon}
        name="Water"
        detail="4 of 8 glasses"
      >
        <Button variant="ghost" size="icon-sm">
          <MinusIcon />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <PlusIcon />
        </Button>
      </LiveRow>
      <LiveRow id="read" icon={BookOpenIcon} name="Read" detail="30 min">
        <Badge variant="outline" className="text-muted-foreground">
          Skipped
        </Badge>
      </LiveRow>
    </div>
  )
}

const STEPS = [
  {
    title: "Collect your activities",
    body: "The things your days are made of. Name one, give it an icon, and decide later whether it's a tick, a timer or a count.",
    visual: <CatalogVisual />,
  },
  {
    title: "Shape a template",
    body: "Place activities into the parts of the day they belong to. Weekday, Weekend, Travel day: as many shapes as your life has.",
    visual: <TemplateVisual />,
  },
  {
    title: "Apply it, then live the day",
    body: "One tap fills the date. Tick, time and count as you go. Skipping is a real answer, not a broken streak.",
    visual: <LiveVisual />,
  },
]

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y bg-card/60 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Write the day down once. Use it every day."
        />
        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-6">
              <Card className="h-80 justify-center bg-muted/50 px-5 py-5 ring-foreground/5">
                <div aria-hidden inert>
                  {step.visual}
                </div>
              </Card>
              <div className="flex gap-4 px-1">
                <span className="text-sm font-medium text-muted-foreground tabular-nums">
                  {`0${index + 1}`}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export { HowItWorksSection }
