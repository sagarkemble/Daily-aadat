import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type {
  TemplateBoard,
  TemplateActivity,
  TemplateDetail,
  fetchedTemplateDetail,
} from "../../types/template"
import { SLOTS } from "../../types/slots"

export async function fetchTemplateDetail(id: string): Promise<TemplateDetail> {
  const { data, error } = await supabase
    .from("templates")
    .select(
      `
      id,
  user_id,
  name,
  icon,
  description,
  created_at,
  updated_at,
  activities:template_items(
    id,
    template_id,
    activity_id,
    type,
    target,
    unit,
    slot,
    sort_order,
    note,
    created_at,
    updated_at,
    activity:activities (
      id, user_id, name, icon,
      suggested_type, suggested_target, suggested_unit, source
    )
  ),
  slot_times:template_slot_times(
    slot,
    start_time,
    end_time
  )
`
    )
    .eq("id", id)
    .single()

  if (error) throw error

  const row = data as unknown as fetchedTemplateDetail

  const board = Object.fromEntries(
    SLOTS.map((slot) => [
      slot,
      {
        start_time: null,
        end_time: null,
        activities: [] as TemplateActivity[],
      },
    ])
  ) as TemplateBoard

  for (const activity of row.activities) {
    board[activity.slot]?.activities.push(activity)
  }

  for (const slot of SLOTS) {
    board[slot].activities.sort((a, b) => a.sort_order - b.sort_order)
  }

  for (const time of row.slot_times ?? []) {
    if (time.slot === "day_wide") continue
    board[time.slot].start_time = time.start_time
    board[time.slot].end_time = time.end_time
  }

  return {
    ...row,
    activities: board,
  }
}

export function useFetchTemplateDetail(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => fetchTemplateDetail(id),
    enabled: !!id,
  })
}
