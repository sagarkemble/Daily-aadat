import { supabase } from "@/lib/supabase"
import { dayItemCommandMutationKey, dayPlanQueryKey } from "@/lib/query-keys"
import { assertOnline } from "@/features/sync/lib/assert-online"
import { getErrorMessage } from "@/features/sync/lib/get-error-message"
import {
  isCurrentSyncGeneration,
  nextSyncGeneration,
} from "@/features/sync/lib/sync-generation"
import { useSyncStore } from "@/features/sync/stores/sync-store"
import type { DayPlanActivity } from "../types/day-plan"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  patchDayPlanItem,
  restoreDayPlans,
  snapshotDayPlans,
} from "../lib/patch-day-plan-cache"

async function applyActivityCommand({
  activityId,
  activity,
}: {
  activityId: string
  activity: DayPlanActivity
}) {
  assertOnline()
  const { data, error } = await supabase
    .from("day_items")
    .update({
      state: activity.state,
      started_at: activity.started_at,
      stopped_at: activity.stopped_at,
      duration_ms: activity.duration,
      count_value: activity.count_value,
    })
    .eq("id", activityId)
  if (error) {
    throw error
  }
  return data
}

export function useApplyActivityCommand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: dayItemCommandMutationKey,
    mutationFn: applyActivityCommand,
    networkMode: "always",
    retry: 0,
    onMutate: async ({ activityId, activity }) => {
      useSyncStore.getState().clearError()
      const generation = nextSyncGeneration(activityId)
      const cancel = queryClient.cancelQueries({ queryKey: dayPlanQueryKey })
      const previousDayPlans = snapshotDayPlans(queryClient)
      patchDayPlanItem(queryClient, activityId, activity)
      await cancel
      return { previousDayPlans, generation, entityId: activityId }
    },
    onError: (error, _variables, context) => {
      if (
        !context ||
        !isCurrentSyncGeneration(context.entityId, context.generation)
      ) {
        return
      }
      restoreDayPlans(queryClient, context.previousDayPlans)
      useSyncStore.getState().markError(getErrorMessage(error))
    },
    onSuccess: (_data, _variables, context) => {
      if (
        !context ||
        !isCurrentSyncGeneration(context.entityId, context.generation)
      ) {
        return
      }
      useSyncStore.getState().markSaved()
    },
  })
}
