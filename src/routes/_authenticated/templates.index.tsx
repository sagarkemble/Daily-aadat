import { createFileRoute } from "@tanstack/react-router"
import TemplateIndexPage from "@/features/templates/components/template-index-page"

export const Route = createFileRoute("/_authenticated/templates/")({
  component: TemplateIndexPage,
})
