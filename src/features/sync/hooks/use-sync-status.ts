import { useEffect } from "react"
import { useIsMutating, useMutationState } from "@tanstack/react-query"

import { syncMutationKey } from "@/lib/query-keys"
import { useSyncStore } from "../stores/sync-store"

function useSyncStatus() {
  const mutating = useIsMutating({ mutationKey: syncMutationKey })
  const pausedCount = useMutationState({
    filters: { mutationKey: syncMutationKey },
    select: (mutation) => mutation.state.isPaused,
  }).filter(Boolean).length
  const saving = mutating - pausedCount > 0
  const lastSavedAt = useSyncStore((state) => state.lastSavedAt)
  const lastError = useSyncStore((state) => state.lastError)
  const lastKind = useSyncStore((state) => state.lastKind)
  const lastLevel = useSyncStore((state) => state.lastLevel)

  useEffect(() => {
    if (pausedCount === 0) return
    if (useSyncStore.getState().lastLevel === "error") return
    useSyncStore.getState().markError("Couldn't reach the server")
  }, [pausedCount])

  return { saving, lastSavedAt, lastError, lastKind, lastLevel }
}

export { useSyncStatus }
