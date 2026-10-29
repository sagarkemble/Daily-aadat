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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { useCreateTodo } from "../hooks/use-create-todo"
import {
  createTodoInputSchema,
  type CreateTodoInput,
  type CreateTodoFormInput,
} from "../types/create-todo-input"
import { TodoDueDateField } from "./todo-due-date-field"
import { TodoPriorityField } from "./todo-priority-field"

const emptyValues: CreateTodoFormInput = {
  name: "",
  note: "",
  priority: "medium",
  due_date: null,
}

export function CreateTodoDialog() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
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
      <DialogContent>
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>New todo</DialogTitle>
            <DialogDescription>
              Add it now or schedule it for later.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-6">
            <Field
              data-invalid={!!errors.name || undefined}
              data-disabled={isPending || undefined}
            >
              <FieldLabel htmlFor="todo-name" className="sr-only">
                What needs to be done?
              </FieldLabel>
              <Input
                id="todo-name"
                placeholder="What needs to be done?"
                aria-invalid={!!errors.name}
                autoFocus
                {...register("name")}
                disabled={isPending}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-disabled={isPending || undefined}>
              <FieldLabel htmlFor="todo-note" className="sr-only">
                Note
              </FieldLabel>
              <Textarea
                id="todo-note"
                placeholder="Add a note..."
                rows={3}
                disabled={isPending}
                {...register("note")}
              />
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
                  mode="presets"
                  value={field.value ?? null}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="ghost" disabled={isPending} />
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
