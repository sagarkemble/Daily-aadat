import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeftIcon, Loader2 } from "lucide-react"
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
import { useActivities } from "@/features/activity/hooks/use-activities"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
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
  onConfirm: (placement: ActivityPlacement) => void
  isPending?: boolean
}

const configureSchema = z
  .object({
    type: z.enum(["check", "timed", "count"]),
    target: z.string().optional(),
    unit: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "count") return
    const target = data.target?.trim() ?? ""
    const unit = data.unit?.trim() ?? ""
    if (!target || Number(target) < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Target is required",
        path: ["target"],
      })
    }
    if (!unit) {
      ctx.addIssue({
        code: "custom",
        message: "Unit is required",
        path: ["unit"],
      })
    }
  })

type ConfigureValues = z.infer<typeof configureSchema>

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export function ActivityPickerSheet({
  open,
  onOpenChange,
  excludeActivityIds = [],
  onConfirm,
  isPending = false,
}: ActivityPickerSheetProps) {
  const { data: activities = [], isPending: loadingActivities } =
    useActivities()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Activity | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ConfigureValues>({
    resolver: zodResolver(configureSchema),
    defaultValues: {
      type: "check",
      target: "",
      unit: "",
    },
  })

  const type = watch("type")

  const excluded = useMemo(
    () => new Set(excludeActivityIds),
    [excludeActivityIds]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return activities.filter((activity) => {
      if (excluded.has(activity.id)) return false
      if (!q) return true
      return activity.name.toLowerCase().includes(q)
    })
  }, [activities, excluded, search])

  function resetSheet() {
    setSearch("")
    setSelected(null)
    reset({ type: "check", target: "", unit: "" })
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) resetSheet()
  }

  function pickActivity(activity: Activity) {
    setSelected(activity)
    reset({
      type: activity.suggested_type,
      target: activity.suggested_target?.toString() ?? "",
      unit: activity.suggested_unit ?? "",
    })
  }

  function onSubmit(values: ConfigureValues) {
    if (!selected) return
    onConfirm({
      activity_id: selected.id,
      type: values.type,
      target:
        values.type === "count" && values.target
          ? Number(values.target)
          : null,
      unit:
        values.type === "count" && values.unit?.trim()
          ? values.unit.trim()
          : null,
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {selected ? "Configure tracking" : "Add activity"}
          </SheetTitle>
          <SheetDescription>
            {selected
              ? `Choose how “${selected.name}” is tracked in this slot.`
              : "Pick an activity, then choose check, timed, or count."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {!selected ? (
            <>
              <Input
                placeholder="Search activities…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {loadingActivities ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No activities available for this slot.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {filtered.map((activity) => (
                    <li key={activity.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-xs transition-colors hover:bg-muted/50"
                        onClick={() => pickActivity(activity)}
                      >
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
                  ))}
                </ul>
              )}
            </>
          ) : (
            <form
              id="configure-activity"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setSelected(null)}
              >
                <ArrowLeftIcon className="size-4" />
                Back to list
              </button>

              <div className="flex items-center gap-3 rounded-xl border p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ActivityIcon name={selected.icon} className="size-4" />
                </span>
                <span className="text-sm font-medium">{selected.name}</span>
              </div>

              <FieldGroup className="gap-4">
                <Field data-invalid={!!errors.type || undefined}>
                  <FieldLabel htmlFor="placement-type">Type</FieldLabel>
                  <select
                    id="placement-type"
                    className={selectClassName}
                    aria-invalid={!!errors.type}
                    {...register("type")}
                  >
                    <option value="check">Check</option>
                    <option value="timed">Timed</option>
                    <option value="count">Count</option>
                  </select>
                  <FieldError errors={[errors.type]} />
                </Field>

                {type === "count" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.target || undefined}>
                      <FieldLabel htmlFor="placement-target">Target</FieldLabel>
                      <Input
                        id="placement-target"
                        type="number"
                        min={1}
                        placeholder="10"
                        aria-invalid={!!errors.target}
                        {...register("target")}
                      />
                      <FieldError errors={[errors.target]} />
                    </Field>
                    <Field data-invalid={!!errors.unit || undefined}>
                      <FieldLabel htmlFor="placement-unit">Unit</FieldLabel>
                      <Input
                        id="placement-unit"
                        placeholder="glasses"
                        aria-invalid={!!errors.unit}
                        {...register("unit")}
                      />
                      <FieldError errors={[errors.unit]} />
                    </Field>
                  </div>
                )}
              </FieldGroup>
            </form>
          )}
        </div>

        {selected && (
          <SheetFooter>
            <Button
              type="submit"
              form="configure-activity"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add to slot"
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
