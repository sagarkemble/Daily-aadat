import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const COLOR_VARS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const

const TYPE_VARS = [
  "font-sans",
  "font-serif",
  "font-mono",
  "radius",
  "spacing",
  "tracking-normal",
] as const

function readVars(names: readonly string[]) {
  const styles = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    names.map((name) => [name, styles.getPropertyValue(`--${name}`).trim()])
  )
}

function useCssVars(names: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const read = () => setValues(readVars(names))
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [names])

  return values
}

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="size-10 shrink-0 rounded-lg ring-1 ring-border"
        style={{ backgroundColor: `var(--${name})` }}
      />
      <div className="min-w-0">
        <p className="font-mono text-xs">--{name}</p>
        <p className="truncate font-mono text-xs text-muted-foreground">
          {value || "—"}
        </p>
      </div>
    </div>
  )
}

export function TokenBoard() {
  const colors = useCssVars(COLOR_VARS)
  const type = useCssVars(TYPE_VARS)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Color</CardTitle>
          <CardDescription>
            Live values from <span className="font-mono">src/index.css</span>.
            Toggle light and dark on the bar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {COLOR_VARS.map((name) => (
            <ColorSwatch key={name} name={name} value={colors[name] ?? ""} />
          ))}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Type and radius</CardTitle>
            <CardDescription>Computed on the document root.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {TYPE_VARS.map((name) => (
              <div key={name} className="flex flex-col gap-1">
                <p className="font-mono text-xs">--{name}</p>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {type[name] || "—"}
                </p>
              </div>
            ))}
            <div className="flex flex-wrap items-end gap-3 pt-2">
              <div className="size-10 rounded-sm bg-muted ring-1 ring-border" />
              <div className="size-10 rounded-md bg-muted ring-1 ring-border" />
              <div className="size-10 rounded-lg bg-muted ring-1 ring-border" />
              <div className="size-10 rounded-xl bg-muted ring-1 ring-border" />
            </div>
            <p className="font-sans text-sm">Sans: The day is a list of placements.</p>
            <p className="font-serif text-sm">Serif: The day is a list of placements.</p>
            <p className="font-mono text-sm">Mono: --primary</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
