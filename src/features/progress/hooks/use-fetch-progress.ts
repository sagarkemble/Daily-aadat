import { useQuery } from "@tanstack/react-query"

import type { ActivityKind, State } from "@/features/day-plan/types/day-plan"
import { progressByRangeQueryKey } from "@/lib/query-keys"
import { supabase } from "@/lib/supabase"
import type { ProgressDay, ProgressPlacement } from "../types/progress"

type FetchedProgressItem = {
  id: string
  kind: ActivityKind
  activity_id: string | null
  name_snapshot: string
  icon_snapshot: string | null
  state: State
}

type FetchedProgressPlan = {
  plan_date: string
  day_items: FetchedProgressItem[] | null
}

function toPlacement(item: FetchedProgressItem): ProgressPlacement {
  return {
    id: item.id,
    activityId: item.activity_id ?? item.id,
    name: item.name_snapshot,
    icon: item.icon_snapshot ?? "circle",
    skipped: item.state === "skipped",
    ticked: item.state === "done",
  }
}

function toProgressDays(rows: FetchedProgressPlan[]): ProgressDay[] {
  return rows.map((row) => ({
    date: row.plan_date,
    placements: (row.day_items ?? [])
      .filter((item) => item.kind === "activity")
      .map(toPlacement),
  }))
}

async function fetchProgressDays(
  start: string,
  end: string
): Promise<ProgressDay[]> {
  const { data, error } = await supabase
    .from("day_plans")
    .select(
      `
      plan_date,
      day_items (
        id,
        kind,
        activity_id,
        name_snapshot,
        icon_snapshot,
        state
      )
    `
    )
    .gte("plan_date", start)
    .lte("plan_date", end)
    .order("plan_date")

  if (error) throw error

  return toProgressDays((data ?? []) as FetchedProgressPlan[])
}

function useFetchProgress(start: string, end: string) {
  return useQuery({
    queryKey: progressByRangeQueryKey(start, end),
    queryFn: () => fetchProgressDays(start, end),
  })
}

export { useFetchProgress }
