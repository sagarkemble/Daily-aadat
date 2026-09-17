import { Link, createFileRoute } from "@tanstack/react-router"
import { CreateTemplateDialog } from "@/features/templates/components/create-template-dialog"
import { useFetchTemplates } from "@/features/templates/hooks/use-fetch-template"

export const Route = createFileRoute("/_authenticated/templates/")({
  component: RouteComponent,
})

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
                className="block rounded-xl border bg-card p-4 shadow-xs transition-colors hover:bg-muted/50"
              >
                <p className="truncate text-sm font-medium">{template.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tap to edit slots
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
