import { useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

function isDark() {
  return document.documentElement.classList.contains("dark")
}

/** Tracks the resolved theme class the ThemeProvider puts on <html>. */
export function useIsDark() {
  return useSyncExternalStore(subscribe, isDark, () => false)
}
