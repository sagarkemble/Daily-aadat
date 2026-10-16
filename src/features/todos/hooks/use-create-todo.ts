import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { supabase } from "@/lib/supabase"
import type { CreateTodoInput } from "../types/create-todo-input"
import type { Todo } from "../types/todo"

async function createTodo(input: CreateTodoInput) {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { data, error } = await supabase
    .from("todos")
    .insert({
      name: input.name,
      icon: input.icon,
      state: "pending",
      user_id: user.id,
    })
    .select("id, name, icon, state, created_at, updated_at")
    .single()

  if (error) throw error
  return { ...data, assignment: null } as Todo
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
