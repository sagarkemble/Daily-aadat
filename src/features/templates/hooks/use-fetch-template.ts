import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Template } from "../types/template"

async function fetchTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("id, user_id, name, created_at, updated_at")
    .order("name")

  if (error) throw error
  return (data ?? []) as Template[]
}

export function useFetchTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  })
}
