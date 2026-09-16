import { useForm } from "react-hook-form"
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
  addActivityInputSchema,
  type AddActivityInput,
} from "../types/add-activity-input"
import { ActivityIcon } from "./activity-icon"
import { useAddActivity } from "../hooks/use-add-activities"
import { toast } from "@/components/ui/toast"

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export function AddActivityDialog() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddActivityInput>({
    resolver: zodResolver(addActivityInputSchema),
    defaultValues: {
      name: "",
      icon: "",
      suggested_type: "check",
      suggested_target: "",
      suggested_unit: "",
      note: "",
    },
  })

  const { mutate: addActivity, isPending, error } = useAddActivity()

  const icon = watch("icon")

  function onSubmit(_data: AddActivityInput) {
    addActivity(_data, {
      onSuccess: () => {
        console.log(_data)
        toast.add({
          title: "Activity added",
          description: "Your activity has been added",
          type: "success",
        })
      },
      onError: (error) => {
        console.log(error)
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        })
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon />
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
            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="activity-name">Name</FieldLabel>
              <Input
                id="activity-name"
                placeholder="Banana"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.icon || undefined}>
              <FieldLabel htmlFor="activity-icon">Icon</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <ActivityIcon
                    name={icon || "circle-dashed"}
                    className="size-4"
                  />
                </span>
                <Input
                  id="activity-icon"
                  placeholder="banana"
                  aria-invalid={!!errors.icon}
                  {...register("icon")}
                />
              </div>
              <FieldError errors={[errors.icon]} />
            </Field>

            <Field data-invalid={!!errors.suggested_type || undefined}>
              <FieldLabel htmlFor="activity-type">Suggested type</FieldLabel>
              <select
                id="activity-type"
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
                <FieldLabel htmlFor="activity-target">Target</FieldLabel>
                <Input
                  id="activity-target"
                  type="number"
                  min={1}
                  placeholder="10"
                  aria-invalid={!!errors.suggested_target}
                  {...register("suggested_target")}
                />
                <FieldError errors={[errors.suggested_target]} />
              </Field>
              <Field data-invalid={!!errors.suggested_unit || undefined}>
                <FieldLabel htmlFor="activity-unit">Unit</FieldLabel>
                <Input
                  id="activity-unit"
                  placeholder="glasses"
                  aria-invalid={!!errors.suggested_unit}
                  {...register("suggested_unit")}
                />
                <FieldError errors={[errors.suggested_unit]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.note || undefined}>
              <FieldLabel htmlFor="activity-note">Note</FieldLabel>
              <Input
                id="activity-note"
                placeholder="Optional"
                aria-invalid={!!errors.note}
                {...register("note")}
              />
              <FieldError errors={[errors.note]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
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
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
