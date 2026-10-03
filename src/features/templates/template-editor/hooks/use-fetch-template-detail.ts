import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type {
  TemplateActivitiesBySlot,
  TemplateActivity,
  TemplateDetail,
  fetchedTemplateDetail,
} from "../../types/template"
import { SLOTS, type Slot } from "../../types/slots"

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
        created_at,
        updated_at,
        activity:activities (
          id,
          user_id,
          name,
          icon,
          suggested_type,
          suggested_target,
          suggested_unit,
          source
        )
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error

  const row = data as unknown as fetchedTemplateDetail
  console.log("data", data)

  const activitiesBySlot: TemplateActivitiesBySlot = {
    early_morning: [],
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  }

  row.activities.forEach((activity) => {
    activitiesBySlot[activity.slot].push(activity)
  })

  for (const slot of SLOTS) {
    activitiesBySlot[slot].sort((a, b) => a.sort_order - b.sort_order)
  }
  return {
    ...row,
    activities: activitiesBySlot, // overrides the activities with the sorted activities
  } as TemplateDetail
}

export function useFetchTemplateDetail(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => fetchTemplateDetail(id),
    enabled: !!id,
  })
}
