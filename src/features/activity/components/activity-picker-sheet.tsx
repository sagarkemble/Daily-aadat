import { useMemo, useState } from "react"
import { cn } from "cn"
import { ArrowLeftIcon, Loader2, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { useActivities } from "@/features/activity/hooks/use-activities"
import { useAddActivity } from "@/features/activity/hooks/use-add-activities"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import { ActivityIconPicker } from "@/features/activity/components/activity-icon-picker"
import type { Activity, ActivityType } from "@/features/activity/types/activity"

export type ActivityPlacement = {
  activity_id: string
  type: ActivityType
  target: number | null
  unit: string | null
}

type ActivityPickerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  excludeActivityIds?: string[]
  onConfirm: (placements: ActivityPlacement[]) => void
  isPending?: boolean
}

type PlacementDraft = {
  type: ActivityType
  target: string
  unit: string
}

type CreateDraft = {
  name: string
  icon: string
  suggested_type: ActivityType
  suggested_target: string
  suggested_unit: string
}

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

function draftFromActivity(activity: Activity): PlacementDraft {
  return {
    type: activity.suggested_type,
    target: activity.suggested_target?.toString() ?? "",
    unit: activity.suggested_unit ?? "",
  }
}

function emptyCreateDraft(name = ""): CreateDraft {
  return {
    name,
    icon: "circle-dashed",
    suggested_type: "check",
    suggested_target: "",
    suggested_unit: "",
  }
}

function placementFromDraft(
  activityId: string,
  draft: PlacementDraft
): ActivityPlacement {
  return {
    activity_id: activityId,
    type: draft.type,
    target:
      draft.type === "count" && draft.target ? Number(draft.target) : null,
    unit:
      draft.type === "count" && draft.unit.trim() ? draft.unit.trim() : null,
  }
}

