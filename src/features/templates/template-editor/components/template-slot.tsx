import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { cn } from "@/lib/utils"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import { isTimedSlot, type Slot } from "../../types/slots"
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityRow } from "./template-activity-row"
import TemplateActivityRowSkeleton from "./template-activity-row-skeleton"
import { TemplateSlotMarker } from "./template-slot-marker"
import { TemplateSlotTimeFields } from "./template-slot-time-fields"

type SlotProps = {
  id: Slot
  templateId: string
  title: string
  items: TemplateActivity[]
  startTime?: string | null
  endTime?: string | null
  isLoading?: boolean
  showConnector?: boolean
  onAddActivity?: () => void
}

const TemplateSlot = ({
  id,
  templateId,
  title,
  items,
  startTime = null,
  endTime = null,
  isLoading = false,
  showConnector = true,
  onAddActivity,
}: SlotProps) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })
  return (
    <section className="flex items-start gap-4">
      <TemplateSlotMarker slot={id} showConnector={showConnector} />
      <div className="flex min-h-20 w-36 shrink-0 flex-col justify-center gap-0.5">
        <h2 className="text-sm font-semibold leading-tight">{title}</h2>
        <p className="text-sm leading-snug text-muted-foreground">
          {SLOT_COPY[id].description}
        </p>
        {isTimedSlot(id) ? (
          <TemplateSlotTimeFields
            templateId={templateId}
            slot={id}
            title={title}
            startTime={startTime}
            endTime={endTime}
            disabled={isLoading}
          />
        ) : null}
      </div>
      <div
        ref={ref}
        className={cn(
          "h-fit min-w-0 flex-1 overflow-hidden rounded-xl border",
          items.length === 0 && !isLoading && "border-dashed",
          isDropTarget && "bg-muted"
        )}
      >
        {isLoading ? (
          <ItemGroup className="gap-0 divide-y has-data-[size=sm]:gap-0">
            <TemplateActivityRowSkeleton />
            <TemplateActivityRowSkeleton />
          </ItemGroup>
        ) : items.length === 0 ? (
          <Empty className="min-h-20 gap-0 border-0 p-0">
            <Button
              type="button"
              variant="ghost"
              className="h-20 w-full rounded-none text-muted-foreground"
              onClick={onAddActivity}
            >
              <PlusIcon data-icon="inline-start" />
              Add an activity
            </Button>
          </Empty>
        ) : (
          <ItemGroup className="gap-0 divide-y has-data-[size=sm]:gap-0">
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
