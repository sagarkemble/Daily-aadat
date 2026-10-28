import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import IconPickerPopover from "@/components/icon-picker-popover"
import {
  createTemplateInputSchema,
  type CreateTemplateInput,
} from "../../types/create-template-input"
import { DeleteTemplateDialog } from "./delete-template-dialog"
import { useUpdateTemplate } from "../hooks/use-update-template"

const DEFAULT_TEMPLATE_ICON = "face-slightly-smiling"

type EditTemplateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateId: string
  name: string
  description: string
  icon: string
}

function EditTemplateDialog({
  open,
  onOpenChange,
  templateId,
  name,
  description,
  icon,
}: EditTemplateDialogProps) {
  const savedIcon = icon.trim() || DEFAULT_TEMPLATE_ICON
  const [selectedIcon, setSelectedIcon] = useState(savedIcon)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateInputSchema),
    defaultValues: {
      name,
      description,
      icon: savedIcon,
    },
  })
  const { mutateAsync: updateTemplate, isPending } = useUpdateTemplate()

  useEffect(() => {
    if (!open) return
    reset({
      name,
      description,
      icon: savedIcon,
    })
    setSelectedIcon(savedIcon)
  }, [open, name, description, savedIcon, reset])

  function onSubmit(data: CreateTemplateInput) {
    toast.promise(
      updateTemplate({ id: templateId, ...data }).then(() => {
        onOpenChange(false)
      }),
      {
        loading: { title: "Saving template…" },
        success: { title: "Template saved" },
        error: { title: "Failed to save template" },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit template</DialogTitle>
            <DialogDescription>
              Update the icon, name, and description.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <Field
              data-invalid={!!errors.name || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="edit-template-name">Name</FieldLabel>
              <Input
                id="edit-template-name"
                placeholder="Home"
                aria-invalid={!!errors.name}
                {...register("name")}
                disabled={isPending}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-disabled={isPending || undefined}>
              <FieldLabel htmlFor="edit-template-icon">Icon</FieldLabel>
              <IconPickerPopover
                selectedIcon={selectedIcon}
                setSelectedIcon={(nextIcon) => {
                  setSelectedIcon(nextIcon)
                  setValue("icon", nextIcon)
                }}
                disabled={isPending}
              />
            </Field>

            <Field data-disabled={isPending || undefined}>
              <FieldLabel htmlFor="edit-template-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-template-description"
                placeholder="Optional short note about this template"
                {...register("description")}
                disabled={isPending}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="sm:justify-between">
            <DeleteTemplateDialog
              templateId={templateId}
              name={name}
              onDeleted={() => onOpenChange(false)}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
    </Dialog>
  )
}

export { EditTemplateDialog }
