import {
  Item,
  ItemContent,
  ItemGroup,
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
    <div className="overflow-hidden rounded-xl border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 px-4" />
            <TableHead className="px-4">Title</TableHead>
            <TableHead className="w-28 px-4">Priority</TableHead>
            <TableHead className="w-28 px-4">Due</TableHead>
            <TableHead className="w-36 px-4">Assigned on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-2.5">
                <Skeleton className="size-4 rounded-sm" />
              </TableCell>
              <TableCell className="px-4 py-2.5">
                <Skeleton className="h-4 w-2/3" />
              </TableCell>
              <TableCell className="px-4 py-2.5">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="px-4 py-2.5">
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell className="px-4 py-2.5">
                <Skeleton className="h-8 w-20 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
