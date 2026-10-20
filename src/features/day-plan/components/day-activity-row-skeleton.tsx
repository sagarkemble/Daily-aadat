import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

const DayActivityRowSkeleton = () => {
  return (
    <Item variant="default" size="sm" className="rounded-none px-0">
      <ItemMedia>
        <Skeleton className="size-5 rounded-sm" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </ItemContent>
      <ItemActions>
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="size-4 rounded-sm" />
      </ItemActions>
    </Item>
  )
}

export default DayActivityRowSkeleton
