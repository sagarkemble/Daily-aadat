import { LayoutTemplateIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PageShell } from "@/components/page-shell"
import { useFetchTemplates } from "../hooks/use-fetch-templates"
import { CreateTemplateDialog } from "./create-template-dialog"
import { EmptyTemplate } from "./empty-template"
import { TemplateCard } from "./template-card"
import { TemplateCardSkeleton } from "./template-card-skeleton"

const SKELETON_COUNT = 4

const TemplateIndexPage = () => {
  const { data, isPending, isError, error } = useFetchTemplates()

  if (isError) return <div>{error.message}</div>

  const templates = data ?? []
  const showCreate = !isPending && templates.length > 0

  return (
    <PageShell>
      <PageHeader
        title="Templates"
        description="Reusable day shapes like Home or College."
        actions={showCreate ? <CreateTemplateDialog /> : null}
      />

      {isPending ? (
        <div className="grid items-start gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <EmptyTemplate
          title="No templates yet"
          description="Create your first one to reuse a day shape like Home or College."
          icon={<LayoutTemplateIcon />}
        >
          <CreateTemplateDialog />
        </EmptyTemplate>
      ) : (
        <div className="grid items-start gap-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </PageShell>
  )
}

export default TemplateIndexPage
