import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeftIcon, ArrowRightIcon, Undo2Icon } from "lucide-react"
import SelectTemplateDialog from "@/features/day-plan/components/select-template-dialog"
import CalendarPopover from "./calendar-popover"
import { addDays, format, subDays } from "date-fns"
import { useUnplanDay } from "../hooks/use-unplan-day"
import { useEndDay } from "../hooks/use-end-day"
import { toast } from "@/components/ui/toast"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type DayPageHeaderProps = {
  date: string
  isPlanned: boolean
}

const DayPageHeader = ({ date, isPlanned }: DayPageHeaderProps) => {
  const navigate = useNavigate()
  const { mutateAsync: unplanDay, isPending } = useUnplanDay()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isPending) return
    setConfirmOpen(nextOpen)
  }
  function handleDateChange(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd")
    navigate({
      to: "/",
      search: { date: formattedDate },
    })
  }
  const { mutate: endDay } = useEndDay()
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
    toast
      .promise(unplanDay(date), {
        loading: "Unplanning day...",
        success: "Day unplanned",
        error: "Could not unplan day",
      })
      .then(() => setConfirmOpen(false))
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
          <AlertDialog
            open={confirmOpen}
            onOpenChange={handleConfirmOpenChange}
          >
            <AlertDialogTrigger
              render={<Button variant="outline" />}
              disabled={isPending}
            >
              Unplan Day
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Undo2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Unplan this day?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the plan for this date. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>No</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isPending}
                  onClick={(event) => {
                    event.preventDefault()
                    handleUnplanDay()
                  }}
                >
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Unplanning…
                    </>
                  ) : (
                    "Yes, unplan"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <SelectTemplateDialog date={date} />
      )}
    </div>
  )
}

export { DayPageHeader }
