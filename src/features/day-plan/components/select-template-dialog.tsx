import { useEffect, useState } from "react"
import { LayoutTemplateIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { DynamicIcon } from "@/components/dynamic-icon"
import { useFetchTemplates } from "@/features/templates/hooks/use-fetch-templates"
import type { Template } from "@/features/templates/types/template"
import { useApplyTemplate } from "@/features/day-plan/hooks/use-apply-template"

type SelectTemplateDialogProps = {
  date: string
}

const SelectTemplateDialog = ({ date }: SelectTemplateDialogProps) => {
  const [open, setOpen] = useState(false)
  const { data, isLoading, error } = useFetchTemplates()
  const [isTemplateApplying, setIsTemplateApplying] = useState(false)
  const templates = data ?? []
  const { mutate: applyTemplate, isPending } = useApplyTemplate()

  useEffect(() => {
    if (!error) return
    toast.add({
      title: "Could not load templates",
      description: error.message,
      type: "error",
    })
  }, [error])

  function handleSelectTemplate(template: Template) {
    setIsTemplateApplying(true)
    applyTemplate({ template_id: template.id, date })
    setIsTemplateApplying(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Choose template
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a template</DialogTitle>
          <DialogDescription>
            Pick a template to apply to this day.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Could not load templates</EmptyTitle>
                <EmptyDescription>Try again in a moment.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : templates.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LayoutTemplateIcon />
                </EmptyMedia>
                <EmptyTitle>No templates</EmptyTitle>
                <EmptyDescription>
                  Create a template before applying one here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup>
              {templates.map((template) => (
                <Item
                  key={template.id}
                  variant="outline"
                  size="sm"
                  render={<button type="button" />}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <ItemMedia variant="icon">
                    <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
                      <DynamicIcon name={template.icon} />
                    </span>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{template.name}</ItemTitle>
                    {template.description.trim() ? (
                      <ItemDescription>{template.description}</ItemDescription>
                    ) : null}
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default SelectTemplateDialog
