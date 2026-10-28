import { useEffect, useId, useMemo, useState } from "react"
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
import { Field, FieldLegend, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SLOT_LABELS, SLOTS, type Slot } from "@/features/templates/types/slots"
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
  slot?: Slot
  dayPlanId: string
  nextSlotOrder: number | ((slot: Slot) => number)
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
  open,
  onOpenChange,
}: AddTodoDialogProps) {
  const searchId = useId()
  const { data, isLoading } = useFetchTodos()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen
  const [pickedSlot, setPickedSlot] = useState<Slot | undefined>(slot)
  const targetSlot = slot ?? pickedSlot
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
      if (targetSlot && isOnThisSlot(todo, dayPlanId, targetSlot)) return false
      if (query === "") return true
      return todo.name.toLowerCase().includes(query)
    })
  }, [data, query, dayPlanId, targetSlot])

  const unassignedTodos = filteredTodos.filter((todo) => !todo.assignment)
  const assignedTodos = filteredTodos.filter((todo) => todo.assignment)

  function handleOpenChange(nextOpen: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
    if (!nextOpen) {
      setSearchQuery("")
      setTodoToMove(null)
      setPickedSlot(slot)
    }
  }

  useEffect(() => {
    if (isOpen) setPickedSlot(slot)
  }, [isOpen, slot])

  function resolveOrder(nextSlot: Slot) {
    return typeof nextSlotOrder === "function"
      ? nextSlotOrder(nextSlot)
      : nextSlotOrder
  }

  function assignHere(todo: Todo) {
    if (!targetSlot) {
      throw new Error("Slot is required")
    }
    return assignTodo({
      todo,
      dayPlanId,
      slot: targetSlot,
      slotOrder: resolveOrder(targetSlot),
    })
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
        handleOpenChange(false)
      })
  }

  function handleSelectUnassigned(todo: Todo) {
    if (!targetSlot) return
    toast
      .promise(assignHere(todo), {
        loading: { title: "Assigning todo…" },
        success: { title: "Todo assigned" },
        error: { title: "Failed to assign todo" },
      })
      .then(() => {
        handleOpenChange(false)
      })
  }

  function handleSelectAssigned(todo: Todo) {
    if (!targetSlot) return
    setTodoToMove(todo)
  }

  function handleConfirmMove() {
    if (!todoToMove || !targetSlot) return
    const todo = todoToMove
    toast
      .promise(
        reassignTodo({
          todo,
          dayPlanId,
          slot: targetSlot,
          slotOrder: resolveOrder(targetSlot),
        }),
        {
          loading: { title: "Moving todo…" },
          success: { title: "Todo moved" },
          error: { title: "Failed to move todo" },
        }
      )
      .then(() => {
        setTodoToMove(null)
        handleOpenChange(false)
      })
  }

  const moveLabel = todoToMove?.assignment
    ? formatTodoAssignment(todoToMove.assignment)
    : ""

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {isControlled ? null : (
          <DialogTrigger render={<Button variant="secondary" />}>
            Add todo
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {targetSlot
                ? `Add todo · ${SLOT_LABELS[targetSlot]}`
                : "Add todo"}
            </DialogTitle>
          </DialogHeader>
          {slot == null ? (
            <FieldSet>
              <FieldLegend variant="label">Slot</FieldLegend>
              <Field>
                <ToggleGroup
                  value={pickedSlot ? [pickedSlot] : []}
                  onValueChange={(value) => {
                    const next = value[0]
                    setPickedSlot(
                      SLOTS.includes(next as Slot) ? (next as Slot) : undefined
                    )
                  }}
                  className="flex-wrap"
                  size="sm"
                >
                  {SLOTS.map((name) => (
                    <ToggleGroupItem key={name} value={name}>
                      {SLOT_LABELS[name]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            </FieldSet>
          ) : null}
          <AddTodoCreateForm
            isPending={isMutating || !targetSlot}
            onCreate={handleCreate}
          />
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
