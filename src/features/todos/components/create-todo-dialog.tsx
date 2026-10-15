import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useCreateTodo } from "../hooks/use-create-todo"

import IconPickerPopover from "@/components/icon-picker-popover"
import {
  createTodoInputSchema,
  type CreateTodoInput,
} from "../types/create-todo-input"

const DEFAULT_TODO_ICON = "list-todo"

const emptyValues: CreateTodoInput = {
  name: "",
  icon: DEFAULT_TODO_ICON,
}

export function CreateTodoDialog() {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_TODO_ICON)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTodoInputSchema),
    defaultValues: emptyValues,
  })
  const { mutateAsync: createTodo, isPending } = useCreateTodo()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(emptyValues)
      setSelectedIcon(DEFAULT_TODO_ICON)
    }
  }

  function onSubmit(data: CreateTodoInput) {
    toast
      .promise(createTodo(data), {
        loading: "Creating todo...",
        success: "Todo created",
        error: "Failed to create todo",
      })
      .then(() => {
        handleOpenChange(false)
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
            <DialogTitle>New todo</DialogTitle>
            <DialogDescription>
              Add something to your list. You can put it on a day later.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field
              data-invalid={!!errors.name || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="todo-name">Name</FieldLabel>
              <Input
                id="todo-name"
                placeholder="Call electrician"
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
              <FieldLabel htmlFor="todo-icon">Icon</FieldLabel>
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
                  <Spinner data-icon="inline-start" />
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
