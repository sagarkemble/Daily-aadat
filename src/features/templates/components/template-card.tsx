import { Link } from "@tanstack/react-router"
import { FaceSlightlySmiling } from "lucide-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import type { Template } from "../types/template"

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Item
      variant="outline"
      render={
        <Link
          to="/templates/$templateId"
          params={{ templateId: template.id }}
        />
      }
    >
      <ItemMedia variant="icon">
        <ActivityIcon
          name={template.icon}
          fallback={() => <FaceSlightlySmiling />}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{template.name}</ItemTitle>
        <ItemDescription>
          {template.description.trim()
            ? template.description
            : "Tap to edit slots"}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
