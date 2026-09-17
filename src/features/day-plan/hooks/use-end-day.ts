import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { dayPlanQueryKey } from "../lib/query-key"
import { syncDayPlanStatus } from "../lib/sync-day-plan-status"

async function endDay(planId: string) {
  const { data: running, error: runningError } = await supabase
    .from("day_items")
    .select("id, started_at")
    .eq("day_plan_id", planId)
    .eq("state", "running")

  if (runningError) throw runningError

  const stoppedAt = new Date().toISOString()
  for (const item of running ?? []) {
    const duration_ms = item.started_at
      ? Date.now() - new Date(item.started_at).getTime()
      : 0
    const { error } = await supabase
      .from("day_items")
      .update({
        state: "done",
        stopped_at: stoppedAt,
        duration_ms,
      })
      .eq("id", item.id)
    if (error) throw error
  }

  await syncDayPlanStatus(planId, { force: "ended" })
}

async function reopenDay(planId: string) {
  await syncDayPlanStatus(planId, { force: "in_progress" })
}

export function useEndDay(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: endDay,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}

export function useReopenDay(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: reopenDay,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
