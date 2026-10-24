import { QuoteIcon, TargetIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { quoteForDate } from "../lib/quotes"
import { DayPlanActions } from "./day-plan-actions"

type DayRailProps = {
  date: string
  isPlanned: boolean
  editing: boolean
  onEditingChange: (editing: boolean) => void
}

function DayRail({ date, isPlanned, editing, onEditingChange }: DayRailProps) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 lg:flex">
      <DayPlanActions
        date={date}
        isPlanned={isPlanned}
        editing={editing}
        onEditingChange={onEditingChange}
      />
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="size-4" />
            Today&apos;s focus
          </CardTitle>
          <CardDescription>Stay consistent</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pick the next slot. Finish it. Then the next.
          </p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuoteIcon className="size-4" />
            Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{quoteForDate(date)}</p>
        </CardContent>
      </Card>
    </aside>
  )
}

export { DayRail }
