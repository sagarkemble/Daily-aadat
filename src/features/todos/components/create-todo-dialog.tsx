import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
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
  type CreateTodoFormInput,
} from "../types/create-todo-input"
import { TodoDueDateField } from "./todo-due-date-field"
import { TodoPriorityField } from "./todo-priority-field"

const DEFAULT_TODO_ICON = "list-todo"

const emptyValues: CreateTodoFormInput = {
  name: "",
  icon: DEFAULT_TODO_ICON,
  note: "",
  priority: "medium",
  due_date: null,
}

export function CreateTodoDialog() {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_TODO_ICON)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateTodoFormInput, unknown, CreateTodoInput>({
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
      .promise(
        createTodo({
          ...data,
          priority: data.priority ?? "medium",
          due_date: data.due_date ?? null,
        }),
        {
          loading: "Creating todo...",
          success: "Todo created",
          error: "Failed to create todo",
        }
      )
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
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TodoPriorityField
                  id="todo-priority"
                  value={field.value ?? "medium"}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Controller
              name="due_date"
              control={control}
              render={({ field }) => (
                <TodoDueDateField
                  id="todo-due-date"
                  value={field.value ?? null}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Field data-disabled={isPending || undefined}>
              <FieldLabel htmlFor="todo-note">Note</FieldLabel>
              <Input
                id="todo-note"
                placeholder="Add note"
                {...register("note")}
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
