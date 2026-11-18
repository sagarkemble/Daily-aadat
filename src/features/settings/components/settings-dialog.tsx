import {
  KeyboardIcon,
  PaletteIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AccountPane } from "@/features/settings/components/account-pane"
import { AppearancePane } from "@/features/settings/components/appearance-pane"
import { PrivacyPane } from "@/features/settings/components/privacy-pane"
import { ShortcutsPane } from "@/features/settings/components/shortcuts-pane"
import { useFetchProfile } from "@/features/settings/hooks/use-fetch-profile"
import { useSettingsDialogStore } from "@/features/settings/stores/settings-dialog-store"

const PANES = [
  { id: "account", label: "Account", icon: UserIcon },
  { id: "appearance", label: "Appearance", icon: PaletteIcon },
  { id: "shortcuts", label: "Shortcuts", icon: KeyboardIcon },
  { id: "privacy", label: "Privacy", icon: ShieldIcon },
] as const

function SettingsDialog() {
  const open = useSettingsDialogStore((state) => state.open)
  const setOpen = useSettingsDialogStore((state) => state.setOpen)
  const pane = useSettingsDialogStore((state) => state.pane)
  const setPane = useSettingsDialogStore((state) => state.setPane)
  const { data: profile } = useFetchProfile()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="flex flex-col gap-0 overflow-hidden p-0 sm:h-[min(40rem,85vh)] sm:max-w-4xl"
      >
        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          <aside className="flex w-full shrink-0 flex-col gap-4 border-b p-4 sm:w-52 sm:border-r sm:border-b-0">
            <DialogHeader className="gap-1">
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Account, looks, shortcuts, and policies.
              </DialogDescription>
            </DialogHeader>
            <nav className="flex flex-row flex-wrap gap-1 sm:flex-col">
              {PANES.map((item) => {
                const Icon = item.icon
                const active = pane === item.id
                return (
                  <Button
                    key={item.id}
                    variant={active ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setPane(item.id)}
                  >
                    <Icon data-icon="inline-start" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </aside>
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-6 p-6">
              {pane === "account" ? <AccountPane profile={profile} /> : null}
              {pane === "appearance" ? <AppearancePane /> : null}
              {pane === "shortcuts" ? <ShortcutsPane /> : null}
              {pane === "privacy" ? <PrivacyPane /> : null}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { SettingsDialog }
