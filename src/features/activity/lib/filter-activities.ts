import {
  activityTypeLabels,
  type Activity,
  type ActivityType,
} from "../types/activity"

const ACTIVITY_TYPE_FILTERS = ["all", "check", "count", "timed"] as const

type ActivityTypeFilter = (typeof ACTIVITY_TYPE_FILTERS)[number]

const ACTIVITY_TYPE_FILTER_LABELS: Record<ActivityTypeFilter, string> = {
  all: "All",
  check: activityTypeLabels.check,
  count: activityTypeLabels.count,
  timed: activityTypeLabels.timed,
}

function isActivityTypeFilter(value: string): value is ActivityTypeFilter {
  return ACTIVITY_TYPE_FILTERS.some((item) => item === value)
}

function matchesActivityType(
  suggestedType: ActivityType,
  type: ActivityTypeFilter
): boolean {
  return type === "all" || suggestedType === type
}

function filterActivities(
  activities: Activity[],
  query: string,
  type: ActivityTypeFilter
): Activity[] {
  const q = query.trim().toLowerCase()
  return activities.filter((activity) => {
    if (!matchesActivityType(activity.suggested_type, type)) return false
    if (q === "") return true
    return activity.name.toLowerCase().includes(q)
  })
}

export {
  ACTIVITY_TYPE_FILTER_LABELS,
  ACTIVITY_TYPE_FILTERS,
  filterActivities,
  isActivityTypeFilter,
  type ActivityTypeFilter,
}
