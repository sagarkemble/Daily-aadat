import { useId, useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { useActivities } from "@/features/activity/hooks/use-activities"
import type { Activity } from "@/features/activity/types/activity"
import { useDebounce } from "@/hooks/use-debounce"
import { useAddTemplateActivities } from "../hooks/use-add-template-activities"
import { SLOT_LABELS, type Slot } from "../types/slots"
import type { NewTemplateActivity } from "../types/template"
import { ActivityPickerRow } from "./activity-picker-row"
import {
  ConfigureActivityDialogRow,
  type ConfigureActivityValue,
} from "./configure-activity-dialog-row"

type ActivityPickerDialogProps = {
  templateId: string
  slot: Slot
  sortOrderStart: number
}

function draftFromActivity(activity: Activity): ConfigureActivityValue {
  if (activity.suggested_type !== "count") {
    return { type: activity.suggested_type, target: "", unit: "" }
  }
  return {
    type: "count",
    target: activity.suggested_target?.toString() ?? "",
    unit: activity.suggested_unit ?? "",
  }
}

function isDraftReady(draft: ConfigureActivityValue) {
  if (draft.type !== "count") return true
  const target = Number(draft.target)
  return Number.isInteger(target) && target >= 1 && draft.unit.trim().length > 0
}

function toTemplateItem(
  activity: Activity,
  draft: ConfigureActivityValue,
  templateId: string,
  slot: Slot,
  sortOrder: number
): NewTemplateActivity {
  const isCount = draft.type === "count"
  return {
    template_id: templateId,
    activity_id: activity.id,
    type: draft.type,
    target: isCount ? Number(draft.target) : null,
    unit: isCount ? draft.unit.trim() : null,
    slot,
    sort_order: sortOrder,
  }
}

const ActivityPickerDialog = ({
  templateId,
  slot,
  sortOrderStart,
}: ActivityPickerDialogProps) => {
  const searchId = useId()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity[]>([])
  const [drafts, setDrafts] = useState<Record<string, ConfigureActivityValue>>(
    {}
  )
  const [step, setStep] = useState<"select" | "configure">("select")
  const { data, isLoading, error } = useActivities()
  const { mutate: addActivities, isPending } = useAddTemplateActivities()

  const debouncedQuery = useDebounce(searchQuery, 300)
  const query = (searchQuery.trim() === "" ? "" : debouncedQuery)
    .trim()
    .toLowerCase()

  const catalog = useMemo(
    () =>
      (data ?? []).map((activity) => ({
        activity,
        name: activity.name.toLowerCase(),
      })),
    [data]
  )

  const activities = useMemo(
    () =>
      catalog
        .filter((entry) => entry.name.includes(query))
        .map((entry) => entry.activity),
    [catalog, query]
  )

  const selectedOrder = useMemo(() => {
    const order = new Map<string, number>()
    selectedActivity.forEach((activity, index) => {
      order.set(activity.id, index + 1)
    })
    return order
  }, [selectedActivity])

  const draftsReady = selectedActivity.every((activity) => {
    const draft = drafts[activity.id]
    return draft != null && isDraftReady(draft)
  })

  function reset() {
    setStep("select")
    setSearchQuery("")
    setSelectedActivity([])
    setDrafts({})
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
  }

  function handleSelectActivity(activity: Activity) {
    setSelectedActivity((current) => {
      const exists = current.some((item) => item.id === activity.id)
      if (exists) return current.filter((item) => item.id !== activity.id)
      return [...current, activity]
    })
  }

  function handleNext() {
    setDrafts((current) => {
      const next: Record<string, ConfigureActivityValue> = {}
      for (const activity of selectedActivity) {
        next[activity.id] = current[activity.id] ?? draftFromActivity(activity)
      }
      return next
    })
    setStep("configure")
  }

  function handleDone() {
    const items = selectedActivity.map((activity, index) =>
      toTemplateItem(
        activity,
        drafts[activity.id],
        templateId,
        slot,
        sortOrderStart + index
      )
    )

    addActivities(items, {
      onSuccess: () => {
        toast.add({
          title: "Activities added",
          description: `Added to ${SLOT_LABELS[slot]}.`,
          type: "success",
        })
        handleOpenChange(false)
      },
      onError: (addError) => {
        handleOpenChange(false)
        toast.add({
          title: "Could not add activities",
          description: addError.message,
          type: "error",
        })
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(next) => !next && reset()}
    >
      <DialogTrigger render={<Button variant="secondary" />}>
        Add activity
      </DialogTrigger>
      {step === "select" && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add activity</DialogTitle>
            <DialogDescription>
              Select activities for {SLOT_LABELS[slot]}. Order follows the order
              you tap them.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={searchId} className="sr-only">
                Search activities
              </FieldLabel>
              <Input
                id={searchId}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search activities"
              />
            </Field>
          </FieldGroup>
          <ScrollArea className="h-72">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Could not load activities</EmptyTitle>
                  <EmptyDescription>Try again in a moment.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : activities.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchIcon />
                  </EmptyMedia>
                  <EmptyTitle>No activities</EmptyTitle>
                  <EmptyDescription>
                    {query
                      ? "Nothing matches that search."
                      : "Create an activity before adding one here."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup>
                {activities.map((activity) => (
                  <ActivityPickerRow
                    key={activity.id}
                    order={selectedOrder.get(activity.id) ?? 0}
                    activity={activity}
                    selected={selectedOrder.has(activity.id)}
                    onSelectActivity={handleSelectActivity}
                  />
                ))}
              </ItemGroup>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={selectedActivity.length === 0}
              onClick={handleNext}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {step === "configure" && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure activities</DialogTitle>
            <DialogDescription>
              Choose how each activity is tracked in {SLOT_LABELS[slot]}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <ItemGroup>
              {selectedActivity.map((activity) => {
                const draft = drafts[activity.id]
                if (!draft) return null
                return (
                  <ConfigureActivityDialogRow
                    key={activity.id}
                    activity={activity}
                    value={draft}
                    onChange={(next) =>
                      setDrafts((current) => ({
                        ...current,
                        [activity.id]: next,
                      }))
                    }
                  />
                )
              })}
            </ItemGroup>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() => setStep("select")}
            >
              Back
            </Button>
            <Button disabled={!draftsReady || isPending} onClick={handleDone}>
              {isPending ? "Adding..." : "Done"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export { ActivityPickerDialog }
