import { useId } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  createTodoInputSchema,
  type CreateTodoInput,
  type CreateTodoFormInput,
} from "@/features/todos/types/create-todo-input"
import { TodoDueDateField } from "@/features/todos/components/todo-due-date-field"
import { TodoPriorityField } from "@/features/todos/components/todo-priority-field"

const emptyValues: CreateTodoFormInput = {
  name: "",
  note: "",
  priority: "medium",
  due_date: null,
}

type AddTodoCreateFormProps = {
  isPending?: boolean
  disabled?: boolean
  onCreate: (input: CreateTodoInput) => Promise<void>
}

export function AddTodoCreateForm({
  isPending,
  disabled,
  onCreate,
}: AddTodoCreateFormProps) {
  const isLocked = isPending || disabled
  const nameId = useId()
  const noteId = useId()
  const priorityId = useId()
  const dueId = useId()
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

  function onSubmit(data: CreateTodoInput) {
    onCreate({
      ...data,
      priority: data.priority ?? "medium",
      due_date: data.due_date ?? null,
    }).then(() => {
      reset(emptyValues)
    })
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field
          data-invalid={!!errors.name || undefined}
          data-disabled={isPending || undefined}
        >
          <FieldLabel htmlFor={nameId}>Name</FieldLabel>
          <Input
            id={nameId}
            placeholder="What needs doing?"
            aria-invalid={!!errors.name}
            disabled={isPending}
            autoComplete="off"
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <TodoPriorityField
              id={priorityId}
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
              id={dueId}
              value={field.value ?? null}
              onChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
        <Field data-disabled={isPending || undefined}>
          <FieldLabel htmlFor={noteId}>Note</FieldLabel>
          <Input
            id={noteId}
            placeholder="Add note"
            disabled={isPending}
            {...register("note")}
          />
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isLocked}>
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <PlusIcon data-icon="inline-start" />
        )}
        Create and add
      </Button>
    </form>
  )
}
