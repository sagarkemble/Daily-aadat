import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ActivityType } from "@/features/activity/types/activity"
import type { Slot } from "../types/slots"
import type { TemplateItem } from "../types/template"

export type AddTemplateItemInput = {
  template_id: string
  activity_id: string
  type: ActivityType
  target: number | null
  unit: string | null
  slot: Slot
  sort_order: number
}

async function addTemplateItem(input: AddTemplateItemInput) {
  const { data, error } = await supabase
    .from("template_items")
    .insert({
      template_id: input.template_id,
      activity_id: input.activity_id,
      type: input.type,
      target: input.target,
      unit: input.unit,
      slot: input.slot,
      sort_order: input.sort_order,
    })
    .select(
      `
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
    `
    )
    .single()

  if (error) {
    if (error.code === "23505") {
      throw new Error("That activity is already in this slot")
    }
    throw error
  }

  // Invalidate refreshes the editor; return value is unused.
  return data as unknown as TemplateItem
}

export function useAddTemplateItem(templateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addTemplateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", templateId] })
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
