import { useEffect, useId, useMemo, useState } from "react"
import {
  ArrowLeftIcon,
  CloudOffIcon,
  SearchIcon,
  SearchXIcon,
  XIcon,
} from "lucide-react"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
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
import { Field, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ItemGroup } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useFetchActivities } from "@/features/activity/hooks/use-fetch-activities"
import type {
  Activity,
  ActivityWithConfiguration,
} from "@/features/activity/types/activity"
import { SLOT_LABELS, SLOTS, type Slot } from "@/features/templates/types/slots"
import { useDebounce } from "@/hooks/use-debounce"
import ActivityPickerConfigureRow from "./activity-picker-configure-row"
import { ActivityPickerRow } from "./activity-picker-row"

type ActivityPickerDialogProps = {
  onAdd: (activities: ActivityWithConfiguration[], slot?: Slot) => void
  isPending?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  requireSlot?: boolean
  initialSlot?: Slot
}

function pluralActivities(count: number) {
  return count === 1 ? "1 activity" : `${count} activities`
}

function SelectedChips({
  activities,
  onRemove,
  onClear,
}: {
  activities: Activity[]
  onRemove: (activity: Activity) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted/50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Selected · {activities.length}
        </p>
        <Button
          type="button"
          variant="link"
          size="xs"
          className="h-auto px-0 text-muted-foreground"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>
      <ul className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-background pr-1 pl-1 text-xs font-medium text-foreground">
              <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[0.65rem] font-semibold text-foreground tabular-nums">
                {index + 1}
              </span>
              <DynamicIcon name={activity.icon} size="xs" />
              <span className="max-w-32 truncate">{activity.name}</span>
              <button
                type="button"
                className="flex size-5 items-center justify-center rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label={`Remove ${activity.name}`}
                onClick={() => onRemove(activity)}
              >
                <XIcon className="size-3" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ActivityPickerDialog = ({
  onAdd,
  isPending = false,
  open,
  onOpenChange,
  requireSlot = false,
  initialSlot,
}: ActivityPickerDialogProps) => {
  const searchId = useId()
  const { data, isLoading, error, refetch } = useFetchActivities()
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
  const [slot, setSlot] = useState<Slot | undefined>(initialSlot)
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
  const selectedCount = selectedActivities.length
  const destination = slot ? SLOT_LABELS[slot] : null

  function handleSelectActivity(activity: Activity) {
    setSelectedActivities((current) => {
      const exists = current.some((item) => item.id === activity.id)
      if (exists) return current.filter((item) => item.id !== activity.id)
      return [...current, activity]
    })
  }
  function handleStepChange(step: "select" | "configure") {
    if (step === "configure") {
      if (selectedCount === 0) return
      setConfiguredActivities((current) =>
        selectedActivities.map(
          (activity) =>
            current.find((item) => item.id === activity.id) ??
            convertToConfiguredActivity(activity)
        )
      )
    }
    setStep(step)
  }

  function handleConfigureActivityChange(activity: ActivityWithConfiguration) {
    setConfiguredActivities((current) =>
      current.map((item) => (item.id === activity.id ? activity : item))
    )
  }
  function convertToConfiguredActivity(
    activity: Activity
  ): ActivityWithConfiguration {
    return {
      ...activity,
      type: activity.suggested_type,
      target: activity.suggested_target,
      unit: activity.suggested_unit,
    }
  }
  function handleAddConfiguredActivities() {
    if (requireSlot && !slot) return
    onAdd(configuredActivities, slot)
    handleOpenChange(false)
  }
  useEffect(() => {
    if (isOpen) setSlot(initialSlot)
  }, [isOpen, initialSlot])

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

  function renderList() {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )
    }
    if (error) {
      return (
        <Empty className="border-0 py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CloudOffIcon />
            </EmptyMedia>
            <EmptyTitle>Couldn't load activities</EmptyTitle>
            <EmptyDescription>{error.message}</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </Empty>
      )
    }
    if (filteredActivities.length === 0) {
      return (
        <Empty className="border-0 py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>
              {query
                ? `No activities match "${searchQuery.trim()}"`
                : "No activities yet"}
            </EmptyTitle>
            <EmptyDescription>
              {query
                ? "Try a shorter name."
                : "Create activities on the Activities page first."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )
    }
    return (
      <ItemGroup className="gap-2 pr-3">
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
    )
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
              <DialogTitle>
                {destination ? `Add to ${destination}` : "Add activities"}
              </DialogTitle>
              <DialogDescription>
                Pick in the order you'll do them. Step 1 of 2.
              </DialogDescription>
            </DialogHeader>
            <div className="flex min-w-0 flex-col gap-3">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id={searchId}
                  aria-label="Search activities"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search activities"
                />
                {searchQuery ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
              {selectedCount > 0 ? (
                <SelectedChips
                  activities={selectedActivities}
                  onRemove={handleSelectActivity}
                  onClear={() => setSelectedActivities([])}
                />
              ) : null}
            </div>
            <ScrollArea className="h-72 sm:h-80">{renderList()}</ScrollArea>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => handleStepChange("configure")}
              >
                {selectedCount === 0
                  ? "Select activities"
                  : `Next · ${selectedCount}`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 pr-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="-ml-2"
                  aria-label="Back to selection"
                  disabled={isPending}
                  onClick={() => handleStepChange("select")}
                >
                  <ArrowLeftIcon />
                </Button>
                <DialogTitle>
                  Set up {pluralActivities(selectedCount)}
                </DialogTitle>
              </div>
              <DialogDescription>
                {destination
                  ? `Adding to ${destination}. Step 2 of 2.`
                  : "Choose how each one is tracked. Step 2 of 2."}
              </DialogDescription>
            </DialogHeader>
            {requireSlot && !initialSlot ? (
              <FieldSet>
                <FieldLegend variant="label">Slot</FieldLegend>
                <Field>
                  <ToggleGroup
                    value={slot ? [slot] : []}
                    onValueChange={(value) => {
                      const next = value[0]
                      setSlot(
                        SLOTS.includes(next as Slot)
                          ? (next as Slot)
                          : undefined
                      )
                    }}
                    variant="outline"
                    className="flex-wrap"
                    size="sm"
                    spacing={1}
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
            <ScrollArea className="h-72 sm:h-80">
              <ItemGroup className="gap-2 pr-3">
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
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleStepChange("select")}
              >
                Back
              </Button>
              <Button
                type="button"
                disabled={isPending || (requireSlot && !slot)}
                onClick={handleAddConfiguredActivities}
              >
                {isPending ? <Spinner data-icon="inline-start" /> : null}
                {isPending
                  ? "Adding…"
                  : requireSlot && !slot
                    ? "Pick a slot"
                    : `Add ${pluralActivities(selectedCount)}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { ActivityPickerDialog }
