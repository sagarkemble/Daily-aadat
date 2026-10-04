"use client"
import React, { useRef, useState } from "react"

import { Grip } from "lucide-react"
import { Reorder, useDragControls, useMotionValue } from "motion/react"

import { useRaisedShadow } from "@/components/ui/use-raised-shadow"
import { cn } from "@/lib/utils"

const ReorderList: React.FC<ReorderListProps> = ({
  className,
  itemClassName,
  withDragHandle = false,
  onReorderFinish,
  ...props
}) => {
  const [items, setItems] = useState<React.ReactElement[]>(
    React.Children.toArray(props.children).filter((child) =>
      React.isValidElement(child)
    ) as React.ReactElement[]
  )
  const itemsRef = useRef(items)
  itemsRef.current = items
  const orderAtDragStartRef = useRef<string[] | null>(null)

  const handleReorder = (newOrder: unknown[]) => {
    setItems(newOrder as React.ReactElement[])
  }

  const handleDragStart = () => {
    orderAtDragStartRef.current = itemsRef.current.map((item) => String(item.key))
  }

  const handleDragEnd = () => {
    const previousKeys = orderAtDragStartRef.current
    orderAtDragStartRef.current = null
    if (!previousKeys) return

    const next = itemsRef.current
    const nextKeys = next.map((item) => String(item.key))
    const unchanged =
      previousKeys.length === nextKeys.length &&
      previousKeys.every((key, index) => key === nextKeys[index])
    if (unchanged) return

    onReorderFinish?.(next)
  }

  return (
    <Reorder.Group
      data-slot="reorder-list-group"
      axis="y"
      className={cn(
        "!m-0 flex list-none flex-col gap-1 !p-0 select-none",
        className
      )}
      values={items}
      onReorder={handleReorder}
      {...props}
    >
      {items.map((item, index) => (
        <ReorderListItem
          key={item?.key || index}
          item={item}
          withDragHandle={withDragHandle}
          className={itemClassName}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </Reorder.Group>
  )
}

const ReorderListItem: React.FC<{
  item: React.ReactElement
  className?: string
  withDragHandle?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}> = ({
  item,
  className,
  withDragHandle = false,
  onDragStart,
  onDragEnd,
}) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      data-slot="reorder-list-item"
      id={item?.key ?? ""}
      value={item}
      className={cn(
        "!m-0 list-none bg-background !p-0",
        !withDragHandle ? "cursor-grab" : "",
        className
      )}
      style={{ boxShadow, y }}
      dragListener={!withDragHandle}
      dragControls={withDragHandle ? dragControls : undefined}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {withDragHandle ? (
        <div className="relative flex items-center gap-2">
          {React.isValidElement<{ className?: string }>(item)
            ? React.cloneElement(item, {
                className: cn("w-full pr-12", item.props.className),
              })
            : item}
          <Grip
            className="absolute top-1/2 right-4 size-6 -translate-y-1/2 cursor-grab text-muted-foreground"
            onPointerDown={(e) => dragControls.start(e)}
          />
        </div>
      ) : (
        item
      )}
    </Reorder.Item>
  )
}

export interface ReorderListProps extends Partial<
  React.ComponentProps<typeof Reorder.Group>
> {
  /** @public (required) - The children of the list */
  children: React.ReactElement[]
  /** @public (optional) - The className of the list */
  className?: string
  /** @public (optional) - The className of the item */
  itemClassName?: string
  /** @public (optional) - With drag handle */
  withDragHandle?: boolean
  /** @public (optional) - When the list is reordered */
  onReorderFinish?: (newOrder: React.ReactElement[]) => void
}

export { ReorderList }
