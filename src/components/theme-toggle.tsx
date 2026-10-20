import { MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="outline"
      size="icon-lg"
      className="rounded-full"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        setTheme(isDark ? "light" : "dark")
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export { ThemeToggle }
