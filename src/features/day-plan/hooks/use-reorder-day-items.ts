import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { dayPlanQueryKey } from "../lib/query-key"
import type { DayPlanDetail } from "../types/day-plan"

async function reorderDayItems(orderedIds: string[]) {
  const results = await Promise.all(
    orderedIds.map((id, sort_order) =>
      supabase.from("day_items").update({ sort_order }).eq("id", id)
    )
  )

  const firstError = results.find((result) => result.error)?.error
  if (firstError) throw firstError
}

export function useReorderDayItems(planDate: string) {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)
  const queryKey = dayPlanQueryKey(userId ?? "", planDate)

  return useMutation({
    mutationFn: reorderDayItems,
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<DayPlanDetail>(queryKey)
      if (!previous) return { previous }

      const orderMap = new Map(orderedIds.map((id, index) => [id, index]))
      queryClient.setQueryData<DayPlanDetail>(queryKey, {
        ...previous,
        items: previous.items.map((item) => {
          const sort_order = orderMap.get(item.id)
          return sort_order === undefined ? item : { ...item, sort_order }
        }),
      })

      return { previous }
    },
    onError: (_error, _orderedIds, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
