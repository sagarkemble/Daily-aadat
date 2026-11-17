import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import {
  dayPlanQueryKey,
  todoStateMutationKey,
  todosQueryKey,
} from "@/lib/query-keys"
import { assertOnline } from "@/features/sync/lib/assert-online"
import { getErrorMessage } from "@/features/sync/lib/get-error-message"
import {
  isCurrentSyncGeneration,
  nextSyncGeneration,
} from "@/features/sync/lib/sync-generation"
import { useSyncStore } from "@/features/sync/stores/sync-store"
import {
  patchDayPlanTodoState,
  restoreDayPlans,
  snapshotDayPlans,
} from "@/features/day-plan/lib/patch-day-plan-cache"
import type { TodoState } from "../types/todo"
import {
  patchTodoState,
  restoreTodos,
  snapshotTodos,
} from "../lib/patch-todos-cache"

async function changeTodoState({
  id,
  state,
}: {
  id: string
  state: TodoState
}) {
  assertOnline()
  const { data, error } = await supabase
    .from("todos")
    .update({ state })
    .eq("id", id)
  if (error) throw error
  return data
}

export function useChangeTodoState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: todoStateMutationKey,
    mutationFn: changeTodoState,
    networkMode: "always",
    retry: 0,
    onMutate: async ({ id, state }) => {
      useSyncStore.getState().clearError()
      const generation = nextSyncGeneration(id)
      const cancel = Promise.all([
        queryClient.cancelQueries({ queryKey: todosQueryKey }),
        queryClient.cancelQueries({ queryKey: dayPlanQueryKey }),
      ])
      const previousTodos = snapshotTodos(queryClient)
      const previousDayPlans = snapshotDayPlans(queryClient)
      patchTodoState(queryClient, id, state)
      patchDayPlanTodoState(queryClient, id, state)
      await cancel
      return { previousTodos, previousDayPlans, generation, entityId: id }
    },
    onError: (error, _variables, context) => {
      if (
        !context ||
        !isCurrentSyncGeneration(context.entityId, context.generation)
      ) {
        return
      }
      restoreTodos(queryClient, context.previousTodos)
      restoreDayPlans(queryClient, context.previousDayPlans)
      useSyncStore.getState().markError(getErrorMessage(error))
    },
    onSuccess: (_data, _variables, context) => {
      if (
        !context ||
        !isCurrentSyncGeneration(context.entityId, context.generation)
      ) {
        return
      }
      useSyncStore.getState().markSaved()
    },
  })
}
