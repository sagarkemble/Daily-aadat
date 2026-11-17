import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

const TemplateActivityRowSkeleton = () => {
  return (
    <Item variant="default" size="sm" className="rounded-none px-3">
      <ItemMedia variant="icon">
        <Skeleton className="size-10 rounded-md" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </ItemContent>
      <ItemActions>
        <Skeleton className="h-5 w-12 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </ItemActions>
    </Item>
  )
}

export default TemplateActivityRowSkeleton
