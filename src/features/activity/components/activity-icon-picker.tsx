import { useMemo, useState } from "react"
import { ChevronsUpDownIcon, SearchIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ActivityIcon } from "./activity-icon"
import { searchActivityIcons } from "../lib/activity-icon-catalog"

function iconFallback() {
  return <span className="size-4 rounded-sm bg-muted" />
}

function iconLabel(name: string) {
  return name.replace(/-/g, " ")
}

type ActivityIconPickerProps = {
  id?: string
  value: string
  onChange: (name: string) => void
  invalid?: boolean
}

export function ActivityIconPicker({
  id,
  value,
  onChange,
  invalid,
}: ActivityIconPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const results = useMemo(() => searchActivityIcons(query), [query])
  const selectedLabel = value ? iconLabel(value) : "Choose an icon"

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setQuery("")
  }

  function selectIcon(name: string) {
    onChange(name)
    setOpen(false)
    setQuery("")
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            id={id}
            variant="outline"
            aria-invalid={invalid || undefined}
            aria-label="Choose activity icon"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
          />
        }
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <ActivityIcon
            name={value || "circle-dashed"}
            className="size-4"
            fallback={iconFallback}
          />
        </span>
        <span className="min-w-0 flex-1 truncate text-left capitalize">
          {selectedLabel}
        </span>
        <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-2 p-2">
        <PopoverHeader className="sr-only">
          <PopoverTitle>Choose an icon</PopoverTitle>
          <PopoverDescription>
            Search Lucide icons and click one to select it.
          </PopoverDescription>
        </PopoverHeader>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault()
            }}
            placeholder="Search icons"
            aria-label="Search icons"
            autoComplete="off"
            className="pl-7"
          />
        </div>
        {results.length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-muted-foreground">
            No matching icons
          </p>
        ) : (
          <div className="grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto">
            {results.map((name) => {
              const selected = value === name
              return (
                <button
                  key={name}
                  type="button"
                  title={iconLabel(name)}
                  aria-label={iconLabel(name)}
                  aria-pressed={selected}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    selected && "bg-muted ring-1 ring-ring"
                  )}
                  onClick={() => selectIcon(name)}
                >
                  <ActivityIcon
                    name={name}
                    className="size-4"
                    fallback={iconFallback}
                  />
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
