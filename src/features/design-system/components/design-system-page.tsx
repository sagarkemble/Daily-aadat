import { useNavigate } from "@tanstack/react-router"

import { PageHeader } from "@/components/page-header"
import { LibraryShell } from "@/features/design-system/components/library-shell"
import type { LibraryId } from "@/features/design-system/lib/library"

export function DesignSystemPage({ component }: { component: LibraryId }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Components"
        description="Each primitive and every variant, using the current tokens."
      />
      <LibraryShell
        component={component}
        onComponentChange={(id) => {
          void navigate({
            to: "/design-system",
            search: { component: id },
          })
        }}
      />
    </div>
  )
}
