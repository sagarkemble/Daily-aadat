import type { Slot } from "@/features/templates/types/slots"
import type { ActivityWithConfiguration } from "../components/activity-picker/activity-picker-configure-row"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import type { NewDayPlanActivity } from "../types/day-plan"

async function addActivities(activities: NewDayPlanActivity[]) {
  const { error } = await supabase.from("day_items").insert(activities)
  if (error) throw error
}
export function useAddActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
