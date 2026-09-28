import React from "react"
import { useFetchDayPlan } from "../hooks/use-fetch-day-plan"
import { DayPageHeader } from "./day-page-header"

type DayPageProps = {
  date: string
}

const DayPage = ({ date }: DayPageProps) => {
  const { data, isLoading, error } = useFetchDayPlan(date)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div>
      <DayPageHeader date={date} />
    </div>
  )
}

export { DayPage }
