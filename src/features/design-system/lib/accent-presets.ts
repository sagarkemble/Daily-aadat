export type AccentPreset = {
  id: string
  label: string
  /** Tailwind colour this pick is based on. */
  source: string
  swatch: string
  foreground: string
}

const ink = "oklch(0.16 0.02 80)"
const cream = "oklch(0.98 0.01 95)"

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: "ink",
    label: "Ink",
    source: "current",
    swatch: "var(--ink)",
    foreground: cream,
  },
  {
    id: "yellow",
    label: "Yellow",
    source: "yellow-400",
    swatch: "oklch(0.852 0.199 91.936)",
    foreground: ink,
  },
  {
    id: "amber",
    label: "Amber",
    source: "amber-400",
    swatch: "oklch(0.828 0.189 84.429)",
    foreground: ink,
  },
  {
    id: "orange",
    label: "Orange",
    source: "orange-400",
    swatch: "oklch(0.75 0.183 55.934)",
    foreground: ink,
  },
  {
    id: "lime",
    label: "Lime",
    source: "lime-400",
    swatch: "oklch(0.841 0.238 128.85)",
    foreground: ink,
  },
  {
    id: "teal",
    label: "Teal",
    source: "teal-400",
    swatch: "oklch(0.777 0.152 181.912)",
    foreground: ink,
  },
  {
    id: "sky",
    label: "Sky",
    source: "sky-400",
    swatch: "oklch(0.746 0.16 232.661)",
    foreground: ink,
  },
  {
    id: "violet",
    label: "Violet",
    source: "violet-400",
    swatch: "oklch(0.702 0.183 293.541)",
    foreground: cream,
  },
  {
    id: "rose",
    label: "Rose",
    source: "rose-400",
    swatch: "oklch(0.712 0.194 13.428)",
    foreground: cream,
  },
  {
    id: "stone",
    label: "Stone",
    source: "stone-400",
    swatch: "oklch(0.709 0.01 56.259)",
    foreground: ink,
  },
]

export function accentTokens(
  preset: AccentPreset
): Record<string, string> | undefined {
  if (preset.id === "ink") return undefined
  return {
    "--primary": preset.swatch,
    "--primary-foreground": preset.foreground,
    "--ring": preset.swatch,
    "--accent": `color-mix(in oklch, ${preset.swatch} 22%, var(--muted))`,
    "--accent-foreground": "var(--foreground)",
    "--sidebar-primary": preset.swatch,
    "--sidebar-primary-foreground": preset.foreground,
  }
}
