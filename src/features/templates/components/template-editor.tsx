import React from "react"
import { useFetchTemplateDetail } from "../hooks/use-fetch-template-detail"
import { toast } from "@/components/ui/toast"

type TemplateEditorProps = {
  templateId: string
}

const TemplateEditor = ({ templateId }: TemplateEditorProps) => {
  const { data, isLoading, error } = useFetchTemplateDetail(templateId)
  if (isLoading) return <div>Loading...</div>
  if (error)
    toast.add({
      title: "Error",
      description: error.message,
      type: "error",
    })
  return <div>template-editor</div>
}

export default TemplateEditor
