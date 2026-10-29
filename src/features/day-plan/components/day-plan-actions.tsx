import { useMemo, useState } from "react"
import {
  ChevronDownIcon,
  ListIcon,
  ListTodoIcon,
  PlusIcon,
  Undo2Icon,
} from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useFetchTemplates } from "@/features/templates/hooks/use-fetch-templates"
import SelectTemplateDialog from "@/features/day-plan/components/select-template-dialog"
import {
  useUnplanDay,
  type UnplanDayMode,
} from "../hooks/use-unplan-day"

type DayPlanActionsProps = {
  date: string
  hasDayPlanRow: boolean
  templateId?: string | null
  plannedCount: number
  todoCountOnDay: number
  activityCountOnDay: number
  onAddActivity?: () => void
  isAddingActivity?: boolean
  onAddTodo?: () => void
}

function DayPlanActions({
  date,
  hasDayPlanRow,
  templateId,
  plannedCount,
  todoCountOnDay,
  activityCountOnDay,
  onAddActivity,
  isAddingActivity = false,
  onAddTodo,
}: DayPlanActionsProps) {
  const { mutateAsync: unplanDay, isPending } = useUnplanDay()
  const { data: templates } = useFetchTemplates()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const appliedTemplateName = useMemo(() => {
    if (!templateId) return null
    return templates?.find((template) => template.id === templateId)?.name ?? null
  }, [templateId, templates])

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
  const plannedLabel =
    plannedCount === 1 ? "1 task planned" : `${plannedCount} tasks planned`
  const canAdd = Boolean(onAddActivity || onAddTodo)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <SelectTemplateDialog
          date={date}
          hasActivitiesOnDay={activityCountOnDay > 0}
          appliedTemplateName={appliedTemplateName}
        />
        <p className="text-sm text-muted-foreground">{plannedLabel}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {canAdd ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="lg"
                  className="rounded-full"
                  disabled={isAddingActivity}
                />
              }
            >
              <PlusIcon data-icon="inline-start" />
              Add
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {onAddActivity ? (
                  <DropdownMenuItem
                    disabled={isAddingActivity}
                    onClick={onAddActivity}
                  >
                    <ListIcon />
                    Activity
                  </DropdownMenuItem>
                ) : null}
                {onAddTodo ? (
                  <DropdownMenuItem onClick={onAddTodo}>
                    <ListTodoIcon />
                    Todo
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {hasDayPlanRow ? (
          <AlertDialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  disabled={isPending}
                />
              }
            >
              Clear day
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Undo2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Clear this day?</AlertDialogTitle>
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
                        Clearing…
                      </>
                    ) : (
                      "Yes, clear day"
                    )}
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  )
}

export { DayPlanActions }
