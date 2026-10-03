import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

const DayActivityRowSkeleton = () => {
  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <Skeleton className="size-8 rounded-md" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </ItemContent>
      <ItemActions>
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-8 w-12 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </ItemActions>
    </Item>
  )
}

export default DayActivityRowSkeleton
