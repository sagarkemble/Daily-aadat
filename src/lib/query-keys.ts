export const todosQueryKey = ["todos"] as const

export const dayPlanQueryKey = ["day-plan"] as const

export function dayPlanByDateQueryKey(date: string) {
  return ["day-plan", date] as const
}

export const syncMutationKey = ["sync"] as const

export const todoStateMutationKey = ["sync", "todo-state"] as const

export const dayItemCommandMutationKey = ["sync", "day-item"] as const

export const progressQueryKey = ["progress"] as const

export function progressByRangeQueryKey(start: string, end: string) {
  return ["progress", start, end] as const
}

export const profileQueryKey = ["profile"] as const
