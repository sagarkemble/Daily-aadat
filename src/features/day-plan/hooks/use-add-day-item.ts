import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import type { ActivityPlacement } from "@/features/activity/components/activity-picker-sheet"
import type { Slot } from "@/features/templates/types/slots"
import { ensureDayPlan } from "../lib/ensure-day-plan"
import { dayPlanQueryKey } from "../lib/query-key"
import { syncDayPlanStatus } from "../lib/sync-day-plan-status"

export type AddDayItemsInput = {
  planDate: string
  slot: Slot
  placements: ActivityPlacement[]
}

async function addDayItems({ planDate, slot, placements }: AddDayItemsInput) {
  if (placements.length === 0) return

  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const ids = placements.map((placement) => placement.activity_id)
  const { data: activityRows, error: activityError } = await supabase
    .from("activities")
    .select("id, name, icon")
    .in("id", ids)

  if (activityError) throw activityError

  const activitiesById = new Map(
    (activityRows ?? []).map(
      (row: { id: string; name: string; icon: string }) => [row.id, row]
    )
  )

  const plan = await ensureDayPlan(user.id, planDate)
  if (plan.status === "ended") {
    throw new Error("Re-open this day before adding activities")
  }

  const { data: siblings, error: siblingsError } = await supabase
    .from("day_items")
    .select("sort_order")
    .eq("day_plan_id", plan.id)
    .eq("slot", slot)

  if (siblingsError) throw siblingsError

  const baseSort =
    (siblings ?? []).reduce(
      (max: number, item: { sort_order: number }) =>
        Math.max(max, item.sort_order),
      -1
    ) + 1

  const rows = placements.map((placement, index) => {
    const activity = activitiesById.get(placement.activity_id)
    if (!activity) {
      throw new Error("Activity not found")
    }
    return {
      day_plan_id: plan.id,
      kind: "activity" as const,
      activity_id: placement.activity_id,
      name_snapshot: activity.name,
      icon_snapshot: activity.icon,
      type: placement.type,
      target: placement.target,
      unit: placement.unit,
      slot,
      sort_order: baseSort + index,
      state: "pending" as const,
    }
  })

  const { error: insertError } = await supabase.from("day_items").insert(rows)

  if (insertError) {
    if (insertError.code === "23505") {
      throw new Error("That activity is already in this slot")
    }
    throw insertError
  }

  await syncDayPlanStatus(plan.id)
}

export function useAddDayItem(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: addDayItems,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
