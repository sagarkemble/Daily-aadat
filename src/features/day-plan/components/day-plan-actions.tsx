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
import { AppDateMenu } from "@/components/app-date-menu"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useFetchTemplates } from "@/features/templates/hooks/use-fetch-templates"
import SelectTemplateDialog from "@/features/day-plan/components/select-template-dialog"
import { useUnplanDay, type UnplanDayMode } from "../hooks/use-unplan-day"

type DayPlanActionsProps = {
  date: string
  hasDayPlanRow: boolean
  templateId?: string | null
  plannedCount: number
  doneCount: number
  todoCountOnDay: number
  activityCountOnDay: number
  onAddActivity?: () => void
  isAddingActivity?: boolean
  onAddTodo?: () => void
  isLoading?: boolean
}

function DayPlanActions({
  date,
  hasDayPlanRow,
  templateId,
  plannedCount,
  doneCount,
  todoCountOnDay,
  activityCountOnDay,
  onAddActivity,
  isAddingActivity = false,
  onAddTodo,
  isLoading = false,
}: DayPlanActionsProps) {
  const { mutateAsync: unplanDay, isPending } = useUnplanDay()
  const { data: templates, isLoading: isLoadingTemplates } =
    useFetchTemplates()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const appliedTemplateName = useMemo(() => {
    if (!templateId) return null
    return (
      templates?.find((template) => template.id === templateId)?.name ?? null
    )
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
    plannedCount === 0
      ? "Nothing planned yet"
      : `${doneCount} of ${plannedCount} done`
  const canAdd = Boolean(onAddActivity || onAddTodo)

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      {canAdd ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button disabled={isAddingActivity} />}>
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
            render={<Button variant="outline" disabled={isPending} />}
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
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="md:hidden">
        <AppDateMenu size="compact" />
      </div>
      <PageHeader actions={actions}>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {isLoading || (templateId && isLoadingTemplates) ? (
            <>
              <Skeleton className="h-9 w-40 rounded-md" />
              <Skeleton className="h-4 w-20" />
            </>
          ) : (
            <>
              <SelectTemplateDialog
                date={date}
                hasActivitiesOnDay={activityCountOnDay > 0}
                appliedTemplateName={appliedTemplateName}
              />
              <p className="text-sm text-muted-foreground tabular-nums">
                {plannedLabel}
              </p>
            </>
          )}
        </div>
      </PageHeader>
    </div>
  )
}

export { DayPlanActions }
