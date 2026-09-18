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
} | null

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
  template_items: TemplateItem[]
}

//example of the data being recived from database
// the template_items field is an array of TemplateItem objects
// each TemplateItem object has an activities field that is a TemplateItemActivity object
// {
//   "id": "t1",
//   "user_id": "u1",
//   "name": "Morning routine",
//   "icon": "sunrise",
//   "description": "Start the day well",
//   "created_at": "2026-09-18T10:00:00Z",
//   "updated_at": "2026-09-18T10:00:00Z",
//   "template_items": [
//     {
//       "id": "i1",
//       "template_id": "t1",
//       "activity_id": "a1",
//       "type": "timed",
//       "target": 10,
//       "unit": "min",
//       "slot": "morning",
//       "sort_order": 0,
//       "created_at": "...",
//       "updated_at": "...",
//       "activities": {
//         "id": "a1",
//         "name": "Meditation",
//         "icon": "lotus",
//         "suggested_type": "timed",
//         "suggested_target": 10,
//         "suggested_unit": "min"
//       }
//     },
//     {
//       "id": "i2",
//       "template_id": "t1",
//       "activity_id": "a2",
//       "type": "check",
//       "target": null,
//       "unit": null,
//       "slot": "morning",
//       "sort_order": 1,
//       "created_at": "...",
//       "updated_at": "...",
//       "activities": {
//         "id": "a2",
//         "name": "Make bed",
//         "icon": "bed",
//         "suggested_type": "check",
//         "suggested_target": null,
//         "suggested_unit": null
//       }
//     }
//   ]
// }
