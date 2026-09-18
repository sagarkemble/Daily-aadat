import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { TemplateDetail, TemplateItem } from "../types/template"

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
      template_items (
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
        activities (
          id,
          name,
          icon,
          suggested_type,
          suggested_target,
          suggested_unit
        )
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error

  const row = data as unknown as TemplateDetail
  console.log("data", data)
  const template_items: TemplateItem[] = [...row.template_items].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return {
    ...row,
    template_items, // overrides the template_items with the sorted template_items
  }
}

export function useFetchTemplateDetail(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
  })
}
