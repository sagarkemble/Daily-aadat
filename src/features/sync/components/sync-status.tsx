import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSyncStatus } from "../hooks/use-sync-status"
import { refreshSyncedQueries } from "../lib/refresh-synced-queries"
import { syncCopy, syncPhase } from "../lib/sync-copy"
import { useSyncStore } from "../stores/sync-store"
import { SyncFace } from "./sync-face"

function SyncStatus() {
  const queryClient = useQueryClient()
  const { saving, lastSavedAt, lastKind, lastLevel } = useSyncStatus()
  const [refreshing, setRefreshing] = useState(false)
  const busy = saving || refreshing
  const phase = syncPhase({
    saving: busy,
    lastSavedAt,
    lastLevel,
  })
  const kind = refreshing ? "refresh" : saving ? "write" : lastKind
  const copy = syncCopy(phase, kind, lastSavedAt)
  const showRefreshHint = phase === "warning" || phase === "error"
  const ariaLabel = showRefreshHint
    ? `${copy.title}. ${copy.updated}. Click to ${copy.action.toLowerCase()}.`
    : `${copy.title}. ${copy.updated}.`

  async function handleRefresh() {
    if (busy) return
    setRefreshing(true)
    try {
      const ok = await refreshSyncedQueries(queryClient)
      if (ok) useSyncStore.getState().markSaved()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="relative overflow-visible [&_svg:not([class*='size-'])]:size-5"
              aria-label={ariaLabel}
              onClick={() => void handleRefresh()}
            />
          }
        >
          <SyncFace phase={phase} />
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="flex max-w-64 flex-col gap-1 text-left"
        >
          <span className="font-medium">{copy.title}</span>
          <span>{copy.updated}</span>
          {showRefreshHint ? (
            <span>Click to {copy.action.toLowerCase()}.</span>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { SyncStatus }
