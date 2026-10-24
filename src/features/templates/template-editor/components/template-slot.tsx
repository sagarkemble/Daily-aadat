import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"

import { ItemGroup } from "@/components/ui/item"
import { cn } from "@/lib/utils"
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityRow } from "./template-activity-row"
import TemplateActivityRowSkeleton from "./template-activity-row-skeleton"

type SlotProps = {
  id: string
  title: string
  items: TemplateActivity[]
  isLoading?: boolean
}

const TemplateSlot = ({ id, title, items, isLoading = false }: SlotProps) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    accept: "activity",
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{title}</h2>
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
