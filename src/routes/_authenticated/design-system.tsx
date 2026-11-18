import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { DesignSystemPage } from "@/features/design-system/components/design-system-page"
import {
  DEFAULT_LIBRARY_ID,
  isLibraryId,
} from "@/features/design-system/lib/library"

const searchSchema = z.object({
  component: z.string().optional(),
})

export const Route = createFileRoute("/_authenticated/design-system")({
  validateSearch: searchSchema,
  component: DesignSystemRoute,
})

function DesignSystemRoute() {
  const { component } = Route.useSearch()
  const id = isLibraryId(component) ? component : DEFAULT_LIBRARY_ID
  return <DesignSystemPage component={id} />
}
