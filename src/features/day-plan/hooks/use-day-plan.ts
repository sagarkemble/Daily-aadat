import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { dayPlanQueryKey } from "../lib/query-key"
import type {
  DayItem,
  DayPlan,
  DayPlanDetail,
  DayPlanTemplate,
} from "../types/day-plan"

type RawTemplate = DayPlanTemplate | DayPlanTemplate[] | null

type RawDayPlanRow = Omit<DayPlan, "templates"> & {
  templates: RawTemplate
  day_items: DayItem[] | null
}

function normalizeTemplate(templates: RawTemplate): DayPlanTemplate | null {
  if (Array.isArray(templates)) return templates[0] ?? null
  return templates
}

async function fetchDayPlan(
  userId: string,
  planDate: string
): Promise<DayPlanDetail> {
  const { data, error } = await supabase
    .from("day_plans")
    .select(
      `
      id,
      user_id,
      plan_date,
      status,
      template_id,
      ended_at,
      created_at,
      updated_at,
      templates (
        id,
        name
      ),
      day_items (
        id,
        day_plan_id,
        kind,
        activity_id,
        title,
        name_snapshot,
        icon_snapshot,
        type,
        target,
        unit,
        slot,
        sort_order,
        state,
        started_at,
        stopped_at,
        duration_ms,
        count_value,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", userId)
    .eq("plan_date", planDate)
    .maybeSingle()

  if (error) throw error
  if (!data) return { plan: null, items: [] }

  const row = data as unknown as RawDayPlanRow
  const items = [...(row.day_items ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return {
    plan: {
      id: row.id,
      user_id: row.user_id,
      plan_date: row.plan_date,
      status: row.status,
      template_id: row.template_id,
      ended_at: row.ended_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      templates: normalizeTemplate(row.templates),
    },
    items,
  }
}

export function useDayPlan(planDate: string) {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: dayPlanQueryKey(userId ?? "", planDate),
    queryFn: () => fetchDayPlan(userId!, planDate),
    enabled: !!userId && !!planDate,
  })
}
