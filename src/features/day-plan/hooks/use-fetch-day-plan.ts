import { supabase } from "@/lib/supabase"
import { SLOTS } from "@/features/templates/types/slots"
import { useQuery } from "@tanstack/react-query"
import type {
  DayPlanActivity,
  DayPlanWithActivities,
  FetchedDayPlan,
  SlotWithActivities,
} from "../types/day-plan"

function groupActivitiesBySlot(
  activities: DayPlanActivity[]
): SlotWithActivities {
  const activitiesBySlot: SlotWithActivities = {
    early_morning: [],
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  }

  for (const activity of activities) {
    activitiesBySlot[activity.slot].push({
      ...activity,
    })
  }

  for (const slot of SLOTS) {
    activitiesBySlot[slot].sort((a, b) => a.slot_order - b.slot_order)
  }

  return activitiesBySlot
}

async function fetchDayPlan(
  date: string
): Promise<DayPlanWithActivities | null> {
  const { data, error } = await supabase
    .from("day_plans")
    .select(
      `
      id,
      plan_date,
      status,
      template_id,
      ended_at,
      created_at,
      updated_at,
      activities:day_items(
        id,
        day_plan_id,
        kind,
        activity_id,
        name_snapshot,
        icon_snapshot,
        type,
        target,
        unit,
        slot,
        slot_order:sort_order,
        state,
        started_at,
        stopped_at,
        duration:duration_ms,
        count_value,
        created_at,
        updated_at,
        note_snapshot
      )
    `
    )
    .eq("plan_date", date)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const row = data as unknown as FetchedDayPlan

  return {
    ...row,
    activities: groupActivitiesBySlot(row.activities),
  } as DayPlanWithActivities
}

function useFetchDayPlan(date: string) {
  return useQuery({
    queryKey: ["day-plan", date],
    queryFn: () => fetchDayPlan(date),
  })
}

export { useFetchDayPlan }
