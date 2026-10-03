import { LayoutTemplateIcon } from "lucide-react"
import { ItemGroup } from "@/components/ui/item"
import { useFetchTemplates } from "../hooks/use-fetch-templates"
import { CreateTemplateDialog } from "./create-template-dialog"
import { EmptyTemplate } from "./empty-template"
import { TemplateCard } from "./template-card"
import { TemplateCardSkeleton } from "./template-card-skeleton"

const SKELETON_COUNT = 6

const TemplateIndexPage = () => {
  const { data, isPending, isError, error } = useFetchTemplates()

  if (isError) return <div>{error.message}</div>

  const templates = data ?? []
  const showCreate = !isPending && templates.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Reusable day shapes like Home or College.
          </p>
        </div>
        {showCreate ? <CreateTemplateDialog /> : null}
      </div>

      {isPending ? (
        <ItemGroup className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </ItemGroup>
      ) : templates.length === 0 ? (
        <EmptyTemplate
          title="No templates yet"
          description="Create your first one to reuse a day shape like Home or College."
          icon={<LayoutTemplateIcon />}
        >
          <CreateTemplateDialog />
        </EmptyTemplate>
      ) : (
        <ItemGroup className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </ItemGroup>
      )}
    </div>
  )
}

export default TemplateIndexPage
