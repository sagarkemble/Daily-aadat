import { useEffect, useRef, useState } from "react"

import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"

import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import { toast } from "@/components/ui/toast"
import { SLOT_LABELS, SLOTS, type Slot } from "../../types/slots"
import type { NewTemplateActivity, TemplateBoard } from "../../types/template"
import TemplateEditorHeader from "./template-editor-header"
import { TemplateSlot } from "./template-slot"
import { useAddTemplateActivities } from "../hooks/use-add-template-activities"
import { useFetchTemplateDetail } from "../hooks/use-fetch-template-detail"
import { useReorderTemplateActivities } from "../hooks/use-reorder-template-activites"

type TemplateEditorProps = {
  templateId: string
}

const TemplateEditor = ({ templateId }: TemplateEditorProps) => {
  const { data, isLoading, error } = useFetchTemplateDetail(templateId)
  const { mutateAsync: reorderActivities } = useReorderTemplateActivities()
  const { mutateAsync: addActivities, isPending: isAdding } =
    useAddTemplateActivities()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [board, setBoard] = useState<TemplateBoard | undefined>(
    data?.activities
  )
  const boardRef = useRef(board)
  boardRef.current = board
  const isDragging = useRef(false)
  const snapshot = useRef(board)

  console.log("board", data)

  useEffect(() => {
    if (data && !isDragging.current) {
      setBoard(data.activities)
    }
  }, [data])

  if (error) return <div>{error.message}</div>

  function handleAddActivities(
    configured: ActivityWithConfiguration[],
    slot?: Slot
  ) {
    if (!slot) return
    const sortOrderStart = board?.[slot]?.activities.length ?? 0
    const items: NewTemplateActivity[] = configured.map((activity, index) => ({
      template_id: templateId,
      activity_id: activity.id,
      type: activity.type,
      target: activity.type === "count" ? activity.target : null,
      unit: activity.type === "count" ? activity.unit : null,
      slot,
      sort_order: sortOrderStart + index,
    }))
    toast.promise(addActivities(items), {
      loading: { title: "Adding activities…" },
      success: { title: "Activities added" },
      error: { title: "Failed to add activities" },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <TemplateEditorHeader
        templateId={templateId}
        name={data?.name ?? ""}
        description={data?.description ?? ""}
        icon={data?.icon ?? ""}
        isLoading={isLoading}
        onAddActivity={() => setPickerOpen(true)}
        isAddingActivity={isAdding}
      />
      <ActivityPickerDialog
        requireSlot
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onAdd={handleAddActivities}
        isPending={isAdding}
      />

      <DragDropProvider
        onDragStart={() => {
          isDragging.current = true
          snapshot.current = boardRef.current
        }}
        onDragOver={(event) => {
          setBoard((current) => {
            if (!current) return current
            const lists = Object.fromEntries(
              SLOTS.map((slot) => [slot, current[slot].activities])
            )
            const nextLists = move(lists, event)
            return Object.fromEntries(
              SLOTS.map((slot) => [
                slot,
                {
                  ...current[slot],
                  activities: nextLists[slot] ?? current[slot].activities,
                },
              ])
            ) as TemplateBoard
          })
        }}
        onDragEnd={(event) => {
          isDragging.current = false
          if (event.canceled) {
            setBoard(snapshot.current)
            return
          }

          const { source } = event.operation
          if (!isSortable(source)) return

          const next = boardRef.current
          if (!next) return

          const payload = SLOTS.flatMap((slot) =>
            (next[slot]?.activities ?? []).map((item, index) => ({
              ...item,
              slot,
              sort_order: index,
            }))
          )

          toast.promise(reorderActivities(payload), {
            loading: { title: "Reordering activities…" },
            success: { title: "Activities reordered" },
            error: { title: "Failed to reorder activities" },
          })
        }}
      >
        {SLOTS.map((slot) => (
          <TemplateSlot
            key={slot}
            id={slot}
            templateId={templateId}
            title={SLOT_LABELS[slot]}
            items={board?.[slot]?.activities ?? []}
            startTime={board?.[slot]?.start_time ?? null}
            endTime={board?.[slot]?.end_time ?? null}
            isLoading={isLoading}
          />
        ))}
      </DragDropProvider>
    </div>
  )
}

export default TemplateEditor
