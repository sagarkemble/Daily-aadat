import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import type { TimedSlot } from "@/features/templates/types/slots"

export type UpsertDaySlotTimeInput = {
  day_plan_id: string
  slot: TimedSlot
  start_time: string | null
  end_time: string | null
}

async function upsertDaySlotTime({
  day_plan_id,
  slot,
  start_time,
  end_time,
}: UpsertDaySlotTimeInput) {
  const bothEmpty = start_time === null && end_time === null
  const bothSet = start_time !== null && end_time !== null
  if (!bothEmpty && !bothSet) {
    throw new Error("Start and end must both be set, or both empty.")
  }

  if (bothEmpty) {
    const { error } = await supabase
      .from("day_plan_slot_times")
      .delete()
      .eq("day_plan_id", day_plan_id)
      .eq("slot", slot)
    if (error) throw error
    return
  }

  const { error } = await supabase.from("day_plan_slot_times").upsert(
    {
      day_plan_id,
      slot,
      start_time,
      end_time,
    },
    { onConflict: "day_plan_id,slot" }
  )
  if (error) throw error
}

export function useUpsertDaySlotTime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertDaySlotTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
