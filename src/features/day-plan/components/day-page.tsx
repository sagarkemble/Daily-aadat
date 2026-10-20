import { useEffect, useState } from "react"

import { SLOTS } from "@/features/templates/types/slots"
import { useFetchDayPlan } from "../hooks/use-fetch-day-plan"
import { DayPlanActions } from "./day-plan-actions"
import DaySlot from "./day-slot"
import { DayRail } from "./day-rail"

type DayPageProps = {
  date: string
}

const DayPage = ({ date }: DayPageProps) => {
  const { data, isLoading, error } = useFetchDayPlan(date)
  const [editing, setEditing] = useState(false)
  const isPlanned = data != null

  useEffect(() => {
    if (!isPlanned) {
      setEditing(false)
    }
  }, [isPlanned])

  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="lg:hidden">
          <DayPlanActions
            date={date}
            isPlanned={isPlanned}
            editing={editing}
            onEditingChange={setEditing}
          />
        </div>
        {SLOTS.map((slot) => (
          <DaySlot
            key={slot}
            slot={slot}
            activities={data?.activities[slot] || []}
            dayPlanId={data?.id || ""}
            isLoading={isLoading}
            editing={editing}
          />
        ))}
      </div>
      <DayRail
        date={date}
        isPlanned={isPlanned}
        editing={editing}
        onEditingChange={setEditing}
      />
    </div>
  )
}

export { DayPage }
