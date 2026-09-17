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
import type { Slot } from "../types/slots"
import { SLOT_LABELS } from "../types/slots"
import type { TemplateItem } from "../types/template"
import { TemplateItemRow } from "./template-item-row"

type TemplateSlotSectionProps = {
  slot: Slot
  items: TemplateItem[]
  onAdd: (slot: Slot) => void
  onRemove: (itemId: string) => void
  onReorder: (orderedIds: string[]) => void
  isRemoving?: boolean
}

export function TemplateSlotSection({
  slot,
  items,
  onAdd,
  onRemove,
  onReorder,
  isRemoving = false,
}: TemplateSlotSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const sortable = items.length > 1

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    onReorder(arrayMove(items, oldIndex, newIndex).map((item) => item.id))
  }

  return (
    <section className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{SLOT_LABELS[slot]}</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
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
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <TemplateItemRow
                  key={item.id}
                  item={item}
                  onRemove={onRemove}
                  isRemoving={isRemoving}
                  sortable={sortable}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  )
}
