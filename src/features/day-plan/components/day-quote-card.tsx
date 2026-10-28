import { Card, CardContent } from "@/components/ui/card"

type DayQuoteCardProps = {
  quote: string
}

function DayQuoteCard({ quote }: DayQuoteCardProps) {
  return (
    <Card size="sm" className="aspect-square w-full">
      <CardContent className="flex flex-1 flex-col justify-between">
        <span
          aria-hidden
          className="font-heading text-3xl leading-none text-muted-foreground"
        >
          “
        </span>
        <blockquote className="font-heading text-sm leading-snug font-medium whitespace-pre-line">
          {quote}
        </blockquote>
      </CardContent>
    </Card>
  )
}

export { DayQuoteCard }
