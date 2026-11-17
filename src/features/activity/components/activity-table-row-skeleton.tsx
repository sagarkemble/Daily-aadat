import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function ActivityTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </TableCell>
      <TableCell className="px-4 py-2.5 text-right">
        <Skeleton className="ml-auto h-5 w-14 rounded-md" />
      </TableCell>
    </TableRow>
  )
}
