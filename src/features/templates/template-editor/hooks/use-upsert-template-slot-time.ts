import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import type { TimedSlot } from "../../types/slots"

export type UpsertTemplateSlotTimeInput = {
  template_id: string
  slot: TimedSlot
  start_time: string | null
  end_time: string | null
}

async function upsertTemplateSlotTime({
  template_id,
  slot,
  start_time,
  end_time,
}: UpsertTemplateSlotTimeInput) {
  const bothEmpty = start_time === null && end_time === null
  const bothSet = start_time !== null && end_time !== null
  if (!bothEmpty && !bothSet) {
    throw new Error("Start and end must both be set, or both empty.")
  }

  if (bothEmpty) {
    const { error } = await supabase
      .from("template_slot_times")
      .delete()
      .eq("template_id", template_id)
      .eq("slot", slot)
    if (error) throw error
    return
  }

  const { error } = await supabase.from("template_slot_times").upsert(
    {
      template_id,
      slot,
      start_time,
      end_time,
    },
    { onConflict: "template_id,slot" }
  )
  if (error) throw error
}

export function useUpsertTemplateSlotTime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertTemplateSlotTime,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["templates", variables.template_id],
      })
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
