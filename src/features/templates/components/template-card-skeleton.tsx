import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TemplateCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Skeleton className="size-11 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
        <CardAction>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex min-w-0 flex-col gap-1.5">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
