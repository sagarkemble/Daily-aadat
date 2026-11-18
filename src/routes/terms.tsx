import { createFileRoute } from "@tanstack/react-router"

import { LegalPage } from "@/features/settings/components/legal-page"

export const Route = createFileRoute("/terms")({
  component: TermsRoute,
})

function TermsRoute() {
  return <LegalPage kind="terms" />
}
