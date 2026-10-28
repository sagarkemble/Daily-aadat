import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ActivityType } from "@/features/activity/types/activity"
import { supabase } from "@/lib/supabase"

async function updateTemplateItem({
  id,
  note,
  type,
  target,
  unit,
}: {
  id: string
  note: string | null
  type: ActivityType
  target: number | null
  unit: string | null
}) {
  const { error } = await supabase
    .from("template_items")
    .update({ note, type, target, unit })
    .eq("id", id)
  if (error) throw error
}

export function useUpdateTemplateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTemplateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
