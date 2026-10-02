import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PlusIcon } from "lucide-react"
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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import IconPickerPopover from "@/components/icon-picker-popover"
import {
  addActivityInputSchema,
  type AddActivityInput,
} from "../types/add-activity-input"
import { useAddActivity } from "../hooks/use-add-activities"
import { toast } from "@/components/ui/toast"

const TYPE_ITEMS = [
  { label: "Check", value: "check" },
  { label: "Timed", value: "timed" },
  { label: "Count", value: "count" },
] as const

const emptyValues: AddActivityInput = {
  name: "",
  icon: "",
  suggested_type: "check",
  suggested_target: "",
  suggested_unit: "",
}

export function AddActivityDialog() {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState("")
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddActivityInput>({
    resolver: zodResolver(addActivityInputSchema),
    defaultValues: emptyValues,
  })

  const { mutate: addActivity, isPending } = useAddActivity()
  const suggestedType = watch("suggested_type")

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(emptyValues)
      setSelectedIcon("")
    }
  }

  function onSubmit(data: AddActivityInput) {
    addActivity(
      {
        ...data,
        icon: selectedIcon,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Activity added",
            description: "Your activity has been added",
            type: "success",
          })
          handleOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Add
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>New activity</DialogTitle>
            <DialogDescription>
              Add a custom activity. Type is only a hint for later.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <Field
              data-invalid={!!errors.name || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="activity-name">Name</FieldLabel>
              <Input
                id="activity-name"
                placeholder="Banana"
                aria-invalid={!!errors.name}
                {...register("name")}
                disabled={isPending}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field
              data-invalid={!!errors.icon || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="activity-icon">Icon</FieldLabel>
              <IconPickerPopover
                selectedIcon={selectedIcon}
                setSelectedIcon={(icon) => {
                  setSelectedIcon(icon)
                  setValue("icon", icon, { shouldValidate: true })
                }}
                disabled={isPending}
              />
              <FieldError errors={[errors.icon]} />
            </Field>

            <Field
              data-invalid={!!errors.suggested_type || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="activity-type">Suggested type</FieldLabel>
              <Controller
                name="suggested_type"
                control={control}
                render={({ field }) => (
                  <Select
                    items={TYPE_ITEMS}
                    value={field.value}
                    disabled={isPending}
                    onValueChange={(value) => {
                      if (value == null) return
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger
                      id="activity-type"
                      className="w-full"
                      aria-invalid={!!errors.suggested_type}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {TYPE_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.suggested_type]} />
            </Field>

            {suggestedType === "count" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field
                  data-invalid={!!errors.suggested_target || undefined}
                  data-disabled={isPending || undefined}
                >
                  <FieldLabel htmlFor="activity-target">Target</FieldLabel>
                  <Input
                    id="activity-target"
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
                  data-invalid={!!errors.suggested_unit || undefined}
                  data-disabled={isPending || undefined}
                >
                  <FieldLabel htmlFor="activity-unit">Unit</FieldLabel>
                  <Input
                    id="activity-unit"
                    placeholder="glasses"
                    aria-invalid={!!errors.suggested_unit}
                    {...register("suggested_unit")}
                    disabled={isPending}
                  />
                  <FieldError errors={[errors.suggested_unit]} />
                </Field>
              </div>
            ) : null}
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isPending} />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
