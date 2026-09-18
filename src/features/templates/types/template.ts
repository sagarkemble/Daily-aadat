import type { ActivityType } from "@/features/activity/types/activity"
import type { Slot } from "./slots"

export type Template = {
  id: string
  user_id: string
  name: string
  icon: string
  description: string
  created_at: string
  updated_at: string
}

/** List row with nested count from Supabase `template_items(count)` */
export type TemplateListItem = Template & {
  item_count: number
}

/** Activity fields joined for live name/icon on template items */
export type TemplateItemActivity = {
  id: string
  name: string
  icon: string
  suggested_type: ActivityType
  suggested_target: number | null
  suggested_unit: string | null
}

export type TemplateItem = {
  id: string
  template_id: string
  activity_id: string
  type: ActivityType
  target: number | null
  unit: string | null
  slot: Slot
  sort_order: number
  created_at: string
  updated_at: string
  activities: TemplateItemActivity
}

export type TemplateDetail = Template & {
  items: TemplateItem[]
}
