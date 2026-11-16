import type { State } from "../types/day-plan"

const PLACEMENT_STATUS_LABELS: Record<State, string> = {
  pending: "To do",
  running: "Running",
  done: "Done",
  skipped: "Skipped",
}

const PLACEMENT_STATUS_BADGE_CLASS: Record<State, string> = {
  pending: "border-border bg-transparent text-muted-foreground",
  running: "bg-primary/15 text-primary",
  done: "bg-success/15 text-success",
  skipped: "bg-muted text-muted-foreground line-through",
}

export { PLACEMENT_STATUS_BADGE_CLASS, PLACEMENT_STATUS_LABELS }
