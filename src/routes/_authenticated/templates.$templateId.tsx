import TemplateEditor from "@/features/templates/template-editor/components/template-editor-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/templates/$templateId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { templateId } = Route.useParams()
  return <TemplateEditor templateId={templateId} />
}
