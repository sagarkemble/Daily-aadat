import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import IconPickerPopover from "@/components/icon-picker-popover"
import { useCreateTemplate } from "../hooks/use-create-template"
import {
  createTemplateInputSchema,
  type CreateTemplateInput,
} from "../types/create-template-input"

const DEFAULT_TEMPLATE_ICON = "face-slightly-smiling"

const emptyValues: CreateTemplateInput = {
  name: "",
  description: "",
  icon: DEFAULT_TEMPLATE_ICON,
}

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_TEMPLATE_ICON)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateInputSchema),
    defaultValues: emptyValues,
  })
  const { mutate: createTemplate, isPending } = useCreateTemplate()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(emptyValues)
      setSelectedIcon(DEFAULT_TEMPLATE_ICON)
    }
  }

  function onSubmit(data: CreateTemplateInput) {
    createTemplate(data, {
      onSuccess: () => {
        toast.add({
          title: "Template created",
          description: `"${data.name}" is ready`,
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
        handleOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Create
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>New template</DialogTitle>
            <DialogDescription>
              Templates are collections of activities that you can reuse.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <Field
              data-invalid={!!errors.name || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="template-name">Name</FieldLabel>
              <Input
                id="template-name"
                placeholder="Home"
                aria-invalid={!!errors.name}
                {...register("name")}
                disabled={isPending}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-disabled={isPending || undefined}>
              <FieldLabel htmlFor="template-icon">Icon</FieldLabel>
              <IconPickerPopover
                selectedIcon={selectedIcon}
                setSelectedIcon={(icon) => {
                  setSelectedIcon(icon)
                  setValue("icon", icon)
                }}
                disabled={isPending}
              />
            </Field>

            <Field data-disabled={isPending || undefined}>
              <FieldLabel htmlFor="template-description">
                Description
              </FieldLabel>
              <Textarea
                id="template-description"
                placeholder="Optional short note about this template"
                {...register("description")}
                disabled={isPending}
              />
            </Field>
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
                  Creating…
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
