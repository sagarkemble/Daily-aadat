import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ACTIVITY_SKELETON_COUNT = 5

function ProgressPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} size="sm">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="py-6">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: ACTIVITY_SKELETON_COUNT }).map((_, index) => (
          <Card key={index} size="sm">
            <CardHeader>
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export { ProgressPageSkeleton }
