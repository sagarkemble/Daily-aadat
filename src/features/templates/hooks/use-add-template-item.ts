import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ActivityPlacement } from "@/features/activity/components/activity-picker-sheet"
import type { Slot } from "../types/slots"

export type AddTemplateItemsInput = {
  template_id: string
  slot: Slot
  sort_order_start: number
  placements: ActivityPlacement[]
}

async function addTemplateItems({
  template_id,
  slot,
  sort_order_start,
  placements,
}: AddTemplateItemsInput) {
  if (placements.length === 0) return

  const { error } = await supabase.from("template_items").insert(
    placements.map((placement, index) => ({
      template_id,
      activity_id: placement.activity_id,
      type: placement.type,
      target: placement.target,
      unit: placement.unit,
      slot,
      sort_order: sort_order_start + index,
    }))
  )

  if (error) {
    if (error.code === "23505") {
      throw new Error("That activity is already in this slot")
    }
    throw error
  }
}

export function useAddTemplateItem(templateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addTemplateItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", templateId] })
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