export function ActivityPickerSheet({
  open,
  onOpenChange,
  excludeActivityIds = [],
  onConfirm,
  isPending = false,
}: ActivityPickerSheetProps) {
  const { data: activities = [], isPending: loadingActivities } =
    useActivities()
  const { mutate: createActivity, isPending: isCreating } = useAddActivity()
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [drafts, setDrafts] = useState<Record<string, PlacementDraft>>({})
  const [createDraft, setCreateDraft] =
    useState<CreateDraft>(emptyCreateDraft())
  const [createError, setCreateError] = useState<string | null>(null)
  const [createdActivities, setCreatedActivities] = useState<Activity[]>([])
  const [step, setStep] = useState<"pick" | "create" | "configure">("pick")
  const [formError, setFormError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (!open) {
      setSearch("")
      setSelectedIds([])
      setDrafts({})
      setCreateDraft(emptyCreateDraft())
      setCreateError(null)
      setCreatedActivities([])
      setStep("pick")
      setFormError(null)
    }
  }

  const catalog = useMemo(() => {
    const byId = new Map(activities.map((activity) => [activity.id, activity]))
    for (const activity of createdActivities) {
      byId.set(activity.id, activity)
    }
    return [...byId.values()]
  }, [activities, createdActivities])

  const excluded = useMemo(
    () => new Set(excludeActivityIds),
    [excludeActivityIds]
  )

  const activitiesById = useMemo(
    () => new Map(catalog.map((activity) => [activity.id, activity])),
    [catalog]
  )

  const selectedActivities = selectedIds
    .map((id) => activitiesById.get(id))
    .filter((activity): activity is Activity => !!activity)

  const orderById = useMemo(() => {
    const map = new Map<string, number>()
    selectedIds.forEach((id, index) => map.set(id, index + 1))
    return map
  }, [selectedIds])

  const query = search.trim()
  const queryLower = query.toLowerCase()

  const filtered = useMemo(() => {
    return catalog.filter((activity) => {
      if (excluded.has(activity.id)) return false
      if (!queryLower) return true
      return activity.name.toLowerCase().includes(queryLower)
    })
  }, [catalog, excluded, queryLower])

  const exactMatch = useMemo(
    () =>
      queryLower
        ? catalog.find((activity) => activity.name.toLowerCase() === queryLower)
        : undefined,
    [catalog, queryLower]
  )

  const canCreateFromSearch = query.length > 0 && !exactMatch
  const alreadyInSlot = !!(exactMatch && excluded.has(exactMatch.id))

  function resetSheet() {
    setSearch("")
    setSelectedIds([])
    setDrafts({})
    setCreateDraft(emptyCreateDraft())
    setCreateError(null)
    setCreatedActivities([])
    setStep("pick")
    setFormError(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) resetSheet()
  }

  function selectActivity(activity: Activity) {
    if (selectedIds.includes(activity.id) || excluded.has(activity.id)) return
    setSelectedIds((ids) => [...ids, activity.id])
    setDrafts((current) => ({
      ...current,
      [activity.id]: draftFromActivity(activity),
    }))
  }

  function toggleActivity(activity: Activity) {
    if (selectedIds.includes(activity.id)) {
      setSelectedIds((ids) => ids.filter((id) => id !== activity.id))
      setDrafts((current) => {
        const next = { ...current }
        delete next[activity.id]
        return next
      })
      return
    }
    selectActivity(activity)
  }

  function updateDraft(activityId: string, patch: Partial<PlacementDraft>) {
    setDrafts((current) => ({
      ...current,
      [activityId]: { ...current[activityId], ...patch },
    }))
    setFormError(null)
  }

  function openCreate(name = "") {
    setCreateDraft(emptyCreateDraft(name))
    setCreateError(null)
    setStep("create")
  }

  function handleCreate() {
    const name = createDraft.name.trim()
    const icon = createDraft.icon.trim()
    if (!name) {
      setCreateError("Name is required")
      return
    }
    if (!icon) {
      setCreateError("Icon is required")
      return
    }
    if (createDraft.suggested_type === "count") {
      const target = Number(createDraft.suggested_target)
      if (
        !createDraft.suggested_target.trim() ||
        Number.isNaN(target) ||
        target < 1
      ) {
        setCreateError("Target is required")
        return
      }
      if (!createDraft.suggested_unit.trim()) {
        setCreateError("Unit is required")
        return
      }
    }

    createActivity(
      {
        name,
        icon,
        suggested_type: createDraft.suggested_type,
        suggested_target: createDraft.suggested_target,
        suggested_unit: createDraft.suggested_unit,
        note: "",
      },
      {
        onSuccess: (activity) => {
          setCreatedActivities((current) => [...current, activity])
          selectActivity(activity)
          setSearch("")
          setStep("pick")
          toast.add({
            title: "Custom activity created",
            type: "success",
          })
        },
        onError: (error) => {
          setCreateError(error.message)
        },
      }
    )
  }

  function handleAdd() {
    for (const activity of selectedActivities) {
      const draft = drafts[activity.id]
      if (!draft) continue
      if (draft.type !== "count") continue
      const target = Number(draft.target)
      if (!draft.target.trim() || Number.isNaN(target) || target < 1) {
        setFormError(`Set a target for ${activity.name}`)
        return
      }
      if (!draft.unit.trim()) {
        setFormError(`Set a unit for ${activity.name}`)
        return
      }
    }

    onConfirm(
      selectedActivities.map((activity) =>
        placementFromDraft(activity.id, drafts[activity.id])
      )
    )
  }

  const configuring = step === "configure"
  const creating = step === "create"

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {creating
              ? "Create custom"
              : configuring
                ? "Configure tracking"
                : "Add activities"}
          </SheetTitle>
          <SheetDescription>
            {creating
              ? "Saved to your catalog, then added to this selection."
              : configuring
                ? "Tap order is kept. Change type if you need to, then add."
                : "Tap in the order you want them in the slot. Tap again to remove."}
          </SheetDescription>
        </SheetHeader>

        {step === "pick" ? (
          <div className="shrink-0 space-y-2 border-b bg-popover px-4 pb-3">
            <Input
              placeholder="Search activities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {canCreateFromSearch ? (
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => openCreate(query)}
              >
                <PlusIcon />
                Create “{query}”
              </Button>
            ) : alreadyInSlot ? (
              <p className="text-xs text-muted-foreground">
                “{exactMatch?.name}” is already in this slot.
              </p>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => openCreate()}
              >
                <PlusIcon />
                Create custom activity
              </Button>
            )}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {step === "pick" ? (
            loadingActivities ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {query
                  ? "No matching activities. Create a custom one above."
                  : "No activities available for this slot."}
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {filtered.map((activity) => {
                  const order = orderById.get(activity.id)
                  const isSelected = order != null
                  return (
                    <li key={activity.id}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-xs transition-colors hover:bg-muted/50",
                          isSelected && "border-primary bg-muted/40"
                        )}
                        onClick={() => toggleActivity(activity)}
                      >
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "border text-muted-foreground"
                          )}
                        >
                          {order ?? ""}
                        </span>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <ActivityIcon
                            name={activity.icon}
                            className="size-4"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {activity.name}
                          </span>
                          <span className="block text-xs text-muted-foreground capitalize">
                            usually {activity.suggested_type}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )
          ) : creating ? (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setStep("pick")}
              >
                <ArrowLeftIcon className="size-4" />
                Back to list
              </button>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="picker-create-name">Name</FieldLabel>
                  <Input
                    id="picker-create-name"
                    placeholder="Banana"
                    value={createDraft.name}
                    onChange={(e) => {
                      setCreateDraft((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                      setCreateError(null)
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="picker-create-icon">Icon</FieldLabel>
                  <ActivityIconPicker
                    id="picker-create-icon"
                    value={createDraft.icon}
                    onChange={(icon) => {
                      setCreateDraft((current) => ({
                        ...current,
                        icon,
                      }))
                      setCreateError(null)
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="picker-create-type">
                    Suggested type
                  </FieldLabel>
                  <select
                    id="picker-create-type"
                    className={selectClassName}
                    value={createDraft.suggested_type}
                    onChange={(e) =>
                      setCreateDraft((current) => ({
                        ...current,
                        suggested_type: e.target.value as ActivityType,
                      }))
                    }
                  >
                    <option value="check">Check</option>
                    <option value="timed">Timed</option>
                    <option value="count">Count</option>
                  </select>
                </Field>
                {createDraft.suggested_type === "count" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="picker-create-target">
                        Target
                      </FieldLabel>
                      <Input
                        id="picker-create-target"
                        type="number"
                        min={1}
                        placeholder="10"
                        value={createDraft.suggested_target}
                        onChange={(e) =>
                          setCreateDraft((current) => ({
                            ...current,
                            suggested_target: e.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="picker-create-unit">Unit</FieldLabel>
                      <Input
                        id="picker-create-unit"
                        placeholder="glasses"
                        value={createDraft.suggested_unit}
                        onChange={(e) =>
                          setCreateDraft((current) => ({
                            ...current,
                            suggested_unit: e.target.value,
                          }))
                        }
                      />
                    </Field>
                  </div>
                ) : null}
              </FieldGroup>
              {createError ? (
                <FieldError errors={[{ message: createError }]} />
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setStep("pick")
                  setFormError(null)
                }}
              >
                <ArrowLeftIcon className="size-4" />
                Back to list
              </button>

              {selectedActivities.map((activity, index) => {
                const draft = drafts[activity.id]
                if (!draft) return null
                return (
                  <div
                    key={activity.id}
                    className="flex flex-col gap-3 rounded-xl border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <ActivityIcon name={activity.icon} className="size-4" />
                      </span>
                      <span className="text-sm font-medium">
                        {activity.name}
                      </span>
                    </div>
                    <FieldGroup className="gap-3">
                      <Field>
                        <FieldLabel htmlFor={`placement-type-${activity.id}`}>
                          Type
                        </FieldLabel>
                        <select
                          id={`placement-type-${activity.id}`}
                          className={selectClassName}
                          value={draft.type}
                          onChange={(e) =>
                            updateDraft(activity.id, {
                              type: e.target.value as ActivityType,
                            })
                          }
                        >
                          <option value="check">Check</option>
                          <option value="timed">Timed</option>
                          <option value="count">Count</option>
                        </select>
                      </Field>
                      {draft.type === "count" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel
                              htmlFor={`placement-target-${activity.id}`}
                            >
                              Target
                            </FieldLabel>
                            <Input
                              id={`placement-target-${activity.id}`}
                              type="number"
                              min={1}
                              placeholder="10"
                              value={draft.target}
                              onChange={(e) =>
                                updateDraft(activity.id, {
                                  target: e.target.value,
                                })
                              }
                            />
                          </Field>
                          <Field>
                            <FieldLabel
                              htmlFor={`placement-unit-${activity.id}`}
                            >
                              Unit
                            </FieldLabel>
                            <Input
                              id={`placement-unit-${activity.id}`}
                              placeholder="glasses"
                              value={draft.unit}
                              onChange={(e) =>
                                updateDraft(activity.id, {
                                  unit: e.target.value,
                                })
                              }
                            />
                          </Field>
                        </div>
                      ) : null}
                    </FieldGroup>
                  </div>
                )
              })}
              {formError ? (
                <FieldError errors={[{ message: formError }]} />
              ) : null}
            </div>
          )}
        </div>

        <SheetFooter>
          {creating ? (
            <Button type="button" disabled={isCreating} onClick={handleCreate}>
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create and select"
              )}
            </Button>
          ) : configuring ? (
            <Button
              type="button"
              disabled={isPending || selectedActivities.length === 0}
              onClick={handleAdd}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Adding…
                </>
              ) : selectedActivities.length === 1 ? (
                "Add to slot"
              ) : (
                `Add ${selectedActivities.length} to slot`
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => setStep("configure")}
            >
              {selectedIds.length === 0
                ? "Select activities"
                : selectedIds.length === 1
                  ? "Next"
                  : `Next · ${selectedIds.length} selected`}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
