import { useState } from "react"
import { FaceSlightlySmiling, Trash2Icon } from "lucide-react"
import { DynamicIcon } from "@/components/dynamic-icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useDeleteTemplate } from "../hooks/use-delete-template"

type TemplateEditorHeaderProps = {
  templateId: string
  name: string
  description: string
  icon: string
  isLoading?: boolean
}

function TemplateEditorHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
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
}: TemplateEditorHeaderProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { mutate: deleteTemplate, isPending } = useDeleteTemplate()

  if (isLoading) return <TemplateEditorHeaderSkeleton />

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isPending) return
    setConfirmOpen(nextOpen)
  }

  function handleDelete() {
    deleteTemplate(templateId, {
      onSuccess: () => {
        toast.add({
          title: "Template deleted",
          description: `"${name}" was removed.`,
          type: "success",
        })
      },
      onError: (error) => {
        toast.add({
          title: "Could not delete template",
          description: error.message,
          type: "error",
        })
      },
    })
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <DynamicIcon name={icon} fallback={() => <FaceSlightlySmiling />} />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{name}</h1>
          {description.trim() ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
        <AlertDialogTrigger
          render={<Button variant="destructive" size="sm" />}
        >
          <Trash2Icon data-icon="inline-start" />
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Days that already used this template keep
              their snapshots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault()
                handleDelete()
              }}
            >
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TemplateEditorHeader
