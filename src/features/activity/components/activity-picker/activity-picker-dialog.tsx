import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useFetchActivities } from "@/features/activity/hooks/use-fetch-activities"
import { useDebounce } from "@/hooks/use-debounce"
import { useId, useMemo, useState } from "react"
import type {
  Activity,
  ActivityWithConfiguration,
} from "@/features/activity/types/activity"
import { SLOT_LABELS, SLOTS, type Slot } from "@/features/templates/types/slots"
import ActivityPickerConfigureRow from "./activity-picker-configure-row"
import { ActivityPickerRow } from "./activity-picker-row"

type ActivityPickerDialogProps = {
  onAdd: (activities: ActivityWithConfiguration[], slot?: Slot) => void
  isPending?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  requireSlot?: boolean
}

const ActivityPickerDialog = ({
  onAdd,
  isPending = false,
  open,
  onOpenChange,
  requireSlot = false,
}: ActivityPickerDialogProps) => {
  const searchId = useId()
  const { data, isLoading, error } = useFetchActivities()
  const activities = data ?? []
  const [configuredActivities, setConfiguredActivities] = useState<
    ActivityWithConfiguration[]
  >([])
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  const [step, setStep] = useState<"select" | "configure">("select")
  const [slot, setSlot] = useState<Slot | undefined>(undefined)
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
    if (requireSlot && !slot) return
    onAdd(configuredActivities, slot)
    handleOpenChange(false)
  }
  function reset() {
    setSelectedActivities([])
    setConfiguredActivities([])
    setSearchQuery("")
    setStep("select")
    setSlot(undefined)
  }
  function handleOpenChange(nextOpen: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) reset()
      }}
    >
      {isControlled ? null : (
        <DialogTrigger render={<Button variant="secondary" />}>
          Add activity
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        {step === "select" ? (
          <>
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
              <Button onClick={() => handleStepChange("configure")}>
                Next
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Configure activities</DialogTitle>
            </DialogHeader>
            {requireSlot ? (
              <FieldSet>
                <FieldLegend variant="label">Slot</FieldLegend>
                <Field>
                  <ToggleGroup
                    value={slot ? [slot] : []}
                    onValueChange={(value) => {
                      const next = value[0]
                      setSlot(
                        SLOTS.includes(next as Slot) ? (next as Slot) : undefined
                      )
                    }}
                    className="flex-wrap"
                    size="sm"
                  >
                    {SLOTS.map((name) => (
                      <ToggleGroupItem key={name} value={name}>
                        {SLOT_LABELS[name]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
              </FieldSet>
            ) : null}
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
              <Button
                disabled={isPending || (requireSlot && !slot)}
                onClick={handleAddConfiguredActivities}
              >
                {isPending ? "Adding..." : "Done"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { ActivityPickerDialog }
