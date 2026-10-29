import { CalendarDaysIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function DayEmptyState() {
  return (
    <Empty className="min-h-72 border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDaysIcon />
        </EmptyMedia>
        <EmptyTitle>Nothing on this day</EmptyTitle>
        <EmptyDescription>
          Start by adding an activity or todo, or choose a template above.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export { DayEmptyState }
