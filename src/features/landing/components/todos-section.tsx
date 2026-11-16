import { addDays, format } from "date-fns"
import { ArrowRightIcon, LandmarkIcon, UtensilsIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { dynamicIconWellVariants } from "@/components/dynamic-icon"
import { activityIconWellClass } from "@/features/activity/lib/activity-style"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import afternoonArt from "@/features/day-plan/assets/afternoon.svg"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import type { TodoPriority } from "@/features/todos/types/todo"
import { DONE_CHECKBOX_CLASS } from "@/lib/done-checkbox-class"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

function dueIn(days: number) {
  return format(addDays(new Date(), days), "yyyy-MM-dd")
}

const PILE: {
  name: string
  priority: TodoPriority
  due: number | null
  placed?: boolean
}[] = [
  { name: "Call the bank", priority: "high", due: 0, placed: true },
  { name: "Renew passport", priority: "medium", due: 5 },
  { name: "Book the dentist", priority: "low", due: null },
]

function PileCard() {
  return (
    <Card className="gap-0 py-0">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">Todos</span>
        <span className="text-xs text-muted-foreground">3 pending</span>
      </div>
      <div className="divide-y">
        {PILE.map((todo) => (
          <div key={todo.name} className="flex items-start gap-3 px-4 py-3">
            <Checkbox className={cn("mt-0.5", DONE_CHECKBOX_CLASS)} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-sm font-medium">{todo.name}</span>
              <div className="flex flex-wrap items-center gap-2">
                <TodoMeta
                  priority={todo.priority}
                  dueDate={todo.due === null ? null : dueIn(todo.due)}
                  state="pending"
                />
                {todo.placed ? (
                  <Badge variant="secondary" className="h-4.5 px-1.5">
                    In Afternoon
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AfternoonCard() {
  return (
    <Card className="gap-0 py-0">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <img
          src={afternoonArt}
          alt=""
          className="size-9 rounded-full object-cover object-bottom"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm leading-tight font-semibold">Afternoon</span>
          <span className="text-sm text-muted-foreground">
            {SLOT_COPY.afternoon.description}
          </span>
        </div>
      </div>
      <div className="divide-y">
        <div className="flex items-center gap-2.5 px-4 py-3 text-sm">
          <span
            className={cn(
              dynamicIconWellVariants({ size: "sm" }),
              activityIconWellClass("lunch")
            )}
          >
            <UtensilsIcon className="size-4" />
          </span>
          <span className="flex-1 font-medium">Lunch away from the desk</span>
          <Checkbox checked className={DONE_CHECKBOX_CLASS} />
        </div>
        <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-3 text-sm">
          <span className={dynamicIconWellVariants({ size: "sm" })}>
            <LandmarkIcon className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-medium">Call the bank</span>
            <TodoMeta priority="high" dueDate={dueIn(0)} state="pending" />
          </div>
          <Checkbox className={DONE_CHECKBOX_CLASS} />
        </div>
      </div>
    </Card>
  )
}

function TodosSection() {
  return (
    <section
      id="todos"
      className="scroll-mt-20 border-y bg-card/60 py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:px-8">
        <SectionHeading
          eyebrow="Todos"
          title="One-off things wait in a pile, not on a schedule."
          description="Capture a todo with a priority and a due date. When the day has room, place it into a slot. It sits beside your activities, and ticking it off in one place ticks it off everywhere."
        />
        <div
          aria-hidden
          inert
          className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
        >
          <PileCard />
          <span className="mx-auto flex size-9 rotate-90 items-center justify-center rounded-full border bg-background text-muted-foreground md:rotate-0">
            <ArrowRightIcon className="size-4" />
          </span>
          <AfternoonCard />
        </div>
      </div>
    </section>
  )
}

export { TodosSection }
