import React from "react"
import { useFetchTemplateDetail } from "../../hooks/use-fetch-template-detail"
import { toast } from "@/components/ui/toast"
import { SLOTS } from "../../types/slots"
import { TemplateSlot } from "./template-slot"

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

  console.log(data)

  return (
    <div className="flex flex-col gap-4">
      {SLOTS.map((slot) => (
        <TemplateSlot
          key={slot}
          templateId={templateId}
          slot={slot}
          activities={data?.activities[slot] ?? []}
        />
      ))}
    </div>
  )
}

export default TemplateEditor
