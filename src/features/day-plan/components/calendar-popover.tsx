import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type CalendarPopoverProps = {
  date: string
  onDateChange: (date: Date) => void
}

const CalendarPopover = ({ date, onDateChange }: CalendarPopoverProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline">{date}</Button>} />
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={new Date(date)}
          onSelect={onDateChange}
          captionLayout="dropdown"
          required
        />
      </PopoverContent>
    </Popover>
  )
}

export default CalendarPopover
