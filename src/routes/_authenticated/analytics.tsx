import { createFileRoute } from "@tanstack/react-router"

import { PageShell } from "@/components/page-shell"
import { ProgressPage } from "@/features/progress/components/progress-page"

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <PageShell className="pb-24">
      <ProgressPage />
    </PageShell>
  )
}
