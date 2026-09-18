/** Soft icon wells — coral · sage · mustard · sky · lavender */
const ICON_WELLS = [
  "bg-chart-1 text-foreground",
  "bg-chart-2 text-foreground",
  "bg-chart-3 text-foreground",
  "bg-chart-4 text-foreground",
  "bg-chart-5 text-foreground",
] as const

function stableIndex(seed: string, modulo: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % modulo
  }
  return hash
}

/** Stable pastel well from activity id so the grid feels varied, not grey. */
export function activityIconWellClass(seed: string) {
  return ICON_WELLS[stableIndex(seed, ICON_WELLS.length)]
}
