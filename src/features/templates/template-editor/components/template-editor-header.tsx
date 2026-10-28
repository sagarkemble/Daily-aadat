import { useState } from "react"
import { FaceSlightlySmiling, ListIcon, PencilIcon } from "lucide-react"
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
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <Skeleton className="h-7 w-16 shrink-0 rounded-lg" />
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
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
          <DynamicIcon name={icon} fallback={() => <FaceSlightlySmiling />} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-lg font-semibold">{name}</h1>
          {description.trim() ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onAddActivity ? (
          <Button
            size="sm"
            variant="secondary"
            disabled={isAddingActivity}
            onClick={onAddActivity}
          >
            <ListIcon data-icon="inline-start" />
            Add activity
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon data-icon="inline-start" />
          Edit
        </Button>
      </div>
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
