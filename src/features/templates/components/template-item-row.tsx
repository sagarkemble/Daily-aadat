import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { cn } from "cn"
import { GripVerticalIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import type { TemplateItem } from "../types/template"

type TemplateItemRowProps = {
  item: TemplateItem
  onRemove: (itemId: string) => void
  isRemoving?: boolean
  sortable?: boolean
}

export function TemplateItemRow({
  item,
  onRemove,
  isRemoving = false,
  sortable = false,
}: TemplateItemRowProps) {
  const activity = item.activities
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !sortable })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-background p-2.5",
        isDragging && "relative z-10 opacity-80 shadow-md"
      )}
    >
      {sortable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          aria-label={`Reorder ${activity?.name ?? "activity"}`}
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="size-4" />
        </Button>
      ) : null}
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <ActivityIcon
          name={activity?.icon ?? "circle-dashed"}
          className="size-4"
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {activity?.name ?? "Unknown activity"}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {item.type}
          {item.type === "count" && item.target != null
            ? ` · ${item.target}${item.unit ? ` ${item.unit}` : ""}`
            : null}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isRemoving}
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${activity?.name ?? "activity"}`}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  )
}
