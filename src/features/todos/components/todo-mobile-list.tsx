import { useMemo, useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { useChangeTodoState } from "../hooks/use-change-todo-state"
import { sortFilteredTodos } from "../lib/sort-todos"
import type { Todo } from "../types/todo"
import { TodoAssignPopover } from "./todo-assign-popover"
import { TodoDetailDialog } from "./todo-detail-dialog"
import { TodoMeta } from "./todo-meta"

type TodoMobileListProps = {
  todos: Todo[]
}

function TodoMobileRow({ todo }: { todo: Todo }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const { mutateAsync: changeTodoState, isPending } = useChangeTodoState()
  const muted = todo.state === "done" || todo.state === "skipped"
  const done = todo.state === "done"
  const skipped = todo.state === "skipped"

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
      <Item
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setDetailOpen(true)}
      >
        <ItemContent className="min-w-0 gap-1">
          <div className="flex min-w-0 items-start gap-2">
            {!skipped ? (
              <Checkbox
                checked={done}
                disabled={isPending}
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={handleCheckedChange}
                aria-label={done ? "Mark as open" : "Mark as done"}
              />
            ) : null}
            <ItemTitle
              className={cn(
                "min-w-0 flex-1 truncate",
                muted && "text-muted-foreground line-through"
              )}
            >
              {todo.name}
            </ItemTitle>
          </div>
          <div
            className="flex flex-wrap items-center gap-2 pl-6"
            onClick={(event) => event.stopPropagation()}
          >
            <TodoMeta
              priority={todo.priority}
              dueDate={todo.due_date}
              state={todo.state}
              muted={muted}
            />
            {todo.state === "pending" ? (
              <TodoAssignPopover todo={todo} disabled={isPending} />
            ) : null}
          </div>
        </ItemContent>
      </Item>
      <TodoDetailDialog
        todo={todo}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}

function TodoMobileList({ todos }: TodoMobileListProps) {
  const sorted = useMemo(() => sortFilteredTodos(todos), [todos])

  return (
    <ItemGroup>
      {sorted.map((todo) => (
        <TodoMobileRow key={todo.id} todo={todo} />
      ))}
    </ItemGroup>
  )
}

export { TodoMobileList }
