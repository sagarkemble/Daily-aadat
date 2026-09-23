import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { TemplateActivity, TemplateDetail } from "../types/template"

async function fetchTemplate(id: string): Promise<TemplateDetail> {
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
          note,
          source
        )
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error

  const row = data as unknown as TemplateDetail
  console.log("data", data)
  const activities: TemplateActivity[] = [...row.activities].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return {
    ...row,
    activities, // overrides the activities with the sorted activities
  }
}

export function useFetchTemplateDetail(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
  })
}
