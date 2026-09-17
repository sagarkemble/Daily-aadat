import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { dayPlanQueryKey } from "../lib/query-key"

async function unplanDay(planId: string) {
  const { data: plan, error: planError } = await supabase
    .from("day_plans")
    .select("status")
    .eq("id", planId)
    .single()

  if (planError) throw planError
  if (plan.status === "ended") {
    throw new Error("Re-open this day before unplanning")
  }

  const { error: deleteError } = await supabase
    .from("day_items")
    .delete()
    .eq("day_plan_id", planId)

  if (deleteError) throw deleteError

  const { error: updateError } = await supabase
    .from("day_plans")
    .update({
      status: "empty",
      template_id: null,
      ended_at: null,
    })
    .eq("id", planId)

  if (updateError) throw updateError
}

export function useUnplanDay(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: unplanDay,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
