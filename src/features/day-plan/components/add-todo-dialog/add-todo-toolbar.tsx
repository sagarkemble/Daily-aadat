import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type AddTodoToolbarProps = {
  searchId: string
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function AddTodoToolbar({
  searchId,
  searchQuery,
  onSearchChange,
}: AddTodoToolbarProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={searchId} className="sr-only">
          Search todos
        </FieldLabel>
        <Input
          id={searchId}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search todos"
        />
      </Field>
    </FieldGroup>
  )
}
