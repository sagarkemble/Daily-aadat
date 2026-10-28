import { useEffect, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { useUpdateDayItemNote } from "../hooks/use-update-day-item-note"

type DayActivityNoteProps = {
  itemId: string
  note: string | null
}

function DayActivityNote({ itemId, note }: DayActivityNoteProps) {
  const saved = note ?? ""
  const [value, setValue] = useState(saved)
  const { mutateAsync: updateNote, isPending } = useUpdateDayItemNote()

  useEffect(() => {
    setValue(saved)
  }, [saved])

  function commit() {
    const next = value.trim()
    const nextNote = next === "" ? null : next
    if ((nextNote ?? "") === saved) return
    toast.promise(updateNote({ id: itemId, note_snapshot: nextNote }), {
      loading: { title: "Saving note…" },
      success: { title: "Note saved" },
      error: { title: "Failed to save note" },
    })
  }

  return (
    <Field
      onPointerDown={(event) => event.stopPropagation()}
      data-disabled={isPending || undefined}
    >
      <FieldLabel htmlFor={`${itemId}-note`} className="sr-only">
        Note
      </FieldLabel>
      <Input
        id={`${itemId}-note`}
        value={value}
        placeholder="Add note"
        disabled={isPending}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur()
          }
        }}
      />
    </Field>
  )
}

export { DayActivityNote }
