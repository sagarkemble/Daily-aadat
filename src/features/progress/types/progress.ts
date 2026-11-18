export type ProgressRange = "week" | "month" | "year"

export type ProgressActivity = {
  id: string
  name: string
  icon: string
}

export type ProgressPlacement = {
  id: string
  activityId: string
  name: string
  icon: string
  skipped: boolean
  ticked: boolean
}

export type ProgressDay = {
  date: string
  placements: ProgressPlacement[]
}

export type DateBounds = {
  start: string
  end: string
}
