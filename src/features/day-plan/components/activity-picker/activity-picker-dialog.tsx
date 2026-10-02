import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ItemGroup } from "@/components/ui/item"
import { ActivityPickerRow } from "./activity-picker-row"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useActivities } from "@/features/activity/hooks/use-fetch-activities"
import { Skeleton } from "@/components/ui/skeleton"
import { useId, useMemo, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import type { Activity } from "@/features/activity/types/activity"
import ActivityPickerConfigureRow, {
  type ActivityWithConfiguration,
} from "./activity-picker-configure-row"
import type { Slot } from "@/features/templates/types/slots"
import type { NewDayPlanActivity } from "../../types/day-plan"
import { useAddActivity } from "../../hooks/use-add-activity"

type ActivityPickerDialogProps = {
  slot: Slot
  dayPlanId: string
  sortOrderStart: number
}

const ActivityPickerDialog = ({
  slot,
  dayPlanId,
  sortOrderStart,
}: ActivityPickerDialogProps) => {
  const searchId = useId()
  const { data, isLoading, error } = useActivities()
  const activities = data ?? []
  const [configuredActivities, setConfiguredActivities] = useState<
    ActivityWithConfiguration[]
  >([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  const [step, setStep] = useState<"select" | "configure">("select")
  const { mutate: addActivities, isPending } = useAddActivity()
  const selectedOrder = useMemo(() => {
    const order = new Map<string, number>()
    selectedActivities.forEach((activity, index) => {
      order.set(activity.id, index + 1)
    })
    return order
  }, [selectedActivities])
  const debouncedQuery = useDebounce(searchQuery, 300)
  const query = (searchQuery.trim() === "" ? "" : debouncedQuery)
    .trim()
    .toLowerCase()
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) =>
      activity.name.toLowerCase().includes(query)
    )
  }, [activities, query])

  function handleSelectActivity(activity: Activity) {
    setSelectedActivities((current) => {
      const exists = current.some((item) => item.id === activity.id)
      if (exists) return current.filter((item) => item.id !== activity.id)
      return [...current, activity]
    })
  }
  function handleStepChange(step: "select" | "configure") {
    if (step === "configure") {
      setConfiguredActivities(convertToConfiguredActivities(selectedActivities))
    }
    setStep(step)
  }

  function handleConfigureActivityChange(activity: ActivityWithConfiguration) {
    setConfiguredActivities((current) =>
      current.map((item) => (item.id === activity.id ? activity : item))
    )
  }
  function convertToConfiguredActivities(
    activities: Activity[]
  ): ActivityWithConfiguration[] {
    return activities.map((activity) => ({
      ...activity,
      type: activity.suggested_type,
      target: activity.suggested_target,
      unit: activity.suggested_unit,
    }))
  }
  function handleAddConfiguredActivities() {
    const dayItems = toDayItems({
      activities: configuredActivities,
      dayPlanId: dayPlanId,
      slot,
      sortOrderStart,
    })
    addActivities(dayItems)
  }

  function toDayItems({
    activities,
    dayPlanId,
    slot,
    sortOrderStart,
  }: {
    activities: ActivityWithConfiguration[]
    dayPlanId: string
    slot: Slot
    sortOrderStart: number
  }): NewDayPlanActivity[] {
    return activities.map((activity, index) => ({
      day_plan_id: dayPlanId,
      kind: "activity" as const,
      activity_id: activity.id,
      name_snapshot: activity.name,
      icon_snapshot: activity.icon,
      type: activity.type, // configured type, not suggested_type
      target: activity.type === "count" ? activity.target : null,
      unit: activity.type === "count" ? activity.unit : null,
      slot,
      sort_order: sortOrderStart + index, // pick order
      state: "pending" as const,
      note_snapshot: null,
    }))
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" />}>
        Add activity
      </DialogTrigger>
      {step === "select" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activities</DialogTitle>
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
              </div>
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : (
              <ItemGroup>
                {filteredActivities.map((activity) => (
                  <ActivityPickerRow
                    key={activity.id}
                    activity={activity}
                    onSelect={handleSelectActivity}
                    selected={selectedOrder.has(activity.id)}
                    order={selectedOrder.get(activity.id) ?? 0}
                  />
                ))}
              </ItemGroup>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => handleStepChange("configure")}>Next</Button>
          </DialogFooter>
        </DialogContent>
      )}
      {step === "configure" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure activities</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-72">
            <ItemGroup>
              {configuredActivities.map((activity) => (
                <ActivityPickerConfigureRow
                  key={activity.id}
                  activity={activity}
                  onChange={handleConfigureActivityChange}
                />
              ))}
            </ItemGroup>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleAddConfiguredActivities}>Done</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default ActivityPickerDialog
