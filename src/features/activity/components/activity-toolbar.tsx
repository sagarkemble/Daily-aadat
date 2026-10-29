import { useId } from "react"
import { ListFilterIcon, SearchIcon } from "lucide-react"

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
import {
  ACTIVITY_TYPE_FILTER_LABELS,
  ACTIVITY_TYPE_FILTERS,
  isActivityTypeFilter,
  type ActivityTypeFilter,
} from "../lib/filter-activities"
import { AddActivityDialog } from "./add-activity-dialog"

const typeFilterItems = ACTIVITY_TYPE_FILTERS.map((value) => ({
  value,
  label: ACTIVITY_TYPE_FILTER_LABELS[value],
}))

type ActivityToolbarProps = {
  query: string
  type: ActivityTypeFilter
  onQueryChange: (query: string) => void
  onTypeChange: (type: ActivityTypeFilter) => void
}

function ActivityToolbar({
  query,
  type,
  onQueryChange,
  onTypeChange,
}: ActivityToolbarProps) {
  const searchId = useId()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h1 className="text-lg font-medium">Activities</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <InputGroup className="sm:min-w-56 sm:flex-1">
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id={searchId}
            value={query}
            placeholder="Search activities"
            onChange={(event) => onQueryChange(event.target.value)}
            aria-label="Search activities"
          />
        </InputGroup>
        <Select
          items={typeFilterItems}
          value={type}
          onValueChange={(value) => {
            if (value == null || !isActivityTypeFilter(value)) return
            onTypeChange(value)
          }}
        >
          <SelectTrigger className="w-40" aria-label="Filter by type">
            <ListFilterIcon />
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            align="start"
            alignItemWithTrigger={false}
          >
            <SelectGroup>
              {typeFilterItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <AddActivityDialog />
      </div>
    </div>
  )
}

export { ActivityToolbar }
