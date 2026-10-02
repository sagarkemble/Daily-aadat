import { Skeleton } from "@/components/ui/skeleton"

export function ActivityCardSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 shadow-xs">
      <Skeleton className="size-9 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
