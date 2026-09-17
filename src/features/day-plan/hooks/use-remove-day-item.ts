import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { dayPlanQueryKey } from "../lib/query-key"
import { syncDayPlanStatus } from "../lib/sync-day-plan-status"

async function removeDayItem(itemId: string, planId: string) {
  const { data: plan, error: planError } = await supabase
    .from("day_plans")
    .select("status")
    .eq("id", planId)
    .single()

  if (planError) throw planError
  if (plan.status === "ended") {
    throw new Error("Re-open this day before editing")
  }

  const { error } = await supabase.from("day_items").delete().eq("id", itemId)
  if (error) throw error

  await syncDayPlanStatus(planId)
}

export function useRemoveDayItem(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: ({ itemId, planId }: { itemId: string; planId: string }) =>
      removeDayItem(itemId, planId),
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
