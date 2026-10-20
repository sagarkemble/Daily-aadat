import { createFileRoute } from "@tanstack/react-router"

import { DesignSystemPage } from "@/features/design-system/components/design-system-page"

export const Route = createFileRoute("/_authenticated/design-system")({
  component: DesignSystemPage,
})
