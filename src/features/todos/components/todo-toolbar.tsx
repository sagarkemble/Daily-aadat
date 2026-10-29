import { useEffect, useId, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ArrowUpDownIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"
import {
  ALL_TODO_GROUPS,
  ALL_TODO_PRIORITIES,
  type TodoListFilters,
} from "../lib/filter-todos"
import {
  TODO_GROUP_LABELS,
  type TodoGroup,
} from "../lib/todo-groups"
import { TODO_PRIORITY_LABELS } from "../lib/todo-priority"
import {
  DEFAULT_TODO_LIST_SORT,
  TODO_LIST_SORT_LABELS,
  TODO_LIST_SORTS,
  type TodoListSort,
} from "../lib/sort-todos"
import type { TodoPriority } from "../types/todo"
import { CreateTodoDialog } from "./create-todo-dialog"

const sortSelectItems = TODO_LIST_SORTS.map((value) => ({
  value,
  label: TODO_LIST_SORT_LABELS[value],
}))

type TodoToolbarProps = {
  filters: TodoListFilters
}

function selectedSet<T extends string>(
  all: readonly T[],
  selected: T[] | undefined
): Set<T> {
  return new Set(selected?.length ? selected : all)
}

function filterLabel(
  allCount: number,
  selectedCount: number,
  name: string
): string {
  if (selectedCount === allCount) return name
  return `${name} (${selectedCount})`
}

function TodoToolbar({ filters }: TodoToolbarProps) {
  const navigate = useNavigate()
  const searchId = useId()
  const [query, setQuery] = useState(filters.q ?? "")
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const next = debouncedQuery.trim()
    const current = filters.q?.trim() ?? ""
    if (next === current) return
    void navigate({
      to: "/todos",
      search: {
        ...filters,
        q: next === "" ? undefined : next,
      },
    })
  }, [debouncedQuery, filters, navigate])

  const statusSet = selectedSet(ALL_TODO_GROUPS, filters.status)
  const prioritySet = selectedSet(ALL_TODO_PRIORITIES, filters.priority)

  function updateStatus(group: TodoGroup, checked: boolean) {
    const next = new Set(statusSet)
    if (checked) next.add(group)
    else next.delete(group)
    const values = ALL_TODO_GROUPS.filter((item) => next.has(item))
    void navigate({
      to: "/todos",
      search: {
        ...filters,
        status: values.length === ALL_TODO_GROUPS.length ? undefined : values,
      },
    })
  }

  function updatePriority(priority: TodoPriority, checked: boolean) {
    const next = new Set(prioritySet)
    if (checked) next.add(priority)
    else next.delete(priority)
    const values = ALL_TODO_PRIORITIES.filter((item) => next.has(item))
    void navigate({
      to: "/todos",
      search: {
        ...filters,
        priority:
          values.length === ALL_TODO_PRIORITIES.length ? undefined : values,
      },
    })
  }

  const sort = filters.sort ?? DEFAULT_TODO_LIST_SORT

  function updateSort(nextSort: TodoListSort) {
    void navigate({
      to: "/todos",
      search: {
        ...filters,
        sort: nextSort === DEFAULT_TODO_LIST_SORT ? undefined : nextSort,
      },
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h1 className="text-lg font-medium">Todos</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <InputGroup className="sm:min-w-56 sm:flex-1">
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id={searchId}
            value={query}
            placeholder="Search todos"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search todos"
          />
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            {filterLabel(
              ALL_TODO_GROUPS.length,
              statusSet.size,
              "Status"
            )}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {ALL_TODO_GROUPS.map((group) => (
                <DropdownMenuCheckboxItem
                  key={group}
                  checked={statusSet.has(group)}
                  onCheckedChange={(checked) =>
                    updateStatus(group, checked === true)
                  }
                >
                  {TODO_GROUP_LABELS[group]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            {filterLabel(
              ALL_TODO_PRIORITIES.length,
              prioritySet.size,
              "Priority"
            )}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {ALL_TODO_PRIORITIES.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={prioritySet.has(priority)}
                  onCheckedChange={(checked) =>
                    updatePriority(priority, checked === true)
                  }
                >
                  {TODO_PRIORITY_LABELS[priority]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          items={sortSelectItems}
          value={sort}
          onValueChange={(value) => {
            if (value == null) return
            updateSort(value as TodoListSort)
          }}
        >
          <SelectTrigger className="w-40" aria-label="Sort todos">
            <ArrowUpDownIcon />
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            align="start"
            alignItemWithTrigger={false}
          >
            <SelectGroup>
              {sortSelectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <CreateTodoDialog />
      </div>
    </div>
  )
}

export { TodoToolbar }
