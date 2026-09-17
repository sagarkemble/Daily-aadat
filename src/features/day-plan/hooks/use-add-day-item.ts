import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import type { ActivityPlacement } from "@/features/activity/components/activity-picker-sheet"
import type { Slot } from "@/features/templates/types/slots"
import { ensureDayPlan } from "../lib/ensure-day-plan"
import { dayPlanQueryKey } from "../lib/query-key"
import { syncDayPlanStatus } from "../lib/sync-day-plan-status"

export type AddDayItemInput = {
  planDate: string
  slot: Slot
  placement: ActivityPlacement
}

async function addDayItem({ planDate, slot, placement }: AddDayItemInput) {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .select("id, name, icon")
    .eq("id", placement.activity_id)
    .single()

  if (activityError) throw activityError

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

  const sort_order =
    (siblings ?? []).reduce(
      (max: number, item: { sort_order: number }) =>
        Math.max(max, item.sort_order),
      -1
    ) + 1

  const { error: insertError } = await supabase.from("day_items").insert({
    day_plan_id: plan.id,
    kind: "activity",
    activity_id: placement.activity_id,
    name_snapshot: activity.name,
    icon_snapshot: activity.icon,
    type: placement.type,
    target: placement.target,
    unit: placement.unit,
    slot,
    sort_order,
    state: "pending",
  })

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
    mutationFn: addDayItem,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
