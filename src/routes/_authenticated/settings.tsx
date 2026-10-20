import { CircleUserIcon } from "lucide-react"
import { createFileRoute } from "@tanstack/react-router"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <Empty className="min-h-[50vh] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleUserIcon />
        </EmptyMedia>
        <EmptyTitle>Settings coming later</EmptyTitle>
        <EmptyDescription>
          Theme, account, and the rest of settings will land here on the phone.
          On desktop they will open from the user menu.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
