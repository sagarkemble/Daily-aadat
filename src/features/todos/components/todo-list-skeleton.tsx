import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

const SKELETON_COUNT = 6

export function TodoListSkeleton() {
  return (
    <ItemGroup>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Item key={index} variant="outline" size="sm">
          <ItemMedia variant="icon">
            <Skeleton className="size-8 rounded-md" />
          </ItemMedia>
          <ItemContent>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-8 w-12 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
