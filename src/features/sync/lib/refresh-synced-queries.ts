import type { QueryClient } from "@tanstack/react-query"

import { dayPlanQueryKey, todosQueryKey } from "@/lib/query-keys"
import { getErrorMessage } from "./get-error-message"
import { useSyncStore } from "../stores/sync-store"

function syncedQueriesHaveError(queryClient: QueryClient) {
  return queryClient
    .getQueryCache()
    .findAll({
      predicate: (query) =>
        query.queryKey[0] === todosQueryKey[0] ||
        query.queryKey[0] === dayPlanQueryKey[0],
    })
    .some((query) => query.state.status === "error")
}

async function refreshSyncedQueries(queryClient: QueryClient) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    useSyncStore.getState().markWarning("Couldn't reach the server")
    return false
  }

  useSyncStore.getState().clearError()
  try {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: todosQueryKey }),
      queryClient.invalidateQueries({ queryKey: dayPlanQueryKey }),
    ])
  } catch (error) {
    useSyncStore.getState().markWarning(getErrorMessage(error))
    return false
  }

  if (syncedQueriesHaveError(queryClient)) {
    useSyncStore.getState().markWarning("Couldn't reach the server")
    return false
  }

  return true
}

export { refreshSyncedQueries }
