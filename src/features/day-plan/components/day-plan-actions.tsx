import { useState } from "react"
import { ListIcon, ListTodoIcon, PencilIcon, Undo2Icon } from "lucide-react"

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
import {
  useUnplanDay,
  type UnplanDayMode,
} from "../hooks/use-unplan-day"

type DayPlanActionsProps = {
  date: string
  hasDayPlanRow: boolean
  todoCountOnDay: number
  activityCountOnDay: number
  editing: boolean
  onEditingChange: (editing: boolean) => void
  onAddActivity?: () => void
  isAddingActivity?: boolean
  onAddTodo?: () => void
}

function DayPlanActions({
  date,
  hasDayPlanRow,
  todoCountOnDay,
  activityCountOnDay,
  editing,
  onEditingChange,
  onAddActivity,
  isAddingActivity = false,
  onAddTodo,
}: DayPlanActionsProps) {
  const { mutateAsync: unplanDay, isPending } = useUnplanDay()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isPending) return
    setConfirmOpen(nextOpen)
  }

  function runUnplan(mode: UnplanDayMode) {
    toast
      .promise(unplanDay({ date, mode }), {
        loading: "Clearing day…",
        success: "Day cleared",
        error: "Could not clear day",
      })
      .then(() => setConfirmOpen(false))
  }

  const hasTodos = todoCountOnDay > 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SelectTemplateDialog
        date={date}
        hasActivitiesOnDay={activityCountOnDay > 0}
      />
      {hasDayPlanRow ? (
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
              <AlertDialogTitle>
                {hasTodos ? "Clear this day?" : "Unplan this day?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {hasTodos
                  ? "Activities, template, and slot times will be removed."
                  : "This removes activities, template, and slot times for this date."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              {hasTodos ? (
                <>
                  <AlertDialogAction
                    variant="outline"
                    disabled={isPending}
                    onClick={(event) => {
                      event.preventDefault()
                      runUnplan("keepTodos")
                    }}
                  >
                    {isPending ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Clearing…
                      </>
                    ) : (
                      "Keep todos here"
                    )}
                  </AlertDialogAction>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={isPending}
                    onClick={(event) => {
                      event.preventDefault()
                      runUnplan("sendToPile")
                    }}
                  >
                    Send todos to pile
                  </AlertDialogAction>
                </>
              ) : (
                <AlertDialogAction
                  variant="destructive"
                  disabled={isPending}
                  onClick={(event) => {
                    event.preventDefault()
                    runUnplan("sendToPile")
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
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      {onAddActivity ? (
        <Button
          variant="secondary"
          disabled={isAddingActivity}
          onClick={onAddActivity}
        >
          <ListIcon data-icon="inline-start" />
          Add activity
        </Button>
      ) : null}
      {onAddTodo ? (
        <Button variant="secondary" onClick={onAddTodo}>
          <ListTodoIcon data-icon="inline-start" />
          Add todo
        </Button>
      ) : null}
      <Toggle
        variant="outline"
        pressed={editing}
        onPressedChange={onEditingChange}
      >
        <PencilIcon />
        Edit
      </Toggle>
    </div>
  )
}

export { DayPlanActions }
