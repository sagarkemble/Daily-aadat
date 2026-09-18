import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type {
  TemplateDetail,
  TemplateItem,
  TemplateItemActivity,
} from "../types/template"
import type { Slot } from "../types/slots"
import type { ActivityType } from "@/features/activity/types/activity"

type RawActivity = TemplateItemActivity | TemplateItemActivity[] | null

type RawTemplateItem = {
  id: string
  template_id: string
  activity_id: string
  type: ActivityType
  target: number | null
  unit: string | null
  slot: Slot
  sort_order: number
  created_at: string
  updated_at: string
  activities: RawActivity
}

type RawTemplateRow = {
  id: string
  user_id: string
  name: string
  icon: string
  description: string
  created_at: string
  updated_at: string
  template_items: RawTemplateItem[] | null
}

function normalizeActivity(activities: RawActivity): TemplateItemActivity {
  if (Array.isArray(activities)) {
    return (
      activities[0] ?? {
        id: "",
        name: "Unknown activity",
        icon: "circle-dashed",
        suggested_type: "check",
        suggested_target: null,
        suggested_unit: null,
      }
    )
  }
  return (
    activities ?? {
      id: "",
      name: "Unknown activity",
      icon: "circle-dashed",
      suggested_type: "check",
      suggested_target: null,
      suggested_unit: null,
    }
  )
}

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

  const row = data as unknown as RawTemplateRow
  const items: TemplateItem[] = [...(row.template_items ?? [])]
    .map((item) => ({
      ...item,
      activities: normalizeActivity(item.activities),
    }))
    .sort((a, b) => a.sort_order - b.sort_order)

  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    icon: row.icon,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items,
  }
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
  })
}
