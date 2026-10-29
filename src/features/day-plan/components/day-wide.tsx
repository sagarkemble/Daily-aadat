import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"
import { PlusIcon } from "lucide-react"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { Empty, EmptyContent, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { DayActivityCard } from "./day-activity-card"

type DayWideProps = {
  items: DayPlanActivity[]
  isLoading?: boolean
  disabled?: boolean
  onAddActivity?: () => void
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}

function DayCarouselControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  if (!canScrollPrev && !canScrollNext) {
    return null
  }

  return (
    <>
      {canScrollPrev ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent"
        />
      ) : null}
      {canScrollNext ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent"
        />
      ) : null}
      {canScrollPrev ? (
        <div className="absolute inset-y-0 left-2 flex items-center">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="transition-none active:translate-y-0"
            onClick={scrollPrev}
          >
            <DynamicIcon name="chevron-left" size="sm" />
            <span className="sr-only">Previous slide</span>
          </Button>
        </div>
      ) : null}
      {canScrollNext ? (
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="transition-none active:translate-y-0"
            onClick={scrollNext}
          >
            <DynamicIcon name="chevron-right" size="sm" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </>
  )
}

function DayWide({
  items,
  isLoading = false,
  disabled,
  onAddActivity,
  onCommand,
}: DayWideProps) {
  const { ref, isDropTarget } = useDroppable({
    id: "day_wide",
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div
        ref={ref}
        className={cn("min-w-0", isDropTarget && "rounded-xl bg-muted")}
      >
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            <Card size="sm" className="size-48 shrink-0">
              <CardHeader className="flex flex-1 flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-auto h-7 w-24" />
              </CardHeader>
            </Card>
            <Card size="sm" className="size-48 shrink-0">
              <CardHeader className="flex flex-1 flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-auto h-7 w-24" />
              </CardHeader>
            </Card>
            <Card size="sm" className="size-48 shrink-0">
              <CardHeader className="flex flex-1 flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-auto h-7 w-24" />
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
            className="relative w-full"
          >
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem key={item.id} className="basis-48 py-px">
                  <DayActivityCard
                    id={item.id}
                    index={index}
                    group="day_wide"
                    activity={item}
                    disabled={disabled}
                    onCommand={onCommand}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <DayCarouselControls />
          </Carousel>
        )}
      </div>
    </section>
  )
}

export { DayWide }
