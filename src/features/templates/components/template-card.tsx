import { Link } from "@tanstack/react-router"
import { DynamicIcon } from "@/components/dynamic-icon"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SLOT_COPY } from "@/features/day-plan/lib/slot-copy"
import { SLOT_LABELS } from "../types/slots"
import {
  activityCount,
  SLOT_STRIP_LABEL,
  stripSlotCounts,
} from "../lib/template-shape"
import type { TemplateSummary } from "../types/template"
import { cn } from "@/lib/utils"

const MAX_BARS = 6

export function TemplateCard({ template }: { template: TemplateSummary }) {
  const counts = stripSlotCounts(template)
  const total = activityCount(template)

  return (
    <Link
      to="/templates/$templateId"
      params={{ templateId: template.id }}
      className="min-w-0 rounded-xl outline-none transition-transform duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.99]"
    >
      <Card className="transition-colors duration-100 ease-out hover:bg-surface-hover-card">
        <CardHeader>
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-icon-well text-foreground">
              <DynamicIcon name={template.icon} size="lg" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <CardTitle className="truncate">{template.name}</CardTitle>
              <CardDescription className="line-clamp-1">
                {template.description.trim() || "No description yet"}
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <div className="flex flex-col items-end">
              <span className="text-2xl leading-none font-medium tabular-nums">
                {total}
              </span>
              <span className="text-[11px] text-muted-foreground">
                activities
              </span>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-6 gap-1"
            role="img"
            aria-label={counts
              .map(({ slot, count }) => `${SLOT_LABELS[slot]}: ${count}`)
              .join(", ")}
          >
            {counts.map(({ slot, count }) => (
              <div key={slot} className="flex min-w-0 flex-col gap-1.5">
                <div className="flex h-8 items-end gap-0.5 rounded-md bg-muted p-1">
                  {Array.from({
                    length: Math.min(count, MAX_BARS),
                  }).map((_, index) => (
                    <span
                      key={index}
                      className="h-full flex-1 rounded-sm"
                      style={{ backgroundColor: SLOT_COPY[slot].sky }}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    "truncate text-[11px]",
                    count > 0
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                  )}
                >
                  {SLOT_STRIP_LABEL[slot]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
