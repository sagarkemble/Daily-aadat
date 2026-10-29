import { TODO_ICON } from "@/features/todos/lib/todo-icon"
import type { DayPlanActivity } from "../types/day-plan"

function placementIconName(activity: DayPlanActivity): string | null {
  if (activity.kind === "todo") return TODO_ICON
  return activity.icon_snapshot
}

export { placementIconName }
