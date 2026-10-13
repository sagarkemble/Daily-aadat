"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { Grip } from "lucide-react"
import { Reorder, useDragControls, useMotionValue } from "motion/react"

import { useRaisedShadow } from "@/components/ui/use-raised-shadow"
import { cn } from "@/lib/utils"

function idsEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

function sameIdSet(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const ids = new Set(a)
  return b.every((id) => ids.has(id))
}

function ReorderList<T>({
  items,
  getItemId,
  className,
  itemClassName,
  withDragHandle = false,
  onReorderFinish,
  renderItem,
}: ReorderListProps<T>) {
  const parentIds = items.map(getItemId)
  const parentIdsKey = parentIds.join("\0")
  const [ids, setIds] = useState(parentIds)
  const idsRef = useRef(ids)
  idsRef.current = ids
  const orderAtDragStartRef = useRef<string[] | null>(null)

  useLayoutEffect(() => {
    if (orderAtDragStartRef.current) return
    setIds((prev) => {
      if (idsEqual(prev, parentIds) || sameIdSet(prev, parentIds)) return prev
      return parentIds
    })
  }, [parentIds, parentIdsKey])

  const itemById = new Map(items.map((item) => [getItemId(item), item]))
  const orderedItems = ids.flatMap((id) => {
    const item = itemById.get(id)
    return item ? [item] : []
  })

  const handleReorder = (newOrder: string[]) => {
    setIds(newOrder)
  }

  const handleDragStart = () => {
    orderAtDragStartRef.current = idsRef.current
  }

  const handleDragEnd = () => {
    const previousKeys = orderAtDragStartRef.current
    orderAtDragStartRef.current = null
    if (!previousKeys) return

    const next = idsRef.current
    if (idsEqual(previousKeys, next)) return

    const nextItems = next.flatMap((id) => {
      const item = itemById.get(id)
      return item ? [item] : []
    })
    onReorderFinish?.(nextItems)
  }

  return (
    <Reorder.Group
      data-slot="reorder-list-group"
      axis="y"
      values={ids}
      onReorder={handleReorder}
      className={cn(
        "!m-0 flex list-none flex-col gap-1 !p-0 select-none",
        className
      )}
    >
      {orderedItems.map((item) => {
        const id = getItemId(item)
        return (
          <ReorderListItem
            key={id}
            id={id}
            withDragHandle={withDragHandle}
            className={itemClassName}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {renderItem(item)}
          </ReorderListItem>
        )
      })}
    </Reorder.Group>
  )
}

function ReorderListItem({
  id,
  className,
  withDragHandle = false,
  onDragStart,
  onDragEnd,
  children,
}: {
  id: string
  className?: string
  withDragHandle?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
  children: ReactNode
}) {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      data-slot="reorder-list-item"
      id={id}
      value={id}
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
          <div className="w-full pr-12">{children}</div>
          <Grip
            className="absolute top-1/2 right-4 size-6 -translate-y-1/2 cursor-grab text-muted-foreground"
            onPointerDown={(e) => dragControls.start(e)}
          />
        </div>
      ) : (
        children
      )}
    </Reorder.Item>
  )
}

export interface ReorderListProps<T> {
  items: T[]
  getItemId: (item: T) => string
  renderItem: (item: T) => ReactNode
  className?: string
  itemClassName?: string
  withDragHandle?: boolean
  onReorderFinish?: (items: T[]) => void
}

export { ReorderList }
