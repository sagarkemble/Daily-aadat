import type { QueryClient } from "@tanstack/react-query"

import { dayPlanQueryKey } from "@/lib/query-keys"
import type { TodoState } from "@/features/todos/types/todo"
import type { DayPlanActivity, DayPlanWithActivities } from "../types/day-plan"
import { mapDayBoardItems } from "./map-day-board-items"

function snapshotDayPlans(queryClient: QueryClient) {
  return queryClient.getQueriesData<DayPlanWithActivities | null>({
    queryKey: dayPlanQueryKey,
  })
}

function restoreDayPlans(
  queryClient: QueryClient,
  snapshot: ReturnType<typeof snapshotDayPlans>
) {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data)
  }
}

function patchDayPlanItem(
  queryClient: QueryClient,
  activityId: string,
  next: DayPlanActivity
) {
  queryClient.setQueriesData<DayPlanWithActivities | null>(
    { queryKey: dayPlanQueryKey },
    (plan) => {
      if (!plan) return plan
      let found = false
      const activities = mapDayBoardItems(plan.activities, (item) => {
        if (item.id !== activityId) return item
        found = true
        return next
      })
      if (!found) return plan
      return { ...plan, activities }
    }
  )
}

function patchDayPlanTodoState(
  queryClient: QueryClient,
  todoId: string,
  state: TodoState
) {
  queryClient.setQueriesData<DayPlanWithActivities | null>(
    { queryKey: dayPlanQueryKey },
    (plan) => {
      if (!plan) return plan
      let found = false
      const activities = mapDayBoardItems(plan.activities, (item) => {
        if (item.todo_id !== todoId) return item
        found = true
        return { ...item, state }
      })
      if (!found) return plan
      return { ...plan, activities }
    }
  )
}

export {
  snapshotDayPlans,
  restoreDayPlans,
  patchDayPlanItem,
  patchDayPlanTodoState,
}
