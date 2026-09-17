import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { dayPlanQueryKey } from "../lib/query-key"
import { syncDayPlanStatus } from "../lib/sync-day-plan-status"
import type { DayItem } from "../types/day-plan"

export type DayItemAction =
  | { type: "done"; item: DayItem }
  | { type: "skip"; item: DayItem }
  | { type: "undo"; item: DayItem }
  | { type: "start"; item: DayItem }
  | { type: "stop"; item: DayItem }
  | { type: "cancel-run"; item: DayItem }
  | { type: "increment"; item: DayItem }
  | { type: "decrement"; item: DayItem }

async function assertEditable(planId: string) {
  const { data, error } = await supabase
    .from("day_plans")
    .select("status")
    .eq("id", planId)
    .single()

  if (error) throw error
  if (data.status === "ended") {
    throw new Error("Re-open this day before editing")
  }
}

async function stopRunningOthers(planId: string, exceptId: string) {
  const { data: running, error } = await supabase
    .from("day_items")
    .select("id, started_at")
    .eq("day_plan_id", planId)
    .eq("state", "running")
    .neq("id", exceptId)

  if (error) throw error

  const stoppedAt = new Date().toISOString()
  for (const item of running ?? []) {
    const duration_ms = item.started_at
      ? Date.now() - new Date(item.started_at).getTime()
      : 0
    const { error: stopError } = await supabase
      .from("day_items")
      .update({
        state: "done",
        stopped_at: stoppedAt,
        duration_ms,
      })
      .eq("id", item.id)
    if (stopError) throw stopError
  }
}

async function performDayItemAction({ type, item }: DayItemAction) {
  await assertEditable(item.day_plan_id)

  if (type === "done") {
    const { error } = await supabase
      .from("day_items")
      .update({ state: "done" })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "skip") {
    const { error } = await supabase
      .from("day_items")
      .update({ state: "skipped" })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "undo") {
    const { error } = await supabase
      .from("day_items")
      .update({
        state: "pending",
        started_at: null,
        stopped_at: null,
        duration_ms: null,
      })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "start") {
    await stopRunningOthers(item.day_plan_id, item.id)
    const { error } = await supabase
      .from("day_items")
      .update({
        state: "running",
        started_at: new Date().toISOString(),
        stopped_at: null,
        duration_ms: null,
      })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "stop") {
    const duration_ms = item.started_at
      ? Date.now() - new Date(item.started_at).getTime()
      : 0
    const { error } = await supabase
      .from("day_items")
      .update({
        state: "done",
        stopped_at: new Date().toISOString(),
        duration_ms,
      })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "cancel-run") {
    const { error } = await supabase
      .from("day_items")
      .update({
        state: "pending",
        started_at: null,
        stopped_at: null,
        duration_ms: null,
      })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "increment") {
    const { error } = await supabase
      .from("day_items")
      .update({ count_value: item.count_value + 1 })
      .eq("id", item.id)
    if (error) throw error
  }

  if (type === "decrement") {
    if (item.count_value <= 0) return
    const { error } = await supabase
      .from("day_items")
      .update({ count_value: item.count_value - 1 })
      .eq("id", item.id)
    if (error) throw error
  }

  await syncDayPlanStatus(item.day_plan_id)
}

export function useDayItemAction(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: performDayItemAction,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
