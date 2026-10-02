import { useId } from "react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import type { Activity, ActivityType } from "@/features/activity/types/activity"

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "check", label: "Check" },
  { value: "timed", label: "Timed" },
  { value: "count", label: "Count" },
]

export type ConfigureActivityValue = {
  type: ActivityType
  target: string
  unit: string
}

type ConfigureActivityDialogRowProps = {
  activity: Activity
  value: ConfigureActivityValue
  onChange: (value: ConfigureActivityValue) => void
}

function ConfigureActivityDialogRow({
  activity,
  value,
  onChange,
}: ConfigureActivityDialogRowProps) {
  const typeId = useId()
  const targetId = useId()
  const unitId = useId()

  function handleTypeChange(next: string[]) {
    const type = next[0] as ActivityType | undefined
    if (!type) return
    if (type !== "count") {
      onChange({ type, target: "", unit: "" })
      return
    }
    onChange({
      type,
      target: value.target || activity.suggested_target?.toString() || "",
      unit: value.unit || activity.suggested_unit || "",
    })
  }

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <ActivityIcon name={activity.icon} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name}</ItemTitle>
      </ItemContent>
      <ItemFooter>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel id={typeId}>Type</FieldLabel>
            <ToggleGroup
              aria-labelledby={typeId}
              variant="outline"
              size="sm"
              spacing={2}
              value={[value.type]}
              onValueChange={handleTypeChange}
            >
              {ACTIVITY_TYPES.map((type) => (
                <ToggleGroupItem key={type.value} value={type.value}>
                  {type.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
          {value.type === "count" ? (
            <FieldGroup className="flex-row gap-3">
              <Field>
                <FieldLabel htmlFor={targetId}>Target</FieldLabel>
                <Input
                  id={targetId}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="10"
                  value={value.target}
                  onChange={(event) =>
                    onChange({ ...value, target: event.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={unitId}>Unit</FieldLabel>
                <Input
                  id={unitId}
                  placeholder="glasses"
                  value={value.unit}
                  onChange={(event) =>
                    onChange({ ...value, unit: event.target.value })
                  }
                />
              </Field>
            </FieldGroup>
          ) : null}
        </FieldGroup>
      </ItemFooter>
    </Item>
  )
}

export { ConfigureActivityDialogRow }
