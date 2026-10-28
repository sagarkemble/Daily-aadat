import { useState } from "react"
import { Trash2Icon } from "lucide-react"
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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useDeleteTemplate } from "../hooks/use-delete-template"

type DeleteTemplateDialogProps = {
  templateId: string
  name: string
  onDeleted?: () => void
}

function DeleteTemplateDialog({
  templateId,
  name,
  onDeleted,
}: DeleteTemplateDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate: deleteTemplate, isPending } = useDeleteTemplate()

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return
    setOpen(nextOpen)
  }

  function handleDelete() {
    deleteTemplate(templateId, {
      onSuccess: () => {
        toast.add({
          title: "Template deleted",
          description: `"${name}" was removed.`,
          type: "success",
        })
        setOpen(false)
        onDeleted?.()
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
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={<Button variant="destructive" disabled={isPending} />}
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
  )
}

export { DeleteTemplateDialog }
