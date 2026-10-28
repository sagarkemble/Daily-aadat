import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"

import { ItemGroup } from "@/components/ui/item"
import { cn } from "@/lib/utils"
import { isTimedSlot, type Slot } from "../../types/slots"
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityRow } from "./template-activity-row"
import TemplateActivityRowSkeleton from "./template-activity-row-skeleton"
import { TemplateSlotTimeFields } from "./template-slot-time-fields"

type SlotProps = {
  id: Slot
  templateId: string
  title: string
  items: TemplateActivity[]
  startTime?: string | null
  endTime?: string | null
  isLoading?: boolean
}

function clockHeading(
  title: string,
  startTime: string | null,
  endTime: string | null
) {
  if (!startTime || !endTime) return title
  return `${title} · ${startTime.slice(0, 5)}–${endTime.slice(0, 5)}`
}

const TemplateSlot = ({
  id,
  templateId,
  title,
  items,
  startTime = null,
  endTime = null,
  isLoading = false,
}: SlotProps) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">
          {clockHeading(title, startTime, endTime)}
        </h2>
        {isTimedSlot(id) ? (
          <TemplateSlotTimeFields
            templateId={templateId}
            slot={id}
            startTime={startTime}
            endTime={endTime}
            disabled={isLoading}
          />
        ) : null}
      </div>
      <div
        ref={ref}
        className={cn(
          "flex min-h-16 flex-col gap-1 rounded-md p-2",
          isDropTarget && "bg-muted"
        )}
      >
        {isLoading ? (
          <ItemGroup>
            <TemplateActivityRowSkeleton />
            <TemplateActivityRowSkeleton />
          </ItemGroup>
        ) : (
          <ItemGroup>
            {items.map((item, index) => (
              <TemplateActivityRow
                key={item.id}
                id={item.id}
                index={index}
                group={id}
                activity={item}
              />
            ))}
          </ItemGroup>
        )}
      </div>
    </section>
  )
}

export { TemplateSlot }
