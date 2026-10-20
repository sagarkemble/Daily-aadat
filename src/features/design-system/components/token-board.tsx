import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SLOT_SWATCHES } from "@/features/design-system/lib/slot-surfaces"

const chromeTokens = [
  { name: "background", swatch: "bg-background ring-1 ring-foreground/15" },
  { name: "foreground", swatch: "bg-foreground" },
  { name: "card", swatch: "bg-card ring-1 ring-foreground/15" },
  { name: "primary", swatch: "bg-primary" },
  { name: "secondary", swatch: "bg-secondary ring-1 ring-foreground/10" },
  { name: "muted", swatch: "bg-muted" },
  { name: "accent", swatch: "bg-accent" },
  { name: "destructive", swatch: "bg-destructive" },
  { name: "sidebar", swatch: "bg-sidebar ring-1 ring-foreground/15" },
  { name: "ink", swatch: "bg-ink" },
]

function Swatch({ name, swatch }: { name: string; swatch: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 shrink-0 rounded-lg ${swatch}`} />
      <p className="font-mono text-xs text-muted-foreground">{name}</p>
    </div>
  )
}

export function TokenBoard() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Chrome</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {chromeTokens.map((token) => (
            <Swatch key={token.name} {...token} />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Slots</CardTitle>
            <Badge variant="secondary">Expressive</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {SLOT_SWATCHES.map((item) => (
            <div
              key={item.slot}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${item.surface}`}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="font-mono text-xs opacity-70">{item.slot}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
