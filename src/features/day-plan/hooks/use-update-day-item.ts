import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import type { ActivityType } from "@/features/activity/types/activity"
import type { Slot } from "@/features/templates/types/slots"
import type { State } from "../types/day-plan"

type DayItemPatch = {
  note_snapshot?: string | null
  type?: ActivityType
  target?: number | null
  unit?: string | null
  slot?: Slot
  sort_order?: number
  state?: State
  count_value?: number | null
  duration_ms?: number | null
  started_at?: string | null
  stopped_at?: string | null
}

async function updateDayItem({ id, patch }: { id: string; patch: DayItemPatch }) {
  const { error } = await supabase.from("day_items").update(patch).eq("id", id)
  if (error) throw error
}

export function useUpdateDayItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateDayItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}

export type { DayItemPatch }
