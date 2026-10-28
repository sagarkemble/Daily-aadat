import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import IconPickerPopover from "@/components/icon-picker-popover"
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
} from "@/features/todos/types/create-todo-input"

const DEFAULT_TODO_ICON = "list-todo"

const emptyValues = {
  name: "",
  icon: DEFAULT_TODO_ICON,
  note: "",
}

type AddTodoCreateFormProps = {
  isPending?: boolean
  onCreate: (input: CreateTodoInput) => Promise<void>
}

export function AddTodoCreateForm({
  isPending,
  onCreate,
}: AddTodoCreateFormProps) {
  const nameId = useId()
  const noteId = useId()
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

  function onSubmit(data: CreateTodoInput) {
    onCreate(data).then(() => {
      reset(emptyValues)
      setSelectedIcon(DEFAULT_TODO_ICON)
    })
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field
          data-invalid={!!errors.name || undefined}
          data-disabled={isPending || undefined}
        >
          <FieldLabel htmlFor={nameId}>New todo</FieldLabel>
          <div className="flex items-end gap-2">
            <Input
              id={nameId}
              placeholder="Name"
              aria-invalid={!!errors.name}
              disabled={isPending}
              {...register("name")}
            />
            <IconPickerPopover
              selectedIcon={selectedIcon}
              setSelectedIcon={(icon) => {
                setSelectedIcon(icon)
                setValue("icon", icon, { shouldValidate: true })
              }}
              disabled={isPending}
            />
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <PlusIcon data-icon="inline-start" />
              )}
              Create
            </Button>
          </div>
          <FieldError errors={[errors.name, errors.icon]} />
        </Field>
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
    </form>
  )
}
