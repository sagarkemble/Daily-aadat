import { useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  ActivityPickerSheet,
  type ActivityPlacement,
} from "@/features/activity/components/activity-picker-sheet"
import { useAddTemplateItem } from "../hooks/use-add-template-item"
import { useRemoveTemplateItem } from "../hooks/use-remove-template-item"
import { useReorderTemplateItems } from "../hooks/use-reorder-template-items"
import { useTemplate } from "../hooks/use-template"
import { SLOTS, type Slot } from "../types/slots"
import type { TemplateItem } from "../types/template"
import { TemplateSlotSection } from "./template-slot-section"

type TemplateEditorProps = {
  templateId: string
}

function emptyItemsBySlot(): Record<Slot, TemplateItem[]> {
  return {
    early_morning: [],
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  }
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  const { data, isPending, isError, error } = useTemplate(templateId)
  const { mutate: addItem, isPending: isAdding } =
    useAddTemplateItem(templateId)
  const { mutate: removeItem, isPending: isRemoving } =
    useRemoveTemplateItem(templateId)
  const { mutate: reorderItems } = useReorderTemplateItems(templateId)

  const [pickerSlot, setPickerSlot] = useState<Slot | null>(null)

  const itemsBySlot = useMemo(() => {
    const map = emptyItemsBySlot()
    if (!data) return map
    for (const item of data.template_items) {
      map[item.slot].push(item)
    }
    for (const slot of SLOTS) {
      map[slot].sort((a, b) => a.sort_order - b.sort_order)
    }
    return map
  }, [data])

  const excludeActivityIds = useMemo(() => {
    if (!pickerSlot || !data) return []
    return itemsBySlot[pickerSlot].map((item) => item.activity_id)
  }, [data, itemsBySlot, pickerSlot])

  function handleConfirm(placements: ActivityPlacement[]) {
    if (!pickerSlot || !data || placements.length === 0) return

    addItem(
      {
        template_id: templateId,
        slot: pickerSlot,
        sort_order_start: itemsBySlot[pickerSlot].length,
        placements,
      },
      {
        onSuccess: () => {
          toast.add({
            title:
              placements.length === 1
                ? "Activity added"
                : `${placements.length} activities added`,
            type: "success",
          })
          setPickerSlot(null)
        },
        onError: (err) => {
          toast.add({
            title: "Error",
            description: err.message,
            type: "error",
          })
        },
      }
    )
  }

  function handleRemove(itemId: string) {
    removeItem(itemId, {
      onSuccess: () => {
        toast.add({
          title: "Removed from template",
          type: "success",
        })
      },
      onError: (err) => {
        toast.add({
          title: "Error",
          description: err.message,
          type: "error",
        })
      },
    })
  }

  function handleReorder(orderedIds: string[]) {
    reorderItems(orderedIds, {
      onError: (err) => {
        toast.add({
          title: "Error",
          description: err.message,
          type: "error",
        })
      },
    })
  }

  if (isPending) return <div>Loading…</div>
  if (isError) return <div>{error.message}</div>
  if (!data) return <div>Template not found.</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link
            to="/templates"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to templates
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{data.name}</h1>
            <p className="text-sm text-muted-foreground">
              Add activities into each part of the day. Changes save
              automatically.
            </p>
          </div>
        </div>
        <Button render={<Link to="/templates" />}>Done</Button>
      </div>

      <div className="flex flex-col gap-4">
        {SLOTS.map((slot) => (
          <TemplateSlotSection
            key={slot}
            slot={slot}
            items={itemsBySlot[slot]}
            onAdd={setPickerSlot}
            onRemove={handleRemove}
            onReorder={handleReorder}
            isRemoving={isRemoving}
          />
        ))}
      </div>

      <ActivityPickerSheet
        key={pickerSlot ?? "closed"}
        open={pickerSlot != null}
        onOpenChange={(open) => {
          if (!open) setPickerSlot(null)
        }}
        excludeActivityIds={excludeActivityIds}
        onConfirm={handleConfirm}
        isPending={isAdding}
      />
    </div>
  )
}
