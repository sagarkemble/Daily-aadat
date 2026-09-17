import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFetchTemplates } from "@/features/templates/hooks/use-fetch-template"
import { useApplyTemplate } from "../hooks/use-apply-template"
import { toast } from "@/components/ui/toast"

type ApplyTemplateSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  planDate: string
  activityCount: number
}

export function ApplyTemplateSheet({
  open,
  onOpenChange,
  planDate,
  activityCount,
}: ApplyTemplateSheetProps) {
  const { data: templates = [], isPending: loadingTemplates } =
    useFetchTemplates()
  const { mutate: applyTemplate, isPending } = useApplyTemplate(planDate)
  const [pendingId, setPendingId] = useState<string | null>(null)

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) setPendingId(null)
  }

  function apply(templateId: string, overwrite: boolean) {
    applyTemplate(
      { planDate, templateId, overwrite },
      {
        onSuccess: (result) => {
          if (!result.ok) {
            setPendingId(templateId)
            return
          }
          toast.add({
            title: overwrite ? "Template replaced" : "Day planned",
            type: "success",
          })
          handleOpenChange(false)
        },
        onError: (error) => {
          toast.add({
            title: "Error",
            description: error.message,
            type: "error",
          })
        },
      }
    )
  }

  function handlePick(templateId: string) {
    if (activityCount > 0) {
      setPendingId(templateId)
      return
    }
    apply(templateId, false)
  }

  const pendingTemplate = templates.find(
    (template) => template.id === pendingId
  )

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {pendingId ? "Replace this day’s activities?" : "Apply template"}
          </SheetTitle>
          <SheetDescription>
            {pendingId
              ? `${activityCount} ${activityCount === 1 ? "activity" : "activities"} already on this day will be replaced. Todos stay.`
              : "Copy a template onto this date. The template itself stays unchanged."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
          {pendingId ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm">
                Apply{" "}
                <span className="font-medium">
                  {pendingTemplate?.name ?? "this template"}
                </span>
                ?
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPendingId(null)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => apply(pendingId, true)}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Applying…
                    </>
                  ) : (
                    "Replace and apply"
                  )}
                </Button>
              </div>
            </div>
          ) : loadingTemplates ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No templates yet.{" "}
              <Link to="/templates" className="underline underline-offset-2">
                Create one
              </Link>{" "}
              first.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {templates.map((template) => (
                <li key={template.id}>
                  <button
                    type="button"
                    disabled={isPending}
                    className="flex w-full items-center justify-between rounded-xl border bg-card p-3 text-left shadow-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
                    onClick={() => handlePick(template.id)}
                  >
                    <span className="truncate text-sm font-medium">
                      {template.name}
                    </span>
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
