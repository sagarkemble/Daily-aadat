import { useMemo, useState, type ReactNode } from "react"
import { ClipboardListIcon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { useDebounce } from "@/hooks/use-debounce"
import { useFetchActivities } from "../hooks/use-fetch-activities"
import {
  filterActivities,
  type ActivityTypeFilter,
} from "../lib/filter-activities"
import type { Activity } from "../types/activity"
import { ActivityCard } from "./activity-card"
import { ActivityCardSkeleton } from "./activity-card-skeleton"
import { ActivityToolbar } from "./activity-toolbar"
import { AddActivityDialog } from "./add-activity-dialog"
import { EmptyActivity } from "./empty-activity"

const CUSTOM_SKELETON_COUNT = 4
const PREDEFINED_SKELETON_COUNT = 8

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
    <PageShell>
      <PageHeader
        title="Activities"
        actions={
          <ActivityToolbar
            query={query}
            type={type}
            onQueryChange={setQuery}
            onTypeChange={setType}
          />
        }
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
        <div className="flex flex-col gap-8">
          {showCustomSection ? (
            <ActivitySection title="Your activities">
              {isPending ? (
                <ActivityListSkeleton count={CUSTOM_SKELETON_COUNT} />
              ) : showCustomEmpty ? (
                <EmptyActivity
                  title="No custom activities yet"
                  description="Add your own, or use a predefined activity below."
                  icon={<ClipboardListIcon />}
                >
                  <AddActivityDialog />
                </EmptyActivity>
              ) : (
                <ActivityList activities={filteredCustom} />
              )}
            </ActivitySection>
          ) : null}
          {isPending || filteredPredefined.length > 0 ? (
            <ActivitySection title="Predefined">
              {isPending ? (
                <ActivityListSkeleton count={PREDEFINED_SKELETON_COUNT} />
              ) : (
                <ActivityList activities={filteredPredefined} />
              )}
            </ActivitySection>
          ) : null}
        </div>
      )}
    </PageShell>
  )
}

function ActivitySection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <div className="overflow-hidden rounded-xl border px-4">
      <ItemGroup className="gap-0 has-data-[size=sm]:gap-0 [&>:last-child]:border-b-0 [&>:last-child_[data-slot=item]]:border-b-0">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ItemGroup>
    </div>
  )
}

function ActivityListSkeleton({ count }: { count: number }) {
  return (
    <div className="overflow-hidden rounded-xl border px-4">
      <ItemGroup className="gap-0 has-data-[size=sm]:gap-0 [&>:last-child]:border-b-0 [&>:last-child_[data-slot=item]]:border-b-0">
        {Array.from({ length: count }).map((_, index) => (
          <ActivityCardSkeleton key={index} />
        ))}
      </ItemGroup>
    </div>
  )
}

export default ActivityPage
