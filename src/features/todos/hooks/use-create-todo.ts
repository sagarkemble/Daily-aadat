import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { supabase } from "@/lib/supabase"
import type { CreateTodoInput } from "../types/create-todo-input"

const DEFAULT_TODO_ICON = "list-todo"

async function createTodo(input: CreateTodoInput) {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { error } = await supabase.from("todos").insert({
    name: input.name,
    icon: DEFAULT_TODO_ICON,
    state: "pending",
    user_id: user.id,
  })

  if (error) throw error
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
