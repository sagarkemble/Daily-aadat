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
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityCard } from "./template-activity-card"

type TemplateDayWideProps = {
  items: TemplateActivity[]
  isLoading?: boolean
  onAddActivity?: () => void
}

function TemplateDayWide({
  items,
  isLoading = false,
  onAddActivity,
}: TemplateDayWideProps) {
  const { ref, isDropTarget } = useDroppable({
    id: "day_wide",
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <section className="min-w-0">
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
                  <TemplateActivityCard
                    id={item.id}
                    index={index}
                    group="day_wide"
                    activity={item}
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

export { TemplateDayWide }
