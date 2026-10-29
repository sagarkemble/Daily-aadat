import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SKELETON_COUNT = 6

type TodoListSkeletonProps = {
  mobile?: boolean
}

export function TodoListSkeleton({ mobile }: TodoListSkeletonProps) {
  if (mobile) {
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
          </Item>
        ))}
      </ItemGroup>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>Title</TableHead>
          <TableHead className="w-28">Priority</TableHead>
          <TableHead className="w-28">Due</TableHead>
          <TableHead className="w-36">Assigned on</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="size-4 rounded-sm" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-2/3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-14" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
