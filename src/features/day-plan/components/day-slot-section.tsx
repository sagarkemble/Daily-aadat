import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SLOT_LABELS, type Slot } from "@/features/templates/types/slots"
import type { DayItem } from "../types/day-plan"
import type { DayItemAction } from "../hooks/use-day-item-action"
import { DayItemRow } from "./day-item-row"

type DaySlotSectionProps = {
  slot: Slot
  items: DayItem[]
  locked: boolean
  isEditing?: boolean
  now: number
  isPending?: boolean
  onAdd: (slot: Slot) => void
  onAction: (action: DayItemAction) => void
  onUndoTimed: (item: DayItem) => void
  onRemove?: (itemId: string) => void
  onReorder?: (orderedIds: string[]) => void
}

export function DaySlotSection({
  slot,
  items,
  locked,
  isEditing = false,
  now,
  isPending = false,
  onAdd,
  onAction,
  onUndoTimed,
  onRemove,
  onReorder,
}: DaySlotSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    if (!isEditing) return
    const { active, over } = event
    if (!over || active.id === over.id || !onReorder) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    onReorder(arrayMove(items, oldIndex, newIndex).map((item) => item.id))
  }

  const list = (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <DayItemRow
          key={item.id}
          item={item}
          locked={locked}
          isEditing={isEditing}
          now={now}
          isPending={isPending}
          onAction={onAction}
          onUndoTimed={onUndoTimed}
          onRemove={onRemove}
        />
      ))}
    </div>
  )

  return (
    <section className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{SLOT_LABELS[slot]}</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={locked}
          onClick={() => onAdd(slot)}
        >
          <PlusIcon />
          Activity
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activities yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {list}
          </SortableContext>
        </DndContext>
      )}
    </section>
  )
}
