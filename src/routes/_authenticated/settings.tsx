import { useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"

import { PageHeader } from "@/components/page-header"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { useSettingsDialogStore } from "@/features/settings/stores/settings-dialog-store"

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  const open = useSettingsDialogStore((state) => state.open)
  const setOpen = useSettingsDialogStore((state) => state.setOpen)

  useEffect(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <PageShell className="pb-24">
      <PageHeader
        title="You"
        description="Account and appearance live in settings."
      />
      {!open ? (
        <Button onClick={() => setOpen(true)}>Open settings</Button>
      ) : null}
    </PageShell>
  )
}
