import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { TableCell, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  DUE_DATE_TONE_CLASS,
  formatDueDate,
} from "../lib/format-due-date"
import {
  TODO_PRIORITY_DOT_CLASS,
  TODO_PRIORITY_LABELS,
} from "../lib/todo-priority"
import { useChangeTodoState } from "../hooks/use-change-todo-state"
import { formatTodoAssignment } from "../lib/format-todo-assignment"
import type { Todo } from "../types/todo"
import { TodoAssignPopover } from "./todo-assign-popover"
import { TodoDetailDialog } from "./todo-detail-dialog"

type TodoTableRowProps = {
  todo: Todo
  disabled?: boolean
}

function TodoTableRow({ todo, disabled }: TodoTableRowProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const { mutateAsync: changeTodoState, isPending: isChanging } =
    useChangeTodoState()
  const muted = todo.state === "done" || todo.state === "skipped"
  const done = todo.state === "done"
  const skipped = todo.state === "skipped"
  const note = todo.note?.trim()
  const due = formatDueDate(todo.due_date, todo.state)
  const rowDisabled = disabled || isChanging

  function handleCheckedChange(checked: boolean) {
    toast.promise(
      changeTodoState({ id: todo.id, state: checked ? "done" : "pending" }),
      {
        loading: { title: "Updating…" },
        success: { title: "Todo updated" },
        error: { title: "Failed to update" },
      }
    )
  }

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => setDetailOpen(true)}
      >
        <TableCell onClick={(event) => event.stopPropagation()}>
          {skipped ? null : (
            <Checkbox
              checked={done}
              disabled={rowDisabled}
              onCheckedChange={handleCheckedChange}
              aria-label={done ? "Mark as open" : "Mark as done"}
            />
          )}
        </TableCell>
        <TableCell className="max-w-0 whitespace-normal">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span
              className={cn(
                "truncate font-medium",
                muted && "text-muted-foreground line-through"
              )}
            >
              {todo.name}
            </span>
            {note ? (
              <span className="truncate text-xs text-muted-foreground">
                {note}
              </span>
            ) : null}
          </div>
        </TableCell>
        <TableCell>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                muted
                  ? "bg-muted-foreground"
                  : TODO_PRIORITY_DOT_CLASS[todo.priority]
              )}
              aria-hidden
            />
            <span className={cn(muted && "text-muted-foreground")}>
              {TODO_PRIORITY_LABELS[todo.priority]}
            </span>
          </span>
        </TableCell>
        <TableCell>
          {due ? (
            <span
              className={cn(
                muted ? "text-muted-foreground" : DUE_DATE_TONE_CLASS[due.tone]
              )}
            >
              {due.label}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell onClick={(event) => event.stopPropagation()}>
          {todo.state === "pending" ? (
            <TodoAssignPopover todo={todo} disabled={rowDisabled} />
          ) : todo.assignment ? (
            <span className="text-muted-foreground text-sm">
              {formatTodoAssignment(todo.assignment)}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
      </TableRow>
      <TodoDetailDialog
        todo={todo}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}

export { TodoTableRow }
