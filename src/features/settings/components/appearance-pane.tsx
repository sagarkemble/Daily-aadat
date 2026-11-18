import { useState } from "react"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import {
  LOOK_STORAGE_KEY,
  LOOKS,
  readStoredLook,
  type LookId,
} from "@/features/settings/lib/looks"

function AppearancePane() {
  const { setTheme } = useTheme()
  const [look, setLook] = useState<LookId>(() => readStoredLook())

  function pickLook(id: LookId) {
    const next = LOOKS.find((item) => item.id === id)
    if (!next) return
    localStorage.setItem(LOOK_STORAGE_KEY, id)
    document.documentElement.dataset.look = id
    setTheme(next.theme)
    setLook(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-base font-medium">Looks</h2>
        <p className="text-sm text-muted-foreground">
          Packed themes. The strip below is a future editor, not live.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LOOKS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => pickLook(item.id)}
            className="flex flex-col gap-2 rounded-xl p-2 text-left ring-1 ring-foreground/10 hover:bg-muted"
            style={{
              outline:
                look === item.id ? "2px solid var(--foreground)" : undefined,
            }}
          >
            <div
              className="flex h-16 flex-col justify-end overflow-hidden rounded-lg p-2"
              style={{ background: item.bg, color: item.fg }}
            >
              <div className="flex gap-1">
                {item.slots.map((slot) => (
                  <span
                    key={slot}
                    className="h-5 flex-1 rounded-sm"
                    style={{ background: slot }}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-xs text-muted-foreground">{item.blurb}</span>
          </button>
        ))}
      </div>
      <div className="pointer-events-none flex flex-col gap-3 rounded-xl bg-muted/60 p-3 ring-1 ring-foreground/10">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium">Edit look</p>
          <Badge variant="secondary">Soon</Badge>
        </div>
        <div className="flex flex-wrap items-end gap-4 opacity-80">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Accent</span>
            <div className="flex gap-1">
              {[
                "oklch(0.7 0.18 30)",
                "oklch(0.75 0.16 95)",
                "oklch(0.72 0.14 145)",
                "oklch(0.7 0.12 220)",
                "oklch(0.68 0.16 300)",
                "oklch(0.72 0.16 350)",
              ].map((color) => (
                <span
                  key={color}
                  className="size-5 rounded-full"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Base</span>
            <div className="flex h-5 w-28 overflow-hidden rounded-full">
              <span className="flex-1 bg-muted-foreground/20" />
              <span className="flex-1 bg-muted-foreground/40" />
              <span className="flex-1 bg-muted-foreground/70" />
              <span className="flex-1 bg-foreground" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Font</span>
            <span className="rounded-md border border-input px-2 py-1 text-xs">
              Geist
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Radius</span>
            <span className="rounded-md border border-input px-2 py-1 text-xs">
              M
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Theme</span>
            <span className="rounded-md border border-input px-2 py-1 text-xs">
              Default
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AppearancePane }
