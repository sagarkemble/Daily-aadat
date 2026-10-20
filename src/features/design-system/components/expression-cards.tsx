import { ArrowRightIcon, SunriseIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SLOT_SWATCHES } from "@/features/design-system/lib/slot-surfaces"
import { cn } from "@/lib/utils"

export function ExpressionCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {SLOT_SWATCHES.map((item) => (
        <Card key={item.slot} size="sm" className={cn(item.surface, "ring-0")}>
          <CardHeader>
            <CardTitle>{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-80">{item.copy}</p>
          </CardContent>
          <CardFooter className="border-0 bg-transparent">
            <Button size="sm">
              Open
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Card size="sm" className="sm:col-span-2 xl:col-span-5">
        <CardHeader>
          <CardTitle>Quiet chrome, loud content</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <SunriseIcon />
          <p className="max-w-prose text-sm text-muted-foreground">
            Nav, buttons, and fields stay ink. Colour lives on slots, activity
            tiles, and highlight cards, not on the brand chrome.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
