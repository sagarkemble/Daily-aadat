import { createElement, Fragment } from "react"
import {
  CircleCheckIcon,
  HashIcon,
  TimerIcon,
  type LucideIcon,
} from "lucide-react"

export type ActivityType = "check" | "timed" | "count"
export type ActivitySource = "predefined" | "custom"

export const activityTypeLabels: Record<ActivityType, string> = {
  check: "Check",
  timed: "Timed",
  count: "Count",
}

export const activityTypeItems: {
  icon: LucideIcon
  label: string
  value: ActivityType
}[] = [
  {
    icon: CircleCheckIcon,
    label: activityTypeLabels.check,
    value: "check",
  },
  {
    icon: TimerIcon,
    label: activityTypeLabels.timed,
    value: "timed",
  },
  {
    icon: HashIcon,
    label: activityTypeLabels.count,
    value: "count",
  },
]

export function activityTypeSelectValue(value: ActivityType | null) {
  const selected = activityTypeItems.find((item) => item.value === value)
  if (!selected) return null
  return createElement(
    Fragment,
    null,
    createElement(selected.icon),
    selected.label
  )
}

export type Activity = {
  id: string
  user_id: string | null
  name: string
  icon: string
  suggested_type: ActivityType
  suggested_target: number | null
  suggested_unit: string | null
  source: ActivitySource
}

export type ActivityWithConfiguration = Activity & {
  type: ActivityType
  target: number | null
  unit: string | null
}
