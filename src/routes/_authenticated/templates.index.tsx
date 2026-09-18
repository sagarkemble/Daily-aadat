import { Link, createFileRoute } from "@tanstack/react-router"
import { FaceSlightlySmiling } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { CreateTemplateDialog } from "@/features/templates/components/create-template-dialog"
import { useFetchTemplates } from "@/features/templates/hooks/use-fetch-templates"

export const Route = createFileRoute("/_authenticated/templates/")({
  component: RouteComponent,
})

function TemplateListIcon({ name }: { name: string }) {
  return (
    <DynamicIcon
      name={name as IconName}
      className="size-5"
      fallback={() => <FaceSlightlySmiling className="size-5" />}
    />
  )
}

function RouteComponent() {
  const { data, isPending, isError, error } = useFetchTemplates()

  if (isPending) return <div>Loading…</div>
  if (isError) return <div>{error.message}</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Reusable day shapes like Home or College.
          </p>
        </div>
        <CreateTemplateDialog />
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No templates yet. Create your first one.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((template) => (
            <li key={template.id}>
              <Link
                to="/templates/$templateId"
                params={{ templateId: template.id }}
                className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xs transition-colors hover:bg-muted/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <TemplateListIcon name={template.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {template.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {template.description.trim()
                      ? template.description
                      : "Tap to edit slots"}
                  </p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
