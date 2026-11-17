import { MoonIcon, SunIcon } from "lucide-react"
import { createFileRoute } from "@tanstack/react-router"

import { PageHeader } from "@/components/page-header"
import { PageShell } from "@/components/page-shell"
import { useTheme } from "@/components/theme-provider"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <PageShell>
      <PageHeader
        title="You"
        description="Theme lives here for now. More settings later."
      />
      <Field>
        <FieldLabel>Appearance</FieldLabel>
        <ToggleGroup
          value={[isDark ? "dark" : "light"]}
          onValueChange={(next) => {
            const picked = next[0]
            if (picked === "light" || picked === "dark") {
              setTheme(picked)
            }
          }}
          variant="outline"
        >
          <ToggleGroupItem value="light">
            <SunIcon />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark">
            <MoonIcon />
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </Field>
    </PageShell>
  )
}
