import { useId, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { SLOT_LABELS, type Slot } from "@/features/templates/types/slots"
import { useFetchTodos } from "@/features/todos/hooks/use-fetch-todos"
import { useCreateTodo } from "@/features/todos/hooks/use-create-todo"
import { formatTodoAssignment } from "@/features/todos/lib/format-todo-assignment"
import type { CreateTodoInput } from "@/features/todos/types/create-todo-input"
import type { Todo } from "@/features/todos/types/todo"
import { useDebounce } from "@/hooks/use-debounce"
import { useAssignTodo } from "@/features/day-plan/hooks/use-assign-todo"
import { useReassignTodo } from "@/features/day-plan/hooks/use-reassign-todo"
import { AddTodoCreateForm } from "./add-todo-create-form"
import { AddTodoTabs } from "./add-todo-tabs"
import { AddTodoToolbar } from "./add-todo-toolbar"

type AddTodoDialogProps = {
  slot: Slot
  dayPlanId: string
  nextSlotOrder: number
}

function isOnThisSlot(todo: Todo, dayPlanId: string, slot: Slot) {
  return (
    todo.assignment?.day_plan_id === dayPlanId && todo.assignment.slot === slot
  )
}

export function AddTodoDialog({
  slot,
  dayPlanId,
  nextSlotOrder,
}: AddTodoDialogProps) {
  const searchId = useId()
  const { data, isLoading } = useFetchTodos()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [todoToMove, setTodoToMove] = useState<Todo | null>(null)
  const debouncedQuery = useDebounce(searchQuery, 300)
  const query = (searchQuery.trim() === "" ? "" : debouncedQuery)
    .trim()
    .toLowerCase()
  const { mutateAsync: createTodo, isPending: isCreating } = useCreateTodo()
  const { mutateAsync: assignTodo, isPending: isAssigning } = useAssignTodo()
  const { mutateAsync: reassignTodo, isPending: isReassigning } =
    useReassignTodo()
  const isMutating = isCreating || isAssigning || isReassigning

  const filteredTodos = useMemo(() => {
    const todos = data ?? []
    return todos.filter((todo) => {
      if (todo.state !== "pending") return false
      if (isOnThisSlot(todo, dayPlanId, slot)) return false
      if (query === "") return true
      return todo.name.toLowerCase().includes(query)
    })
  }, [data, query, dayPlanId, slot])

  const unassignedTodos = filteredTodos.filter((todo) => !todo.assignment)
  const assignedTodos = filteredTodos.filter((todo) => todo.assignment)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearchQuery("")
      setTodoToMove(null)
    }
  }

  function assignHere(todo: Todo) {
    return assignTodo({ todo, dayPlanId, slot, slotOrder: nextSlotOrder })
  }

  function handleCreate(input: CreateTodoInput) {
    return toast
      .promise(
        createTodo(input).then((todo) => assignHere(todo)),
        {
          loading: { title: "Creating todo…" },
          success: { title: "Todo added" },
          error: { title: "Failed to create todo" },
        }
      )
      .then(() => {
        setOpen(false)
      })
  }

  function handleSelectUnassigned(todo: Todo) {
    toast
      .promise(assignHere(todo), {
        loading: { title: "Assigning todo…" },
        success: { title: "Todo assigned" },
        error: { title: "Failed to assign todo" },
      })
      .then(() => {
        setOpen(false)
      })
  }

  function handleSelectAssigned(todo: Todo) {
    setTodoToMove(todo)
  }

  function handleConfirmMove() {
    if (!todoToMove) return
    const todo = todoToMove
    toast
      .promise(
        reassignTodo({
          todo,
          dayPlanId,
          slot,
          slotOrder: nextSlotOrder,
        }),
        {
          loading: { title: "Moving todo…" },
          success: { title: "Todo moved" },
          error: { title: "Failed to move todo" },
        }
      )
      .then(() => {
        setTodoToMove(null)
        setOpen(false)
      })
  }

  const moveLabel = todoToMove?.assignment
    ? formatTodoAssignment(todoToMove.assignment)
    : ""

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button variant="secondary" />}>
          Add todo
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add todo · {SLOT_LABELS[slot]}</DialogTitle>
          </DialogHeader>
          <AddTodoCreateForm isPending={isMutating} onCreate={handleCreate} />
          <AddTodoToolbar
            searchId={searchId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <AddTodoTabs
            unassigned={unassignedTodos}
            assigned={assignedTodos}
            isLoading={isLoading}
            assignmentLabel={(todo) =>
              todo.assignment
                ? formatTodoAssignment(todo.assignment)
                : undefined
            }
            onSelectUnassigned={handleSelectUnassigned}
            onSelectAssigned={handleSelectAssigned}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={todoToMove !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setTodoToMove(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move this todo?</AlertDialogTitle>
            <AlertDialogDescription>
              {todoToMove
                ? `${todoToMove.name} is on ${moveLabel}. Move it here?`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReassigning}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isReassigning}
              onClick={(event) => {
                event.preventDefault()
                handleConfirmMove()
              }}
            >
              Move here
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
