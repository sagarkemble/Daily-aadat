import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import type { ActivityType } from "@/features/activity/types/activity"
import type { Slot } from "@/features/templates/types/slots"
import { ensureDayPlan } from "../lib/ensure-day-plan"
import { dayPlanQueryKey } from "../lib/query-key"
import { deriveDayStatus } from "../lib/day-status"
import type { ItemKind } from "../types/day-plan"

type RawActivity = {
  id: string
  name: string
  icon: string
} | null

type RawTemplateItem = {
  activity_id: string
  type: ActivityType
  target: number | null
  unit: string | null
  slot: Slot
  sort_order: number
  activities: RawActivity | RawActivity[]
}

export type ApplyTemplateInput = {
  planDate: string
  templateId: string
  overwrite?: boolean
}

export type ApplyTemplateResult =
  { ok: true } | { ok: false; needsOverwrite: true; activityCount: number }

function activityFromJoin(activities: RawActivity | RawActivity[]) {
  if (Array.isArray(activities)) return activities[0] ?? null
  return activities
}

async function applyTemplate({
  planDate,
  templateId,
  overwrite = false,
}: ApplyTemplateInput): Promise<ApplyTemplateResult> {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select(
      `
      id,
      template_items (
        activity_id,
        type,
        target,
        unit,
        slot,
        sort_order,
        activities (
          id,
          name,
          icon
        )
      )
    `
    )
    .eq("id", templateId)
    .single()

  if (templateError) throw templateError

  const plan = await ensureDayPlan(user.id, planDate)
  if (plan.status === "ended") {
    throw new Error("Re-open this day before changing template")
  }

  const { data: existingItems, error: existingError } = await supabase
    .from("day_items")
    .select("id, kind")
    .eq("day_plan_id", plan.id)

  if (existingError) throw existingError

  const activityItems = (existingItems ?? []).filter(
    (item: { kind: ItemKind }) => item.kind === "activity"
  )

  if (activityItems.length > 0 && !overwrite) {
    return {
      ok: false,
      needsOverwrite: true,
      activityCount: activityItems.length,
    }
  }

  if (overwrite && activityItems.length > 0) {
    const { error: deleteError } = await supabase
      .from("day_items")
      .delete()
      .eq("day_plan_id", plan.id)
      .eq("kind", "activity")
    if (deleteError) throw deleteError
  }

  const templateItems = (template.template_items ?? []) as RawTemplateItem[]
  const snapshots = templateItems.flatMap((item) => {
    const activity = activityFromJoin(item.activities)
    if (!activity) return []
    return [
      {
        day_plan_id: plan.id,
        kind: "activity" as const,
        activity_id: item.activity_id,
        name_snapshot: activity.name,
        icon_snapshot: activity.icon,
        type: item.type,
        target: item.target,
        unit: item.unit,
        slot: item.slot,
        sort_order: item.sort_order,
        state: "pending" as const,
      },
    ]
  })

  if (snapshots.length > 0) {
    const { error: insertError } = await supabase
      .from("day_items")
      .insert(snapshots)
    if (insertError) throw insertError
  }

  const { data: remaining, error: remainingError } = await supabase
    .from("day_items")
    .select("state, count_value")
    .eq("day_plan_id", plan.id)

  if (remainingError) throw remainingError

  const { error: updateError } = await supabase
    .from("day_plans")
    .update({
      template_id: templateId,
      status: deriveDayStatus(remaining ?? []),
      ended_at: null,
    })
    .eq("id", plan.id)

  if (updateError) throw updateError

  return { ok: true }
}

export function useApplyTemplate(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: applyTemplate,
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({
        queryKey: dayPlanQueryKey(userId, planDate),
      })
    },
  })
}
