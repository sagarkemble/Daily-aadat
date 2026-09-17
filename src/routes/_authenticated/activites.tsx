import { ActivityCard } from "@/features/activity/components/activity-card"
import { AddActivityDialog } from "@/features/activity/components/add-activity-dialog"
import { useActivities } from "@/features/activity/hooks/use-activities"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/activites")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending, isError, error } = useActivities()
  if (isPending) return <div>Loading…</div>
  if (isError) return <div>{error.message}</div>

  const predefined = data.filter((a) => a.source === "predefined")
  const custom = data.filter((a) => a.source === "custom")

  return (
    <div className="flex flex-col gap-8 p-4">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Your activities
          </h2>
          <AddActivityDialog />
        </div>
        {custom.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {custom.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </section>
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Predefined
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {predefined.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  )
}
