import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { emptySlotCounts } from "../lib/template-shape"
import type { Slot } from "../types/slots"
import type { Template, TemplateSummary } from "../types/template"

type FetchedTemplate = Template & {
  items: { slot: Slot }[] | null
}

async function fetchTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select(
      `
      id,
      user_id,
      name,
      icon,
      description,
      created_at,
      updated_at,
      items:template_items(slot)
    `
    )
    .order("name")

  if (error) throw error

  return ((data ?? []) as FetchedTemplate[]).map(toSummary)
}

function toSummary(row: FetchedTemplate): TemplateSummary {
  const slot_counts = emptySlotCounts()
  for (const item of row.items ?? []) {
    if (item.slot in slot_counts) slot_counts[item.slot] += 1
  }
  const { items: _, ...template } = row
  return { ...template, slot_counts }
}

export function useFetchTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  })
}
