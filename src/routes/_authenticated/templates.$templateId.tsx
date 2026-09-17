import { createFileRoute } from "@tanstack/react-router"
import { TemplateEditor } from "@/features/templates/components/template-editor"

export const Route = createFileRoute("/_authenticated/templates/$templateId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { templateId } = Route.useParams()
  return <TemplateEditor templateId={templateId} />
}
