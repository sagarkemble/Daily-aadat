import { useEffect, useState } from "react"

import type { DayPlanActivity } from "../types/day-plan"

function useTimedElapsedMs(activity: DayPlanActivity) {
  const running = activity.state === "running"
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, 1000)
    const first = setTimeout(tick, 0)
    return () => {
      clearInterval(id)
      clearTimeout(first)
    }
  }, [running])
  const banked = activity.duration ?? 0
  const session =
    running && activity.started_at
      ? now - new Date(activity.started_at).getTime()
      : 0
  return banked + Math.max(0, session)
}

function formatElapsed(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const mmss = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return h > 0 ? `${h}:${mmss}` : mmss
}

export { formatElapsed, useTimedElapsedMs }
