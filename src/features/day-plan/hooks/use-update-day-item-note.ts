import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"

async function updateDayItemNote({
  id,
  note_snapshot,
}: {
  id: string
  note_snapshot: string | null
}) {
  const { error } = await supabase
    .from("day_items")
    .update({ note_snapshot })
    .eq("id", id)
  if (error) throw error
}

export function useUpdateDayItemNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateDayItemNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
