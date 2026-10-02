import { AddActivityDialog } from "./add-activity-dialog"
import { ActivityCard } from "./activity-card"
import { useActivities } from "../hooks/use-activities"
import { ActivityCardSkeleton } from "./activity-card-skeleton"
import { EmptyActivity } from "./empty-activity"
import { ClipboardListIcon } from "lucide-react"

const CUSTOM_SKELETON_COUNT = 10
const PREDEFINED_SKELETON_COUNT = 50

const ActivityPage = () => {
  const { data, isPending, isError, error } = useActivities()
  if (isError) return <div>{error.message}</div>

  const predefined = data?.filter((a) => a.source === "predefined") ?? []
  const custom = data?.filter((a) => a.source === "custom") ?? []

  return (
    <div className="flex flex-col gap-8 p-4">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-muted-foreground">Your activities</h2>
          {custom.length > 0 && <AddActivityDialog />}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isPending ? (
            <SkeletonGrid count={CUSTOM_SKELETON_COUNT} />
          ) : custom.length === 0 ? (
            <div className="col-span-full">
              <EmptyActivity
                title="No custom activities yet"
                description="Add your own, or use a predefined activity below."
                icon={<ClipboardListIcon className="size-8" />}
              >
                <AddActivityDialog />
              </EmptyActivity>
            </div>
          ) : (
            custom.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-medium text-muted-foreground">Predefined</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isPending ? (
            <SkeletonGrid count={PREDEFINED_SKELETON_COUNT} />
          ) : (
            predefined.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function SkeletonGrid({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, index) => (
    <ActivityCardSkeleton key={index} />
  ))
}

export default ActivityPage
