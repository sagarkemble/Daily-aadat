# Visual system

Locked look for Daily Aadat. Source of truth in code: `src/index.css`. Live catalogue: `/design-system` (authenticated).

Copy these tokens onto `main` as-is. Do not replace brand primary with a saturated hue (yellow, coral, etc.). Saturated colour is for **slot fills**, not chrome.

## Taste

Quiet chrome, loud content. Dark well is near-black. Light well is warm cream. One typeface: Geist. Radius `--radius: 1rem`.

Primary (buttons, selected calendar day, checkbox) is **ink on cream** in light, **cream on ink** in dark — the cream reads as white. Hover/menu `--accent` stays a quiet gray wash, not a second brand colour.

Product words: Activity, Todo, Slot, Day plan.

## How to use

Semantic classes only: `bg-primary`, `text-ink`, `bg-slot-morning`. No raw `bg-[#…]`.

| Job | Token / class |
|-----|----------------|
| Page well | `bg-background` |
| Quiet cards, nav | `bg-card`, `bg-sidebar` |
| Default buttons | `variant` default → `bg-primary` |
| Text on slot fills | `text-ink` |
| Slot tiles | `bg-slot-early-morning` … `bg-slot-night` |

Slot mapping lives in `src/features/design-system/lib/slot-surfaces.ts` (`SLOT_SURFACE`). Not applied to live Day cards yet.

## Tokens (`src/index.css`)

Hue is warm (~80–95). Charts / slots are the same in light and dark.

### Light

| Token | Value | Role |
|-------|--------|------|
| `--background` | `oklch(0.97 0.008 90)` | Page |
| `--foreground` | `oklch(0.18 0.02 80)` | Body text |
| `--card` | `oklch(0.995 0.004 90)` | Raised surface |
| `--primary` | `oklch(0.18 0.02 80)` | Ink fill |
| `--primary-foreground` | `oklch(0.98 0.01 95)` | Cream on ink |
| `--accent` | `oklch(0.94 0.012 90)` | Quiet hover |
| `--sidebar` | `oklch(0.96 0.01 90)` | Nav well |
| `--ink` | `oklch(0.16 0.02 80)` | Type on slot fills |
| `--radius` | `1rem` | |

### Dark

| Token | Value | Role |
|-------|--------|------|
| `--background` | `oklch(0.08 0.004 80)` | Pitch well |
| `--foreground` | `oklch(0.97 0.01 95)` | Body text |
| `--card` | `oklch(0.13 0.006 80)` | Raised above well |
| `--primary` | `oklch(0.97 0.01 95)` | Cream / white fill |
| `--primary-foreground` | `oklch(0.08 0.004 80)` | Ink on cream |
| `--accent` | `oklch(0.16 0.006 80)` | Quiet hover |
| `--sidebar` | `oklch(0.06 0.003 80)` | Nav, darker than page |
| `--ink` | `oklch(0.16 0.02 80)` | Same as light |

`--ring` matches primary. Destructive stays red. `--muted` / `--secondary` stay gray, not brand.

### Slots (expression hues)

| Slot | Token | Chart | Hue |
|------|--------|-------|-----|
| early_morning | `--slot-early-morning` | `--chart-4` | teal |
| morning | `--slot-morning` | `--chart-1` | yellow |
| afternoon | `--slot-afternoon` | `--chart-2` | orange |
| evening | `--slot-evening` | `--chart-3` | pink |
| night | `--slot-night` | `--chart-5` | violet |

```
--chart-1: oklch(0.86 0.16 95);
--chart-2: oklch(0.72 0.18 50);
--chart-3: oklch(0.75 0.16 350);
--chart-4: oklch(0.78 0.12 185);
--chart-5: oklch(0.7 0.12 290);
```

`@theme inline` must keep `--color-ink` and `--color-slot-*` so Tailwind can emit `bg-ink` / `bg-slot-*`.

## Not this

- Saturated colour as `--primary` (yellow lab on `/design-system` is preview-only, default Ink).
- Colouring every button. Outline / ghost / fields stay quiet.
- Dual fonts, coral Structured homage, TickTick as a source.
- Clock timeline. Home stays five slots.

Press `d` to toggle light / dark (skipped while typing).
