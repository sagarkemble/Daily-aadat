import { useMemo, useState } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type AppDateMenuProps = {
  date?: Date
  size?: "default" | "compact"
}

function AppDateMenu({ date, size = "default" }: AppDateMenuProps) {
  const compact = size === "compact"
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { pathname, searchDate } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      searchDate: (state.location.search as { date?: string }).date,
    }),
  })

  const selected = useMemo(() => {
    if (date) return date
    if (pathname === "/" && searchDate) {
      const parsed = parseISO(searchDate)
      if (isValid(parsed)) return parsed
    }
    return new Date()
  }, [date, pathname, searchDate])

  function handleDateChange(next: Date | undefined) {
    if (!next) {
      return
    }
    setOpen(false)
    navigate({
      to: "/",
      search: { date: format(next, "yyyy-MM-dd") },
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "gap-2 rounded-full px-1 pr-3",
              compact ? "h-10 -ml-1" : "h-12"
            )}
          />
        }
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full border bg-card",
            compact ? "size-8" : "size-10"
          )}
        >
          <CalendarIcon />
        </span>
        <span
          className={cn(
            "font-heading font-medium tracking-tight",
            compact ? "text-lg" : "text-xl"
          )}
        >
          {format(selected, compact ? "EEE, MMM d" : "EEEE, MMMM d, yyyy")}
        </span>
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateChange}
          captionLayout="dropdown"
          required
        />
      </PopoverContent>
    </Popover>
  )
}

export { AppDateMenu }
