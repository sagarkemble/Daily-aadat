import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Activity } from "../types/activity"

async function fetchActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select(
      "id, name, icon, suggested_type, suggested_target, suggested_unit, note, source, user_id"
    )
    .is("archived_at", null)
    .order("name")

  if (error) throw error
  return data as Activity[]
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  })
}
