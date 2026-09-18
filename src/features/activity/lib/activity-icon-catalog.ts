import { iconNames } from "lucide-react/dynamic"

/** Habit-first defaults shown before search. Stored values stay Lucide kebab-case. */
const FEATURED_CANDIDATES = [
  "circle-dashed",
  "sunrise",
  "sun",
  "moon",
  "moon-star",
  "alarm-clock",
  "clock",
  "hourglass",
  "timer",
  "bed-double",
  "shower-head",
  "brush",
  "sparkles",
  "shirt",
  "briefcase",
  "pill",
  "tablets",
  "stethoscope",
  "heart-pulse",
  "flame",
  "smartphone",
  "battery-charging",
  "phone-off",
  "mail",
  "power",
  "dumbbell",
  "activity",
  "footprints",
  "person-standing",
  "bike",
  "stretch-horizontal",
  "waves",
  "leaf",
  "trophy",
  "target",
  "coffee",
  "cup-soda",
  "glass-water",
  "droplets",
  "flask-conical",
  "egg",
  "utensils",
  "chef-hat",
  "salad",
  "cookie",
  "apple",
  "banana",
  "cherry",
  "citrus",
  "grape",
  "carrot",
  "pizza",
  "sandwich",
  "cake",
  "wine",
  "beer",
  "house",
  "sofa",
  "monitor",
  "brush-cleaning",
  "washing-machine",
  "shopping-cart",
  "trash",
  "flower-2",
  "paw-print",
  "dog",
  "cat",
  "laptop",
  "code",
  "terminal",
  "handshake",
  "book-open",
  "book",
  "library",
  "graduation-cap",
  "users",
  "video",
  "audio-lines",
  "calendar-check",
  "clipboard-list",
  "list-checks",
  "list-todo",
  "kanban",
  "pencil-ruler",
  "pen-line",
  "notebook-pen",
  "book-heart",
  "git-fork",
  "database",
  "car",
  "bus",
  "train-front",
  "plane",
  "rocket",
  "phone",
  "phone-call",
  "heart",
  "smile",
  "brain",
  "tv",
  "clapperboard",
  "film",
  "headphones",
  "music",
  "gamepad-2",
  "camera",
  "palette",
  "pause",
  "party-popper",
  "gift",
  "wallet",
  "piggy-bank",
  "map-pin",
  "compass",
  "mountain",
  "trees",
  "tent",
  "star",
  "zap",
  "check",
] as const

const KEYWORDS: Record<string, string[]> = {
  droplets: ["water", "hydrate", "drink"],
  "glass-water": ["water", "hydrate", "drink"],
  banana: ["fruit", "food", "snack"],
  apple: ["fruit", "food"],
  cherry: ["fruit", "food"],
  citrus: ["fruit", "orange", "lemon"],
  grape: ["fruit", "food"],
  carrot: ["veg", "food"],
  dumbbell: ["gym", "workout", "exercise"],
  activity: ["workout", "exercise", "health"],
  footprints: ["walk", "steps"],
  "person-standing": ["run", "walk", "standing"],
  "stretch-horizontal": ["stretch", "yoga"],
  leaf: ["yoga", "meditate", "nature"],
  "bed-double": ["sleep", "nap", "rest"],
  moon: ["sleep", "night", "wind down"],
  "moon-star": ["sleep", "night"],
  sunrise: ["wake", "morning"],
  sun: ["morning", "day"],
  "alarm-clock": ["wake", "alarm"],
  coffee: ["cafe", "drink"],
  "cup-soda": ["tea", "drink"],
  utensils: ["eat", "meal", "lunch", "dinner"],
  egg: ["breakfast", "food"],
  cookie: ["snack", "food"],
  pizza: ["food"],
  sandwich: ["food", "lunch"],
  "chef-hat": ["cook", "kitchen"],
  salad: ["meal prep", "food"],
  pill: ["medicine", "meds"],
  tablets: ["vitamins", "meds"],
  "heart-pulse": ["health", "cardio"],
  flame: ["puja", "prayer", "ritual"],
  smartphone: ["phone", "screen"],
  "phone-off": ["focus", "nofone"],
  laptop: ["work", "deep work"],
  code: ["coding", "dev"],
  "book-open": ["study", "read"],
  book: ["read"],
  "notebook-pen": ["journal", "write"],
  "book-heart": ["diary", "journal"],
  "paw-print": ["pet"],
  dog: ["pet"],
  cat: ["pet"],
  "gamepad-2": ["game", "play"],
  waves: ["swim", "pool"],
  bike: ["cycle", "ride"],
  "shopping-cart": ["groceries"],
  "washing-machine": ["laundry"],
  "brush-cleaning": ["clean", "desk"],
  trash: ["chores"],
  "flower-2": ["plants"],
  "party-popper": ["celebrate"],
  gift: ["present"],
  wallet: ["money", "spend"],
  "piggy-bank": ["save", "money"],
  brain: ["learn", "focus"],
  smile: ["mood", "gratitude"],
  headphones: ["podcast", "audio"],
  clapperboard: ["series", "watch"],
  film: ["movie"],
  tv: ["watch"],
  pause: ["break", "rest"],
  target: ["goal"],
  check: ["done", "habit"],
  "circle-dashed": ["default", "empty"],
}

const validNames = new Set<string>(iconNames)

export const FEATURED_ACTIVITY_ICONS = FEATURED_CANDIDATES.filter((name) =>
  validNames.has(name)
)

const featuredSet = new Set<string>(FEATURED_ACTIVITY_ICONS)

export const ACTIVITY_ICON_SEARCH_LIMIT = 96

export function searchActivityIcons(query: string): string[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return FEATURED_ACTIVITY_ICONS

  const hyphenQuery = trimmed.replace(/\s+/g, "-")
  const hits: string[] = []
  const seen = new Set<string>()

  function add(name: string) {
    if (seen.has(name) || !validNames.has(name)) return
    seen.add(name)
    hits.push(name)
  }

  for (const name of FEATURED_ACTIVITY_ICONS) {
    if (matchesIconQuery(name, trimmed, hyphenQuery)) add(name)
  }

  if (hits.length >= ACTIVITY_ICON_SEARCH_LIMIT) {
    return hits.slice(0, ACTIVITY_ICON_SEARCH_LIMIT)
  }

  for (const name of iconNames) {
    if (featuredSet.has(name)) continue
    if (matchesIconQuery(name, trimmed, hyphenQuery)) add(name)
    if (hits.length >= ACTIVITY_ICON_SEARCH_LIMIT) break
  }

  return hits
}

function matchesIconQuery(name: string, query: string, hyphenQuery: string) {
  if (name.includes(hyphenQuery) || name.replace(/-/g, " ").includes(query)) {
    return true
  }
  const keywords = KEYWORDS[name]
  if (!keywords) return false
  return keywords.some(
    (keyword) => keyword.includes(query) || query.includes(keyword)
  )
}
