import { SLOTS } from "@/features/templates/types/slots"

import type { DayBoard } from "../types/day-plan"

export type DayCompletion = {
  done: number
  total: number
}

function dayCompletion(board: DayBoard | undefined): DayCompletion {
  if (!board) {
    return { done: 0, total: 0 }
  }

  const items = SLOTS.flatMap((slot) => board[slot]?.activities ?? [])
  const total = items.length
  const done = items.filter((item) => item.state === "done").length

  return { done, total }
}

export { dayCompletion }
