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
import type { Slot } from "../types/slots"
import { SLOT_LABELS } from "../types/slots"
import type { TemplateActivity } from "../types/template"
import { TemplateActivityRow } from "./template-activity-row"
import { ActivityPickerDialog } from "./activity-picker-dialog"

type SlotProps = {
  templateId: string
  slot: Slot
  activities: TemplateActivity[]
}

const TemplateSlot = ({ templateId, slot, activities }: SlotProps) => {
  const count = activities.length
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{SLOT_LABELS[slot]}</CardTitle>
        {count === 0 ? <CardDescription>No activities</CardDescription> : null}
        <CardAction>
          <ActivityPickerDialog
            templateId={templateId}
            slot={slot}
            sortOrderStart={count}
          />
          <Badge variant="secondary">{count}</Badge>
        </CardAction>
      </CardHeader>
      {count > 0 ? (
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
