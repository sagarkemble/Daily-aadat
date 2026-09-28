import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import CalendarPopover from "./calendar-popover"
import { format } from "date-fns"

type DayPageHeaderProps = {
  date: string
}

const DayPageHeader = ({ date }: DayPageHeaderProps) => {
  const navigate = useNavigate()
  function handleDateChange(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd")
    navigate({
      to: "/",
      search: { date: formattedDate },
    })
  }
  return (
    <div className="date-navigator">
      <Button variant="outline" size="icon">
        <ArrowLeftIcon className="h-4 w-4" />
      </Button>
      <CalendarPopover date={date} onDateChange={handleDateChange} />
      <Button variant="outline" size="icon">
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export { DayPageHeader }
