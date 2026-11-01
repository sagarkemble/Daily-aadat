import { useState } from "react"
import { FaceSlightlySmiling, PlusIcon, PencilIcon } from "lucide-react"
import { DynamicIcon } from "@/components/dynamic-icon"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EditTemplateDialog } from "./edit-template-dialog"

type TemplateEditorHeaderProps = {
  templateId: string
  name: string
  description: string
  icon: string
  isLoading?: boolean
  onAddActivity?: () => void
  isAddingActivity?: boolean
}

function TemplateEditorHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-52 max-w-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-28 shrink-0 rounded-lg" />
    </div>
  )
}

const TemplateEditorHeader = ({
  templateId,
  name,
  description,
  icon,
  isLoading = false,
  onAddActivity,
  isAddingActivity = false,
}: TemplateEditorHeaderProps) => {
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) return <TemplateEditorHeaderSkeleton />

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
          <DynamicIcon
            name={icon}
            className="size-6"
            fallback={() => <FaceSlightlySmiling className="size-6" />}
          />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex min-w-0 items-baseline gap-1">
            <h1 className="truncate text-lg font-semibold leading-none">
              {name}
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 shrink-0 translate-y-px text-muted-foreground"
              aria-label="Edit template"
              onClick={() => setEditOpen(true)}
            >
              <PencilIcon className="size-3.5 stroke-[1.75]" />
            </Button>
          </div>
          {description.trim() ? (
            <p className="text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {onAddActivity ? (
        <Button
          size="sm"
          className="shrink-0"
          disabled={isAddingActivity}
          onClick={onAddActivity}
        >
          <PlusIcon data-icon="inline-start" />
          Add activity
        </Button>
      ) : null}
      <EditTemplateDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        templateId={templateId}
        name={name}
        description={description}
        icon={icon}
      />
    </div>
  )
}

export default TemplateEditorHeader
