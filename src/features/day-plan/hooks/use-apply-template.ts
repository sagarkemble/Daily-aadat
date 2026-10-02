import { useAuthStore } from "@/features/auth/stores/auth-store"
import {
  fetchTemplateDetail,
  useFetchTemplateDetail,
} from "@/features/templates/hooks/use-fetch-template-detail"
import type {
  Template,
  TemplateDetail,
} from "@/features/templates/types/template"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function applyTemplate({
  template_id,
  date,
}: {
  template_id: string
  date: string
}) {
  let template: TemplateDetail | null = null
  try {
    template = await fetchTemplateDetail(template_id)
  } catch (error) {
    throw error
  }
  const userId = useAuthStore.getState().user?.id
  const { data, error } = await supabase
    .from("day_plans")
    .insert({
      plan_date: date,
      template_id: template_id,
      user_id: userId,
    })
    .select()
    .single()
  if (error) {
    throw error
  }

  const templateItems = Object.values(template.activities).flat()

  const dayItems = templateItems.map((item) => {
    if (!item.activity) {
      throw new Error(`Activity missing for template item ${item.id}`)
    }

    return {
      day_plan_id: data.id, // from the day_plans insert you just did
      kind: "activity",
      activity_id: item.activity_id,
      name_snapshot: item.activity.name,
      icon_snapshot: item.activity.icon,
      type: item.type, // from the template item, not suggested_type
      target: item.target,
      unit: item.unit,
      slot: item.slot,
      sort_order: item.sort_order,
      state: "pending",
      note_snapshot: null,
    }
  })

  const { error: insertError } = await supabase
    .from("day_items")
    .insert(dayItems)

  if (insertError) throw insertError
}

export function useApplyTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
