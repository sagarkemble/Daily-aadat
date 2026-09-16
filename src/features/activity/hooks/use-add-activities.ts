import { supabase } from "@/lib/supabase"
import type { Activity } from "../types/activity"
import type { AddActivityInput } from "../types/add-activity-input"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function addActivity(input: AddActivityInput) {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { data, error } = await supabase
    .from("activities")
    .insert({
      name: input.name,
      icon: input.icon,
      suggested_type: input.suggested_type,
      suggested_target: input.suggested_target
        ? Number(input.suggested_target)
        : null,
      suggested_unit: input.suggested_unit || null,
      note: input.note || null,
      source: "custom",
      user_id: user.id,
    })
    .select(
      "id, name, icon, suggested_type, suggested_target, suggested_unit, note, source, user_id"
    )
    .single()

  if (error) {
    if (error.code === "23505") throw new Error("Activity already exists")
    throw error
  }
  return data as Activity
}

export function useAddActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  })
}
