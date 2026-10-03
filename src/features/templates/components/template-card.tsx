import { Link } from "@tanstack/react-router"
import { FaceSlightlySmiling } from "lucide-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { DynamicIcon } from "@/components/dynamic-icon"
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
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <DynamicIcon name={template.icon} className="size-4" />
        </span>
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
