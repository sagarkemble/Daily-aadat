import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

export function ActivityCardSkeleton() {
  return (
    <Item
      variant="default"
      size="sm"
      className="rounded-none border-0 border-b border-border px-0"
    >
      <ItemMedia variant="icon">
        <Skeleton className="size-8 rounded-md" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-2/3" />
      </ItemContent>
      <ItemActions>
        <Skeleton className="h-5 w-14 rounded-md" />
      </ItemActions>
    </Item>
  )
}
