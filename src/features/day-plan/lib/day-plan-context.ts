import { createContext, useContext } from "react"

import type { DayBoard } from "../types/day-plan"

type DayPlanContextValue = {
  date: string
  board: DayBoard | undefined
}

const DayPlanContext = createContext<DayPlanContextValue | null>(null)

function useDayPlanContext() {
  const value = useContext(DayPlanContext)
  if (!value) {
    throw new Error("useDayPlanContext must be used inside DayPlanContext")
  }
  return value
}

export { DayPlanContext, useDayPlanContext }
export type { DayPlanContextValue }
