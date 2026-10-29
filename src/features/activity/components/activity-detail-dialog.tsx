import { lazy, Suspense, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilIcon, Trash2Icon } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/toast"
import { DynamicIcon } from "@/components/dynamic-icon"
import { cn } from "@/lib/utils"
import {
  activityTypeItems,
  activityTypeLabels,
  type Activity,
} from "../types/activity"
import {
  addActivityInputSchema,
  type AddActivityInput,
} from "../types/add-activity-input"
import { useDeleteActivities } from "../hooks/use-delete-activities"
import { useUpdateActivities } from "../hooks/use-update-activities"

const IconPicker = lazy(() => import("@/components/icon-picker-tanstack"))

function toFormValues(activity: Activity): AddActivityInput {
  return {
    name: activity.name,
    icon: activity.icon,
    suggested_type: activity.suggested_type,
    suggested_target: activity.suggested_target?.toString() ?? "",
    suggested_unit: activity.suggested_unit ?? "",
  }
}

function ActivityIconDisplay({ icon }: { icon: string }) {
  return (
    <div className="relative w-fit shrink-0 self-start">
      <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-foreground">
        <DynamicIcon name={icon} size="md" variant="muted" />
      </span>
    </div>
  )
}

function ActivityIconPicker({
  selectedIcon,
  onSelect,
  disabled,
}: {
  selectedIcon: string
  onSelect: (icon: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-fit shrink-0 self-start">
      <ActivityIconDisplay icon={selectedIcon} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              disabled={disabled}
              className="absolute -right-1 -bottom-1 size-6 rounded-full bg-background shadow-sm"
              aria-label="Change icon"
            />
          }
        >
          <PencilIcon />
        </PopoverTrigger>
        {open ? (
          <PopoverContent className="w-auto p-0" align="start">
            <Suspense fallback={<div className="h-80 w-72" />}>
              <IconPicker
                selectedIcon={selectedIcon}
                setSelectedIcon={(iconName) => {
                  onSelect(iconName)
                  setOpen(false)
                }}
              />
            </Suspense>
          </PopoverContent>
        ) : null}
      </Popover>
    </div>
  )
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
  const [selectedIcon, setSelectedIcon] = useState(activity.icon)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: updateActivity, isPending: isUpdating } =
    useUpdateActivities()
  const { mutate: deleteActivity, isPending: isDeleting } =
    useDeleteActivities()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddActivityInput>({
    resolver: zodResolver(addActivityInputSchema),
    defaultValues: toFormValues(activity),
  })

  const suggestedType = watch("suggested_type")
  const isPending = isUpdating || isDeleting

  useEffect(() => {
    if (!open) return
    reset(toFormValues(activity))
    setSelectedIcon(activity.icon)
    setDeleteOpen(false)
  }, [open, activity, reset])

  function onSave(data: AddActivityInput) {
    updateActivity(
      {
        ...activity,
        name: data.name,
        icon: selectedIcon,
        suggested_type: data.suggested_type,
        suggested_target:
          data.suggested_type === "count" && data.suggested_target
            ? Number(data.suggested_target)
            : null,
        suggested_unit:
          data.suggested_type === "count" && data.suggested_unit
            ? data.suggested_unit
            : null,
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
        setDeleteOpen(false)
        onClose()
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        })
        onClose()
      },
    })
  }

  if (!isCustom) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activity</DialogTitle>
          <DialogDescription>Predefined — view only.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <ActivityIconDisplay icon={activity.icon} />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <p className="text-sm leading-snug">{activity.name}</p>
            <Badge variant="outline" className="w-fit">
              {activityTypeLabels[activity.suggested_type]}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    )
  }

  return (
    <DialogContent>
      <form className="contents" onSubmit={handleSubmit(onSave)}>
        <DialogHeader>
          <DialogTitle>Edit activity</DialogTitle>
          <DialogDescription>
            Updates catalog and templates. Past days stay unchanged.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-6">
          <div className="flex flex-col gap-3">
            <ActivityIconPicker
              selectedIcon={selectedIcon}
              onSelect={(icon) => {
                setSelectedIcon(icon)
                setValue("icon", icon, { shouldValidate: true })
              }}
              disabled={isPending}
            />
            <Field
              className="min-w-0"
              data-invalid={!!errors.name || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="edit-activity-name">Name</FieldLabel>
              <Input
                id="edit-activity-name"
                placeholder="Activity name"
                aria-invalid={!!errors.name}
                {...register("name")}
                disabled={isPending}
              />
              <FieldError errors={[errors.name]} />
            </Field>
          </div>

          <FieldSet>
            <FieldLegend variant="label">Type</FieldLegend>
            <Field
              data-invalid={!!errors.suggested_type || undefined}
              data-disabled={isPending || undefined}
            >
              <Controller
                name="suggested_type"
                control={control}
                render={({ field }) => (
                  <ToggleGroup
                    id="edit-activity-type"
                    value={[field.value]}
                    onValueChange={(next) => {
                      const picked = next[0]
                      if (
                        picked === "check" ||
                        picked === "timed" ||
                        picked === "count"
                      ) {
                        field.onChange(picked)
                      }
                    }}
                    disabled={isPending}
                    variant="outline"
                    size="sm"
                    className="flex-wrap"
                  >
                    {activityTypeItems.map((item) => (
                      <ToggleGroupItem key={item.value} value={item.value}>
                        {item.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              />
              <FieldError errors={[errors.suggested_type]} />
            </Field>
          </FieldSet>

          {suggestedType === "count" ? (
            <FieldGroup className="flex-row gap-3">
              <Field
                className="min-w-0 flex-1"
                data-invalid={!!errors.suggested_target || undefined}
                data-disabled={isPending || undefined}
              >
                <FieldLabel htmlFor="edit-activity-target">Target</FieldLabel>
                <Input
                  id="edit-activity-target"
                  type="number"
                  min={1}
                  placeholder="10"
                  aria-invalid={!!errors.suggested_target}
                  {...register("suggested_target")}
                  disabled={isPending}
                />
                <FieldError errors={[errors.suggested_target]} />
              </Field>
              <Field
                className="min-w-0 flex-1"
                data-invalid={!!errors.suggested_unit || undefined}
                data-disabled={isPending || undefined}
              >
                <FieldLabel htmlFor="edit-activity-unit">Unit</FieldLabel>
                <Input
                  id="edit-activity-unit"
                  placeholder="glasses"
                  aria-invalid={!!errors.suggested_unit}
                  {...register("suggested_unit")}
                  disabled={isPending}
                />
                <FieldError errors={[errors.suggested_unit]} />
              </Field>
            </FieldGroup>
          ) : null}
        </FieldGroup>

        <DialogFooter className="sm:justify-between">
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  className={cn(
                    "text-destructive hover:bg-destructive/10 hover:text-destructive"
                  )}
                />
              }
            >
              <Trash2Icon data-icon="inline-start" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete {activity.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This hides it from your catalog. You cannot use it in new
                  templates or days. Past days keep their snapshots.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.preventDefault()
                    onArchive()
                  }}
                >
                  {isDeleting ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Deleting…
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isPending} />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isUpdating ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
