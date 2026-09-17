import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { TemplateDetail } from "../types/template"

async function reorderTemplateItems(orderedIds: string[]) {
  const results = await Promise.all(
    orderedIds.map((id, sort_order) =>
      supabase.from("template_items").update({ sort_order }).eq("id", id)
    )
  )

  const firstError = results.find((result) => result.error)?.error
  if (firstError) throw firstError
}

export function useReorderTemplateItems(templateId: string) {
  const queryClient = useQueryClient()
  const queryKey = ["templates", templateId] as const

  return useMutation({
    mutationFn: reorderTemplateItems,
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<TemplateDetail>(queryKey)
      if (!previous) return { previous }

      const orderMap = new Map(orderedIds.map((id, index) => [id, index]))
      queryClient.setQueryData<TemplateDetail>(queryKey, {
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
