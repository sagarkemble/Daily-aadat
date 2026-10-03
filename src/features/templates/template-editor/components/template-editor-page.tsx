import { useFetchTemplateDetail } from "../hooks/use-fetch-template-detail"
import { SLOTS } from "../../types/slots"
import { TemplateSlot } from "./template-slot"
import TemplateEditorHeader from "./template-editor-header"

type TemplateEditorProps = {
  templateId: string
}

const TemplateEditor = ({ templateId }: TemplateEditorProps) => {
  const { data, isLoading, error } = useFetchTemplateDetail(templateId)
  if (error) return <div>{error.message}</div>

  return (
    <div className="flex flex-col gap-4">
      <TemplateEditorHeader
        templateId={templateId}
        name={data?.name ?? ""}
        description={data?.description ?? ""}
        icon={data?.icon ?? ""}
        isLoading={isLoading}
      />

      {isLoading || !data
        ? null
        : SLOTS.map((slot) => (
            <TemplateSlot
              key={slot}
              templateId={templateId}
              slot={slot}
              activities={data.activities[slot] ?? []}
            />
          ))}
    </div>
  )
}

export default TemplateEditor
