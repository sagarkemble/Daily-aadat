import { useId } from "react"
import { DynamicIcon } from "@/components/dynamic-icon"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  activityTypeItems,
  type ActivityType,
  type ActivityWithConfiguration,
} from "@/features/activity/types/activity"

type ActivityPickerConfigureRowProps = {
  activity: ActivityWithConfiguration
  onChange: (activity: ActivityWithConfiguration) => void
}

const ActivityPickerConfigureRow = ({
  activity,
  onChange,
}: ActivityPickerConfigureRowProps) => {
  const typeId = useId()
  const targetId = useId()
  const unitId = useId()

  function handleTypeChange(type: ActivityType | null) {
    if (type == null) return
    if (type !== "count") {
      onChange({ ...activity, type, target: null, unit: null })
      return
    }
    onChange({
      ...activity,
      type,
      target: activity.target ?? activity.suggested_target,
      unit: activity.unit ?? activity.suggested_unit,
    })
  }

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <DynamicIcon name={activity.icon} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name}</ItemTitle>
      </ItemContent>
      <ItemFooter>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor={typeId}>Type</FieldLabel>
            <Select
              items={activityTypeItems}
              value={activity.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id={typeId} size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activityTypeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {activity.type === "count" ? (
            <FieldGroup className="flex-row gap-3">
              <Field>
                <FieldLabel htmlFor={targetId}>Target</FieldLabel>
                <Input
                  id={targetId}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="10"
                  value={activity.target ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...activity,
                      target:
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={unitId}>Unit</FieldLabel>
                <Input
                  id={unitId}
                  placeholder="glasses"
                  value={activity.unit ?? ""}
                  onChange={(event) =>
                    onChange({ ...activity, unit: event.target.value })
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

export default ActivityPickerConfigureRow
