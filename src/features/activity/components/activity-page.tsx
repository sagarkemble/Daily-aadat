import { useMemo, useState } from "react"
import { ClipboardListIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useDebounce } from "@/hooks/use-debounce"
import { useFetchActivities } from "../hooks/use-fetch-activities"
import {
  filterActivities,
  type ActivityTypeFilter,
} from "../lib/filter-activities"
import { ActivityCard } from "./activity-card"
import { ActivityCardSkeleton } from "./activity-card-skeleton"
import { ActivityToolbar } from "./activity-toolbar"
import { AddActivityDialog } from "./add-activity-dialog"
import { EmptyActivity } from "./empty-activity"

const CUSTOM_SKELETON_COUNT = 10
const PREDEFINED_SKELETON_COUNT = 50

const ActivityPage = () => {
  const { data, isPending, isError, error } = useFetchActivities()
  const [query, setQuery] = useState("")
  const [type, setType] = useState<ActivityTypeFilter>("all")
  const debouncedQuery = useDebounce(query, 300)
  const searchQuery = query.trim() === "" ? "" : debouncedQuery

  const activities = data ?? []
  const custom = useMemo(
    () => (data ?? []).filter((activity) => activity.source === "custom"),
    [data]
  )
  const predefined = useMemo(
    () => (data ?? []).filter((activity) => activity.source === "predefined"),
    [data]
  )
  const filteredCustom = useMemo(
    () => filterActivities(custom, searchQuery, type),
    [custom, searchQuery, type]
  )
  const filteredPredefined = useMemo(
    () => filterActivities(predefined, searchQuery, type),
    [predefined, searchQuery, type]
  )

  if (isError) return <div>{error.message}</div>

  const hasActiveFilters = query.trim() !== "" || type !== "all"
  const showCustomEmpty =
    !isPending && custom.length === 0 && !hasActiveFilters
  const showCustomSection =
    isPending || showCustomEmpty || filteredCustom.length > 0
  const showFilteredEmpty =
    !isPending &&
    activities.length > 0 &&
    filteredCustom.length === 0 &&
    filteredPredefined.length === 0

  function clearFilters() {
    setQuery("")
    setType("all")
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <ActivityToolbar
        query={query}
        type={type}
        onQueryChange={setQuery}
        onTypeChange={setType}
      />
      {showFilteredEmpty ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle>No activities match</EmptyTitle>
            <EmptyDescription>
              Try a different search or type filter.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          {showCustomSection ? (
            <section className="flex flex-col gap-3">
              <h2 className="font-medium text-muted-foreground">
                Your activities
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {isPending ? (
                  <SkeletonGrid count={CUSTOM_SKELETON_COUNT} />
                ) : showCustomEmpty ? (
                  <div className="col-span-full">
                    <EmptyActivity
                      title="No custom activities yet"
                      description="Add your own, or use a predefined activity below."
                      icon={<ClipboardListIcon />}
                    >
                      <AddActivityDialog />
                    </EmptyActivity>
                  </div>
                ) : (
                  filteredCustom.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </section>
          ) : null}
          {isPending || filteredPredefined.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2 className="font-medium text-muted-foreground">Predefined</h2>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {isPending ? (
                  <SkeletonGrid count={PREDEFINED_SKELETON_COUNT} />
                ) : (
                  filteredPredefined.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}

function SkeletonGrid({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, index) => (
    <ActivityCardSkeleton key={index} />
  ))
}

export default ActivityPage
