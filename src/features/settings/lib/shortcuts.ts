export type Shortcut = {
  keys: string[]
  title: string
  detail: string
}

export const SHORTCUTS: Shortcut[] = [
  {
    keys: ["D"],
    title: "Toggle light and dark",
    detail: "Flips the look. Ignored while you are typing in a field.",
  },
]
