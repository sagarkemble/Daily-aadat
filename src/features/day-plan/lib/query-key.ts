export function dayPlanQueryKey(userId: string, planDate: string) {
  return ["day-plan", userId, planDate] as const
}
