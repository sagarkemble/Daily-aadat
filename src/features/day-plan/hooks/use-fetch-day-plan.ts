import { supabase } from "@/lib/supabase"
import { SLOTS } from "@/features/templates/types/slots"
import { useQuery } from "@tanstack/react-query"
import type { TodoState } from "@/features/todos/types/todo"
import type {
  DayBoard,
  DayPlanActivity,
  DayPlanWithActivities,
  DaySlotTime,
  FetchedDayPlan,
} from "../types/day-plan"

type FetchedDayItem = DayPlanActivity & {
  todos: { state: TodoState; note: string | null } | null
}

function toDayPlanActivity(row: FetchedDayItem): DayPlanActivity {
  const { todos, ...item } = row
  return {
    ...item,
    state: item.kind === "todo" && todos?.state ? todos.state : item.state,
    note_snapshot:
      item.kind === "todo" ? (todos?.note ?? null) : item.note_snapshot,
  }
}

function emptyDayBoard(): DayBoard {
  return Object.fromEntries(
    SLOTS.map((slot) => [
      slot,
      {
        start_time: null,
        end_time: null,
        activities: [] as DayPlanActivity[],
      },
    ])
  ) as DayBoard
}

function groupActivitiesBySlot(
  activities: DayPlanActivity[],
  slotTimes: DaySlotTime[] | null | undefined
): DayBoard {
  const board = emptyDayBoard()

  for (const activity of activities) {
    board[activity.slot]?.activities.push({
      ...activity,
    })
  }

  for (const slot of SLOTS) {
    board[slot].activities.sort((a, b) => a.slot_order - b.slot_order)
  }

  for (const time of slotTimes ?? []) {
    if (time.slot === "day_wide") continue
    board[time.slot].start_time = time.start_time
    board[time.slot].end_time = time.end_time
  }

  return board
}

async function fetchDayPlan(
  date: string
): Promise<DayPlanWithActivities | null> {
  const { data, error } = await supabase
    .from("day_plans")
    .select(
      `
      id,
      plan_date,
      template_id,
      created_at,
      updated_at,
      activities:day_items(
        id,
        day_plan_id,
        kind,
        activity_id,
        todo_id,
        name_snapshot,
        icon_snapshot,
        type,
        target,
        unit,
        slot,
        slot_order:sort_order,
        state,
        started_at,
        stopped_at,
        duration:duration_ms,
        count_value,
        created_at,
        updated_at,
        note_snapshot,
        todos (
          state,
          note
        )
      ),
      slot_times:day_plan_slot_times(
        slot,
        start_time,
        end_time
      )
    `
    )
    .eq("plan_date", date)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const row = data as unknown as FetchedDayPlan & {
    activities: FetchedDayItem[]
  }

  return {
    ...row,
    activities: groupActivitiesBySlot(
      row.activities.map(toDayPlanActivity),
      row.slot_times
    ),
  }
}

function useFetchDayPlan(date: string) {
  return useQuery({
    queryKey: ["day-plan", date],
    queryFn: () => fetchDayPlan(date),
  })
}

export { useFetchDayPlan }
