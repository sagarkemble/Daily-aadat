import { cn } from "@/lib/utils"
import {
  DUE_DATE_TONE_CLASS,
  formatDueDate,
} from "../lib/format-due-date"
import {
  TODO_PRIORITY_DOT_CLASS,
  TODO_PRIORITY_LABELS,
} from "../lib/todo-priority"
import type { TodoPriority, TodoState } from "../types/todo"

type TodoMetaProps = {
  priority: TodoPriority
  dueDate: string | null
  state: TodoState
  muted?: boolean
  showDueDate?: boolean
  className?: string
}

function TodoMeta({
  priority,
  dueDate,
  state,
  muted = false,
  showDueDate = true,
  className,
}: TodoMetaProps) {
  const due = showDueDate ? formatDueDate(dueDate, state) : null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs",
        muted && "text-muted-foreground",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            muted ? "bg-muted-foreground" : TODO_PRIORITY_DOT_CLASS[priority]
          )}
          aria-hidden
        />
        <span>{TODO_PRIORITY_LABELS[priority]}</span>
      </span>
      {due ? (
        <>
          <span className="text-muted-foreground" aria-hidden>
            ·
          </span>
          <span className={muted ? undefined : DUE_DATE_TONE_CLASS[due.tone]}>
            {due.label}
          </span>
        </>
      ) : null}
    </div>
  )
}

export { TodoMeta }
