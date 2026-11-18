export type LookId = "paper" | "ink" | "fog" | "high-contrast" | "dusk"

export type Look = {
  id: LookId
  name: string
  blurb: string
  theme: "dark" | "light" | "system"
  bg: string
  fg: string
  slots: [string, string, string]
}

export const LOOK_STORAGE_KEY = "aadat-look"

export const LOOKS: Look[] = [
  {
    id: "paper",
    name: "Paper",
    blurb: "Cream well, ink type.",
    theme: "light",
    bg: "oklch(0.97 0.008 90)",
    fg: "oklch(0.18 0.02 80)",
    slots: [
      "oklch(0.86 0.16 95)",
      "oklch(0.72 0.18 50)",
      "oklch(0.75 0.16 350)",
    ],
  },
  {
    id: "ink",
    name: "Ink",
    blurb: "Pitch well, cream type.",
    theme: "dark",
    bg: "oklch(0.08 0.004 80)",
    fg: "oklch(0.97 0.01 95)",
    slots: [
      "oklch(0.86 0.16 95)",
      "oklch(0.72 0.18 50)",
      "oklch(0.7 0.12 290)",
    ],
  },
  {
    id: "fog",
    name: "Fog",
    blurb: "Cool gray chrome.",
    theme: "light",
    bg: "oklch(0.94 0.01 250)",
    fg: "oklch(0.2 0.02 250)",
    slots: [
      "oklch(0.78 0.12 185)",
      "oklch(0.7 0.12 290)",
      "oklch(0.72 0.18 50)",
    ],
  },
  {
    id: "high-contrast",
    name: "High contrast",
    blurb: "Hard edges, high ink.",
    theme: "light",
    bg: "oklch(0.99 0 0)",
    fg: "oklch(0.05 0 0)",
    slots: ["oklch(0.7 0 0)", "oklch(0.45 0 0)", "oklch(0.2 0 0)"],
  },
  {
    id: "dusk",
    name: "Dusk",
    blurb: "Warm dark, quieter slots.",
    theme: "dark",
    bg: "oklch(0.16 0.02 60)",
    fg: "oklch(0.93 0.02 80)",
    slots: [
      "oklch(0.72 0.12 50)",
      "oklch(0.7 0.1 350)",
      "oklch(0.65 0.08 80)",
    ],
  },
]

export const AVATAR_PRESETS = [
  { id: "seed-1", bg: "oklch(0.86 0.16 95)" },
  { id: "seed-2", bg: "oklch(0.78 0.12 185)" },
  { id: "seed-3", bg: "oklch(0.75 0.16 350)" },
  { id: "seed-4", bg: "oklch(0.72 0.18 50)" },
  { id: "seed-5", bg: "oklch(0.7 0.12 290)" },
  { id: "seed-6", bg: "oklch(0.8 0.08 80)" },
] as const

export type AvatarPresetId = (typeof AVATAR_PRESETS)[number]["id"]

function isLookId(value: string | null): value is LookId {
  return LOOKS.some((look) => look.id === value)
}

function readStoredLook(): LookId {
  if (typeof window === "undefined") return "paper"
  const stored = localStorage.getItem(LOOK_STORAGE_KEY)
  return isLookId(stored) ? stored : "paper"
}

export { isLookId, readStoredLook }
