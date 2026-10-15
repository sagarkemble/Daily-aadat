import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Todo } from "../types/todo"

async function fetchTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("id, name, icon, state, created_at, updated_at")
    .order("name")

  if (error) throw error
  return (data ?? []) as Todo[]
}

export function useFetchTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })
}
