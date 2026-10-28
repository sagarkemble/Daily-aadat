import { dayCompletion } from "../lib/day-completion"
import { quoteForDate } from "../lib/quotes"
import type { DayBoard } from "../types/day-plan"
import { DayProgressRing } from "./day-progress-ring"
import { DayQuoteCard } from "./day-quote-card"

type DayRailProps = {
  date: string
  board?: DayBoard
  isLoading?: boolean
}

function DayRail({ date, board, isLoading }: DayRailProps) {
  return (
    <aside className="hidden w-48 shrink-0 flex-col gap-3 lg:flex">
      <DayProgressRing
        completion={dayCompletion(board)}
        isLoading={isLoading}
      />
      <DayQuoteCard quote={quoteForDate(date)} />
    </aside>
  )
}

export { DayRail }
