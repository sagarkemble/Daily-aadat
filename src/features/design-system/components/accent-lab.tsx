import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  ACCENT_PRESETS,
  type AccentPreset,
} from "@/features/design-system/lib/accent-presets"
import { cn } from "cn"

const sampleRange: DateRange = {
  from: new Date(2026, 9, 19),
  to: new Date(2026, 9, 23),
}

type AccentLabProps = {
  preset: AccentPreset
  onPresetChange: (id: string) => void
}

export function AccentLab({ preset, onPresetChange }: AccentLabProps) {
  const [singleDate, setSingleDate] = useState(new Date(2026, 9, 20))
  const [range, setRange] = useState<DateRange | undefined>(sampleRange)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Accent</CardTitle>
          <CardDescription>
            Click a swatch. Primary buttons, badges, checkboxes, rings, and
            selected calendar days follow it. Scoped to this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {ACCENT_PRESETS.map((item) => (
              <AccentSwatch
                key={item.id}
                preset={item}
                selected={item.id === preset.id}
                onSelect={onPresetChange}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {preset.label}
            {preset.source !== "current" ? ` · Tailwind ${preset.source}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Badge>Badge</Badge>
            <Field orientation="horizontal">
              <Checkbox id="ds-accent-done" defaultChecked />
              <FieldLabel htmlFor="ds-accent-done">Done</FieldLabel>
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Single</CardTitle>
            <CardDescription>Selected day uses primary.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={singleDate}
              onSelect={setSingleDate}
              weekStartsOn={1}
              required
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dropdown</CardTitle>
            <CardDescription>Month and year captions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={singleDate}
              onSelect={setSingleDate}
              captionLayout="dropdown"
              weekStartsOn={1}
              required
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Range</CardTitle>
            <CardDescription>Start and end use primary.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              weekStartsOn={1}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AccentSwatch({
  preset,
  selected,
  onSelect,
}: {
  preset: AccentPreset
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      aria-pressed={selected}
      onClick={() => onSelect(preset.id)}
      className={cn(selected && "ring-2 ring-foreground")}
    >
      <span
        className="size-4 rounded-md ring-1 ring-foreground/15"
        style={{ background: preset.swatch }}
      />
      {preset.label}
    </Button>
  )
}
