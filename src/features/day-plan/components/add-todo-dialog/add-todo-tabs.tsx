import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Todo } from "@/features/todos/types/todo"
import { AddTodoPickerList } from "./add-todo-picker-list"

type AddTodoTabsProps = {
  unassigned: Todo[]
  assigned: Todo[]
  isLoading: boolean
  assignmentLabel?: (todo: Todo) => string | undefined
  onSelectUnassigned: (todo: Todo) => void
  onSelectAssigned: (todo: Todo) => void
}

export function AddTodoTabs({
  unassigned,
  assigned,
  isLoading,
  assignmentLabel,
  onSelectUnassigned,
  onSelectAssigned,
}: AddTodoTabsProps) {
  return (
    <Tabs defaultValue="unassigned">
      <TabsList className="w-full">
        <TabsTrigger value="unassigned">Not assigned</TabsTrigger>
        <TabsTrigger value="assigned">Assigned</TabsTrigger>
      </TabsList>
      <TabsContent value="unassigned">
        <AddTodoPickerList
          todos={unassigned}
          isLoading={isLoading}
          emptyTitle="No open todos"
          emptyDescription="Create one, or they are already on a day."
          onSelect={onSelectUnassigned}
        />
      </TabsContent>
      <TabsContent value="assigned">
        <AddTodoPickerList
          todos={assigned}
          isLoading={isLoading}
          emptyTitle="Nothing assigned"
          emptyDescription="Open todos on other days or slots will show here."
          assignmentLabel={assignmentLabel}
          onSelect={onSelectAssigned}
        />
      </TabsContent>
    </Tabs>
  )
}
