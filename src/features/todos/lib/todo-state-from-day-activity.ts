import type { State } from "@/features/day-plan/types/day-plan"
import type { TodoState } from "../types/todo"

function todoStateFromDayActivity(state: State): TodoState {
  return state === "done" ? "done" : "pending"
}

export { todoStateFromDayActivity }
