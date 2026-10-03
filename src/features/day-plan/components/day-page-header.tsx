import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import SelectTemplateDialog from "@/features/day-plan/components/select-template-dialog"
import CalendarPopover from "./calendar-popover"
import { addDays, format, subDays } from "date-fns"
import { useUnplanDay } from "../hooks/use-unplan-day"
import { useEndDay } from "../hooks/use-end-day"

type DayPageHeaderProps = {
  date: string
  isPlanned: boolean
}

const DayPageHeader = ({ date, isPlanned }: DayPageHeaderProps) => {
  const navigate = useNavigate()
  const { mutate: unplanDay, isPending } = useUnplanDay()
  function handleDateChange(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd")
    navigate({
      to: "/",
      search: { date: formattedDate },
    })
  }
  const { mutate: endDay, isPending: isEnding } = useEndDay()
  function handleEndDay() {
    endDay(date)
  }
  function handlePreviousDay() {
    const previousDate = subDays(date, 1)
    const formattedDate = format(previousDate, "yyyy-MM-dd")
    navigate({
      to: "/",
      search: { date: formattedDate },
    })
  }
  function handleNextDay() {
    const nextDate = addDays(date, 1)
    const formattedDate = format(nextDate, "yyyy-MM-dd")
    navigate({
      to: "/",
      search: { date: formattedDate },
    })
  }
  function handleUnplanDay() {
    unplanDay(date)
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="date-navigator">
        <Button variant="outline" size="icon" onClick={handlePreviousDay}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <CalendarPopover date={date} onDateChange={handleDateChange} />
        <Button variant="outline" size="icon" onClick={handleNextDay}>
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
      {isPlanned ? (
        <>
          <Button variant="outline" onClick={handleUnplanDay}>
            Unplan Day
          </Button>
          <Button variant="outline" onClick={handleEndDay}>
            End Day
          </Button>
        </>
      ) : (
        <SelectTemplateDialog date={date} />
      )}
    </div>
  )
}

export { DayPageHeader }
