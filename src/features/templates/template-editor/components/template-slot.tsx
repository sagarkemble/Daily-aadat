import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItemGroup } from "@/components/ui/item"
import type { Slot } from "../../types/slots"
import { SLOT_LABELS } from "../../types/slots"
import type { NewTemplateActivity, TemplateActivity } from "../../types/template"
import { TemplateActivityRow } from "./template-activity-row"
import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import TemplateActivityRowSkeleton from "./template-activity-row-skeleton"
import { useAddTemplateActivities } from "../hooks/use-add-template-activities"

type SlotProps = {
  templateId: string
  slot: Slot
  activities: TemplateActivity[]
  isLoading?: boolean
}

const TemplateSlot = ({
  templateId,
  slot,
  activities,
  isLoading,
}: SlotProps) => {
  const { mutate: addActivities, isPending: isAdding } =
    useAddTemplateActivities()
  const count = activities.length

  function handleAddActivities(configured: ActivityWithConfiguration[]) {
    const items: NewTemplateActivity[] = configured.map((activity, index) => ({
      template_id: templateId,
      activity_id: activity.id,
      type: activity.type,
      target: activity.type === "count" ? activity.target : null,
      unit: activity.type === "count" ? activity.unit : null,
      slot,
      sort_order: count + index,
    }))
    addActivities(items)
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{SLOT_LABELS[slot]}</CardTitle>
        {count === 0 && !isLoading ? (
          <CardDescription>No activities</CardDescription>
        ) : null}
        <CardAction>
          <ActivityPickerDialog
            onAdd={handleAddActivities}
            isPending={isAdding}
          />
          <Badge variant="secondary">{count}</Badge>
        </CardAction>
      </CardHeader>
      {isLoading ? (
        <CardContent>
          <ItemGroup>
            <TemplateActivityRowSkeleton />
            <TemplateActivityRowSkeleton />
          </ItemGroup>
        </CardContent>
      ) : count > 0 ? (
        <CardContent>
          <ItemGroup>
            {activities.map((activity) => (
              <TemplateActivityRow key={activity.id} activity={activity} />
            ))}
          </ItemGroup>
        </CardContent>
      ) : null}
    </Card>
  )
}

export { TemplateSlot }
