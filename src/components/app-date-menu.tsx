import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function AppDateMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const today = new Date()

  function handleDateChange(date: Date | undefined) {
    if (!date) {
      return
    }
    setOpen(false)
    navigate({
      to: "/",
      search: { date: format(date, "yyyy-MM-dd") },
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" className="h-12 gap-3 rounded-full px-1 pr-3" />
        }
      >
        <span className="flex size-10 items-center justify-center rounded-full border bg-card">
          <CalendarIcon />
        </span>
        <span className="font-heading text-xl font-semibold tracking-tight">
          {format(today, "EEEE, MMMM d, yyyy")}
        </span>
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={today}
          onSelect={handleDateChange}
          captionLayout="dropdown"
          required
        />
      </PopoverContent>
    </Popover>
  )
}

export { AppDateMenu }
