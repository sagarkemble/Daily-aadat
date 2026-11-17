import { formatDistanceToNow } from "date-fns"

import type { SyncKind } from "../stores/sync-store"

type SyncPhase = "idle" | "saving" | "saved" | "warning" | "error"

function lastUpdatedLine(lastSavedAt: number | null) {
  if (lastSavedAt == null) return "Nothing saved this session yet"
  return `Last updated ${formatDistanceToNow(lastSavedAt, { addSuffix: true })}`
}

function syncPhase(input: {
  saving: boolean
  lastSavedAt: number | null
  lastLevel: "error" | "warning" | null
}): SyncPhase {
  if (input.saving) return "saving"
  if (input.lastLevel === "error") return "error"
  if (input.lastLevel === "warning") return "warning"
  if (input.lastSavedAt) return "saved"
  return "idle"
}

function syncCopy(
  phase: SyncPhase,
  kind: SyncKind,
  lastSavedAt: number | null
) {
  const updated = lastUpdatedLine(lastSavedAt)

  if (phase === "saving" && kind === "refresh") {
    return {
      title: "Refreshing",
      action: "Refreshing",
      updated,
    }
  }
  if (phase === "saving") {
    return {
      title: "Saving",
      action: "Saving",
      updated,
    }
  }
  if (phase === "warning") {
    return {
      title: "Couldn't refresh",
      action: "Retry refresh",
      updated,
    }
  }
  if (phase === "error") {
    return {
      title: "Couldn't save",
      action: "Refresh from server",
      updated,
    }
  }
  if (phase === "saved") {
    return {
      title: "Saved",
      action: "Refresh from server",
      updated,
    }
  }
  return {
    title: "Up to date",
    action: "Refresh from server",
    updated,
  }
}

export { lastUpdatedLine, syncPhase, syncCopy }
export type { SyncPhase }
