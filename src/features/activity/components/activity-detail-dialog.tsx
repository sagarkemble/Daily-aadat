import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { ActivityIcon } from "./activity-icon"
import type { Activity } from "../types/activity"
import {
  addActivityInputSchema,
  type AddActivityInput,
} from "../types/add-activity-input"
import { useDeleteActivities } from "../hooks/use-delete-activities"
import { useUpdateActivities } from "../hooks/use-update-activities"

const typeLabel: Record<Activity["suggested_type"], string> = {
  check: "Check",
  timed: "Timed",
  count: "Count",
}

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

type Step = "view" | "confirm-edit" | "edit" | "confirm-delete"

function toFormValues(activity: Activity): AddActivityInput {
  return {
    name: activity.name,
    icon: activity.icon,
    suggested_type: activity.suggested_type,
    suggested_target: activity.suggested_target?.toString() ?? "",
    suggested_unit: activity.suggested_unit ?? "",
    note: activity.note ?? "",
  }
}

export function ActivityDetailDialog({
  activity,
  open,
  onClose,
}: {
  activity: Activity
  open: boolean
  onClose: () => void
}) {
  const isCustom = activity.source === "custom"
  const [step, setStep] = useState<Step>("view")

  useEffect(() => {
    if (!open) setStep("view")
  }, [open])
  const { mutate: updateActivity, isPending: isUpdating } =
    useUpdateActivities()
  const { mutate: deleteActivity, isPending: isDeleting } =
    useDeleteActivities()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddActivityInput>({
    resolver: zodResolver(addActivityInputSchema),
    defaultValues: toFormValues(activity),
  })

  const icon = watch("icon")
  const goal =
    activity.suggested_target != null
      ? `${activity.suggested_target}${activity.suggested_unit ? ` ${activity.suggested_unit}` : ""}`
      : "None"

  function startEdit() {
    reset(toFormValues(activity))
    setStep("edit")
  }

  function onSave(data: AddActivityInput) {
    updateActivity(
      {
        ...activity,
        name: data.name,
        icon: data.icon,
        suggested_type: data.suggested_type,
        suggested_target: data.suggested_target
          ? Number(data.suggested_target)
          : null,
        suggested_unit: data.suggested_unit || null,
        note: data.note || null,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Activity updated",
            description: "Your activity has been saved.",
            type: "success",
          })
          onClose()
        },
        onError: (error) => {
          toast.add({
            title: "Error",
            description: error.message,
            type: "error",
          })
        },
      }
    )
  }

  function onArchive() {
    deleteActivity(activity.id, {
      onSuccess: () => {
        toast.add({
          title: "Activity deleted",
          description: "It is hidden from your catalog.",
          type: "success",
        })
        onClose()
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        })
      },
    })
  }

  if (step === "confirm-edit") {
    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {activity.name}?</DialogTitle>
          <DialogDescription>
            This updates the activity in your catalog and in templates that use
            it. Past days keep the old name and icon.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setStep("view")}>
            Cancel
          </Button>
          <Button type="button" onClick={startEdit}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  if (step === "confirm-delete") {
    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {activity.name}?</DialogTitle>
          <DialogDescription>
            This hides it from your catalog. You cannot use it in new templates
            or days. Past days keep their snapshots.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("view")}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onArchive}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  }

  if (step === "edit") {
    return (
      <DialogContent className="sm:max-w-md">
        <form id="edit-activity-form" onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit activity</DialogTitle>
            <DialogDescription>
              Change the name, icon, or suggested tracking hints.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="edit-activity-name">Name</FieldLabel>
              <Input
                id="edit-activity-name"
                placeholder="Banana"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.icon || undefined}>
              <FieldLabel htmlFor="edit-activity-icon">Icon</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <ActivityIcon
                    name={icon || "circle-dashed"}
                    className="size-4"
                  />
                </span>
                <Input
                  id="edit-activity-icon"
                  placeholder="banana"
                  aria-invalid={!!errors.icon}
                  {...register("icon")}
                />
              </div>
              <FieldError errors={[errors.icon]} />
            </Field>

            <Field data-invalid={!!errors.suggested_type || undefined}>
              <FieldLabel htmlFor="edit-activity-type">Suggested type</FieldLabel>
              <select
                id="edit-activity-type"
                className={selectClassName}
                aria-invalid={!!errors.suggested_type}
                {...register("suggested_type")}
              >
                <option value="check">Check</option>
                <option value="timed">Timed</option>
                <option value="count">Count</option>
              </select>
              <FieldError errors={[errors.suggested_type]} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={!!errors.suggested_target || undefined}>
                <FieldLabel htmlFor="edit-activity-target">Target</FieldLabel>
                <Input
                  id="edit-activity-target"
                  type="number"
                  min={1}
                  placeholder="10"
                  aria-invalid={!!errors.suggested_target}
                  {...register("suggested_target")}
                />
                <FieldError errors={[errors.suggested_target]} />
              </Field>
              <Field data-invalid={!!errors.suggested_unit || undefined}>
                <FieldLabel htmlFor="edit-activity-unit">Unit</FieldLabel>
                <Input
                  id="edit-activity-unit"
                  placeholder="glasses"
                  aria-invalid={!!errors.suggested_unit}
                  {...register("suggested_unit")}
                />
                <FieldError errors={[errors.suggested_unit]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.note || undefined}>
              <FieldLabel htmlFor="edit-activity-note">Note</FieldLabel>
              <Input
                id="edit-activity-note"
                placeholder="Optional"
                aria-invalid={!!errors.note}
                {...register("note")}
              />
              <FieldError errors={[errors.note]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("view")}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" form="edit-activity-form" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    )
  }

  return (
    <DialogContent>
      <DialogHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ActivityIcon name={activity.icon} className="size-5" />
        </div>
        <DialogTitle>{activity.name}</DialogTitle>
        <DialogDescription>
          {isCustom
            ? "One of your custom activities."
            : "From the shared catalog. View only."}
        </DialogDescription>
      </DialogHeader>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Type</dt>
        <dd>{typeLabel[activity.suggested_type]}</dd>
        <dt className="text-muted-foreground">Goal hint</dt>
        <dd>{goal}</dd>
        {activity.note ? (
          <>
            <dt className="text-muted-foreground">Note</dt>
            <dd>{activity.note}</dd>
          </>
        ) : null}
      </dl>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        {isCustom ? (
          <>
            <Button type="button" onClick={() => setStep("confirm-edit")}>
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setStep("confirm-delete")}
            >
              Delete
            </Button>
          </>
        ) : null}
      </DialogFooter>
    </DialogContent>
  )
}
