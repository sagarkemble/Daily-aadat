import { useState } from "react"
import { PencilIcon, Undo2Icon } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Toggle } from "@/components/ui/toggle"
import { toast } from "@/components/ui/toast"
import SelectTemplateDialog from "@/features/day-plan/components/select-template-dialog"
import { useUnplanDay } from "../hooks/use-unplan-day"

type DayPlanActionsProps = {
  date: string
  isPlanned: boolean
  editing: boolean
  onEditingChange: (editing: boolean) => void
}

function DayPlanActions({
  date,
  isPlanned,
  editing,
  onEditingChange,
}: DayPlanActionsProps) {
  const { mutateAsync: unplanDay, isPending } = useUnplanDay()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isPending) return
    setConfirmOpen(nextOpen)
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
    <div className="flex flex-wrap items-center gap-2">
      {isPlanned ? (
        <AlertDialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
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
      ) : (
        <SelectTemplateDialog date={date} />
      )}
      {isPlanned ? (
        <Toggle
          variant="outline"
          pressed={editing}
          onPressedChange={onEditingChange}
        >
          <PencilIcon />
          Edit
        </Toggle>
      ) : null}
    </div>
  )
}

export { DayPlanActions }
