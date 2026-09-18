import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim(),
})

type FormValues = z.infer<typeof schema>

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  })

  const { mutate: createTemplate, isPending } = useCreateTemplate()
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
      setSelectedIcon(null)
    }
  }

  function onSubmit({ name, description }: FormValues) {
    createTemplate(
      {
        name,
        description,
        icon: selectedIcon ?? "face-slightly-smiling",
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Template created",
            description: `"${name}" is ready`,
            type: "success",
          })
          handleOpenChange(false)
        },
        onError: (error) => {
          handleOpenChange(false)
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
        <PlusIcon />
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
            <Field>
              <FieldLabel>Icon</FieldLabel>
              <IconPickerPopover
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
              />
            </Field>

            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="template-name">Name</FieldLabel>
              <Input
                id="template-name"
                placeholder="Home"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.description || undefined}>
              <FieldLabel htmlFor="template-description">
                Description
              </FieldLabel>
              <Textarea
                id="template-description"
                placeholder="Optional short note about this template"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
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
