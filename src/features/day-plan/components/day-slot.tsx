import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { cn } from "@/lib/utils"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import { isTimedSlot, SLOT_LABELS, type Slot } from "@/features/templates/types/slots"
import { TemplateSlotMarker } from "@/features/templates/template-editor/components/template-slot-marker"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { DayActivityRow } from "./day-activity-row"
import DayActivityRowSkeleton from "./day-activity-row-skeleton"
import { DaySlotTimeFields } from "./day-slot-time-fields"
import { SlotAddControl } from "./slot-add-control"

type DaySlotProps = {
  slot: Slot
  activities: DayPlanActivity[]
  dayPlanId: string
  startTime?: string | null
  endTime?: string | null
  isLoading: boolean
  editing: boolean
  showConnector?: boolean
  disabled?: boolean
  onAddActivity?: () => void
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
  onUnassign: (activityId: string) => void
}

function nextSortOrder(activities: DayPlanActivity[]) {
  if (activities.length === 0) return 0
  return Math.max(...activities.map((activity) => activity.slot_order)) + 1
}

const DaySlot = ({
  slot,
  activities,
  dayPlanId,
  startTime = null,
  endTime = null,
  isLoading,
  editing,
  showConnector = true,
  disabled,
  onAddActivity,
  onCommand,
  onUnassign,
}: DaySlotProps) => {
  const { ref, isDropTarget } = useDroppable({
    id: slot,
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })
  const title = SLOT_LABELS[slot]

  return (
    <section className="flex items-start gap-4">
      <TemplateSlotMarker slot={slot} showConnector={showConnector} />
      <div className="flex min-h-20 w-36 shrink-0 flex-col justify-center gap-0.5">
        <h2 className="text-sm font-semibold leading-tight">{title}</h2>
        <p className="text-sm leading-snug text-muted-foreground">
          {SLOT_COPY[slot].description}
        </p>
        {isTimedSlot(slot) && dayPlanId !== "" ? (
          <DaySlotTimeFields
            dayPlanId={dayPlanId}
            slot={slot}
            title={title}
            startTime={startTime}
            endTime={endTime}
            disabled={isLoading}
          />
        ) : null}
        {editing && dayPlanId !== "" ? (
          <SlotAddControl
            slot={slot}
            dayPlanId={dayPlanId}
            nextSlotOrder={nextSortOrder(activities)}
            disabled={disabled}
          />
        ) : null}
      </div>
      <div
        ref={ref}
        className={cn(
          "h-fit min-w-0 flex-1 overflow-hidden rounded-xl border",
          activities.length === 0 && !isLoading && "border-dashed",
          isDropTarget && "bg-muted"
        )}
      >
        {isLoading ? (
          <ItemGroup className="gap-0 divide-y has-data-[size=sm]:gap-0">
            <DayActivityRowSkeleton />
            <DayActivityRowSkeleton />
          </ItemGroup>
        ) : activities.length === 0 ? (
          <Empty className="min-h-20 gap-0 border-0 p-0">
            <Button
              type="button"
              variant="ghost"
              className="h-20 w-full rounded-none text-muted-foreground"
              disabled={!onAddActivity}
              onClick={onAddActivity}
            >
              <PlusIcon data-icon="inline-start" />
              Add an activity
            </Button>
          </Empty>
        ) : (
          <ItemGroup className="gap-0 divide-y has-data-[size=sm]:gap-0">
            {activities.map((item, index) => (
              <DayActivityRow
                key={item.id}
                id={item.id}
                index={index}
                group={slot}
                activity={item}
                disabled={disabled}
                editing={editing}
                onCommand={onCommand}
                onUnassign={onUnassign}
              />
            ))}
          </ItemGroup>
        )}
      </div>
    </section>
  )
}

export default DaySlot
