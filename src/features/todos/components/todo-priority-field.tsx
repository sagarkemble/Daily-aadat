import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  TODO_PRIORITY_DOT_CLASS,
  TODO_PRIORITY_LABELS,
} from "../lib/todo-priority"
import type { TodoPriority } from "../types/todo"

const PRIORITIES: TodoPriority[] = ["high", "medium", "low"]

type TodoPriorityFieldProps = {
  id?: string
  value: TodoPriority
  onChange: (value: TodoPriority) => void
  disabled?: boolean
  label?: string
  showLegend?: boolean
}

function TodoPriorityField({
  id,
  value,
  onChange,
  disabled,
  label = "Priority",
  showLegend = true,
}: TodoPriorityFieldProps) {
  return (
    <FieldSet>
      {showLegend ? <FieldLegend variant="label">{label}</FieldLegend> : null}
      <Field data-disabled={disabled || undefined}>
        {showLegend ? null : (
          <FieldLabel htmlFor={id} className="sr-only">
            {label}
          </FieldLabel>
        )}
        <ToggleGroup
          id={id}
          value={[value]}
          onValueChange={(next) => {
            const picked = next[0]
            if (
              picked === "high" ||
              picked === "medium" ||
              picked === "low"
            ) {
              onChange(picked)
            }
          }}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="flex-wrap"
        >
          {PRIORITIES.map((priority) => (
            <ToggleGroupItem key={priority} value={priority}>
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  TODO_PRIORITY_DOT_CLASS[priority]
                )}
                aria-hidden
              />
              {TODO_PRIORITY_LABELS[priority]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </FieldSet>
  )
}

export { TodoPriorityField }
