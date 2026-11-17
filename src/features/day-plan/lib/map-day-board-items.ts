import { SLOTS } from "@/features/templates/types/slots"
import type { DayBoard, DayPlanActivity } from "../types/day-plan"

function mapDayBoardItems(
  board: DayBoard,
  mapper: (item: DayPlanActivity) => DayPlanActivity
): DayBoard {
  return Object.fromEntries(
    SLOTS.map((slot) => [
      slot,
      {
        ...board[slot],
        activities: board[slot].activities.map(mapper),
      },
    ])
  ) as DayBoard
}

export { mapDayBoardItems }
