import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Empty, EmptyContent, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { DayActivityCard } from "./day-activity-card"
import { SlotAddControl } from "./slot-add-control"

type DayWideProps = {
  items: DayPlanActivity[]
  isLoading?: boolean
  editing?: boolean
  dayPlanId: string
  disabled?: boolean
  onAddActivity?: () => void
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
  onUnassign: (activityId: string) => void
}

function nextSortOrder(activities: DayPlanActivity[]) {
  if (activities.length === 0) return 0
  return Math.max(...activities.map((activity) => activity.slot_order)) + 1
}

function DayWide({
  items,
  isLoading = false,
  editing = false,
  dayPlanId,
  disabled,
  onAddActivity,
  onCommand,
  onUnassign,
}: DayWideProps) {
  const { ref, isDropTarget } = useDroppable({
    id: "day_wide",
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <section className="flex min-w-0 flex-col gap-3">
      {editing && dayPlanId !== "" ? (
        <div className="flex justify-end">
          <SlotAddControl
            slot="day_wide"
            dayPlanId={dayPlanId}
            nextSlotOrder={nextSortOrder(items)}
            disabled={disabled}
          />
        </div>
      ) : null}
      <div
        ref={ref}
        className={cn("min-w-0", isDropTarget && "rounded-xl bg-muted")}
      >
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            <Card size="sm" className="min-h-44 min-w-0 flex-1">
              <CardHeader className="flex flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
            </Card>
            <Card size="sm" className="min-h-44 min-w-0 flex-1">
              <CardHeader className="flex flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
            </Card>
            <Card size="sm" className="min-h-44 min-w-0 flex-1">
              <CardHeader className="flex flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
            </Card>
          </div>
        ) : items.length === 0 ? (
          <Empty className="min-h-24 border">
            <EmptyContent>
              <EmptyTitle>No day-wide activities</EmptyTitle>
              {onAddActivity ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={onAddActivity}
                >
                  <PlusIcon data-icon="inline-start" />
                  Add an activity
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        ) : (
          <Carousel
            opts={{ align: "start", watchDrag: false }}
            className="w-full px-12"
          >
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="basis-[85%] py-px sm:basis-1/2 lg:basis-1/3"
                >
                  <DayActivityCard
                    id={item.id}
                    index={index}
                    group="day_wide"
                    activity={item}
                    disabled={disabled}
                    editing={editing}
                    onCommand={onCommand}
                    onUnassign={onUnassign}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious size="icon" />
            <CarouselNext size="icon" />
          </Carousel>
        )}
      </div>
    </section>
  )
}

export { DayWide }
