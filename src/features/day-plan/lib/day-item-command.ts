import type { DayPlanActivity, State } from "../types/day-plan"

export type DayItemCommand =
  | { type: "toggle_check" }
  | { type: "start" }
  | { type: "stop" }
  | { type: "reset" }
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "skip" }
  | { type: "unskip" }

export function applyDayItemCommand(
  item: DayPlanActivity,
  command: DayItemCommand,
  now = new Date()
): DayPlanActivity {
  if (item.state === "skipped" && command.type !== "unskip") {
    throw new Error("Unskip before working this item")
  }

  switch (command.type) {
    case "toggle_check":
      return toggleCheck(item)
    case "start":
      return startTimed(item, now)
    case "stop":
      return stopTimed(item, now)
    case "reset":
      return resetTimed(item)
    case "increment":
      return bumpCount(item, 1)
    case "decrement":
      return bumpCount(item, -1)
    case "skip":
      return skip(item, now)
    case "unskip":
      return { ...item, state: "pending" }
  }
}

function toggleCheck(item: DayPlanActivity): DayPlanActivity {
  assertType(item, "check")
  const next: State = item.state === "done" ? "pending" : "done"
  return { ...item, state: next }
}

function startTimed(item: DayPlanActivity, now: Date): DayPlanActivity {
  assertType(item, "timed")
  if (item.state === "running") return item
  return {
    ...item,
    state: "running",
    started_at: now.toISOString(),
    stopped_at: null,
  }
}

function stopTimed(item: DayPlanActivity, now: Date): DayPlanActivity {
  assertType(item, "timed")
  if (item.state !== "running" || !item.started_at) return item
  const elapsed = now.getTime() - new Date(item.started_at).getTime()
  return {
    ...item,
    state: "pending",
    started_at: null,
    stopped_at: now.toISOString(),
    duration: (item.duration ?? 0) + elapsed,
  }
}

function resetTimed(item: DayPlanActivity): DayPlanActivity {
  assertType(item, "timed")
  return {
    ...item,
    state: "pending",
    started_at: null,
    stopped_at: null,
    duration: 0,
  }
}

function bumpCount(item: DayPlanActivity, delta: number): DayPlanActivity {
  assertType(item, "count")
  const nextValue = Math.max(0, (item.count_value ?? 0) + delta)
  const reachedTarget = item.target != null && nextValue >= item.target
  return {
    ...item,
    count_value: nextValue,
    state: reachedTarget ? "done" : "pending",
  }
}

function skip(item: DayPlanActivity, now: Date): DayPlanActivity {
  const stopped =
    item.type === "timed" && item.state === "running"
      ? stopTimed(item, now)
      : item
  return { ...stopped, state: "skipped" }
}

function assertType(item: DayPlanActivity, type: DayPlanActivity["type"]) {
  if (item.type !== type) {
    throw new Error(`${type} command on a ${item.type} item`)
  }
}
