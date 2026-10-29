import { fetchTemplateDetail } from "@/features/templates/template-editor/hooks/use-fetch-template-detail"
import { SLOTS, TIMED_SLOTS, type Slot } from "@/features/templates/types/slots"
import type { TemplateDetail } from "@/features/templates/types/template"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ensureDayPlan } from "./ensure-day-plan"

export type ApplyTemplateMode = "merge" | "fresh"

function buildTemplateDayItems(
  dayPlanId: string,
  template: TemplateDetail,
  sortOrderForItem: (slot: Slot, templateSortOrder: number) => number
) {
  const templateItems = Object.values(template.activities).flatMap(
    (group) => group.activities
  )

  return templateItems.map((item) => {
    if (!item.activity) {
      throw new Error(`Activity missing for template item ${item.id}`)
    }

    return {
      day_plan_id: dayPlanId,
      kind: "activity" as const,
      activity_id: item.activity_id,
      name_snapshot: item.activity.name,
      icon_snapshot: item.activity.icon,
      type: item.type,
      target: item.target,
      unit: item.unit,
      slot: item.slot,
      sort_order: sortOrderForItem(item.slot, item.sort_order),
      state: "pending" as const,
      note_snapshot: item.note,
    }
  })
}

function buildSlotTimes(dayPlanId: string, template: TemplateDetail) {
  return TIMED_SLOTS.flatMap((slot) => {
    const group = template.activities[slot]
    if (!group.start_time || !group.end_time) return []
    return [
      {
        day_plan_id: dayPlanId,
        slot,
        start_time: group.start_time,
        end_time: group.end_time,
      },
    ]
  })
}

async function maxSortOrderBySlot(dayPlanId: string): Promise<Record<Slot, number>> {
  const { data, error } = await supabase
    .from("day_items")
    .select("slot, sort_order")
    .eq("day_plan_id", dayPlanId)
  if (error) throw error

  const maxBySlot = Object.fromEntries(
    SLOTS.map((slot) => [slot, -1])
  ) as Record<Slot, number>

  for (const row of data ?? []) {
    const slot = row.slot as Slot
    maxBySlot[slot] = Math.max(maxBySlot[slot], row.sort_order)
  }
  return maxBySlot
}

async function applyTemplateSlotTimes(
  dayPlanId: string,
  template: TemplateDetail,
  mode: ApplyTemplateMode
) {
  const slotTimes = buildSlotTimes(dayPlanId, template)

  if (mode === "fresh") {
    const { error: clearError } = await supabase
      .from("day_plan_slot_times")
      .delete()
      .eq("day_plan_id", dayPlanId)
    if (clearError) throw clearError
  }

  for (const row of slotTimes) {
    const { error } = await supabase.from("day_plan_slot_times").upsert(row, {
      onConflict: "day_plan_id,slot",
    })
    if (error) throw error
  }
}

async function applyTemplate({
  template_id,
  date,
  mode,
}: {
  template_id: string
  date: string
  mode: ApplyTemplateMode
}) {
  const template = await fetchTemplateDetail(template_id)
  const dayPlanId = await ensureDayPlan(date)

  const { error: updateError } = await supabase
    .from("day_plans")
    .update({ template_id })
    .eq("id", dayPlanId)
  if (updateError) throw updateError

  if (mode === "fresh") {
    const dayItems = buildTemplateDayItems(
      dayPlanId,
      template,
      (_slot, templateSortOrder) => templateSortOrder
    )

    let newIds: string[] = []
    if (dayItems.length > 0) {
      const { data: inserted, error: insertError } = await supabase
        .from("day_items")
        .insert(dayItems)
        .select("id")
      if (insertError) throw insertError
      newIds = (inserted ?? []).map((row) => row.id)
    }

    let deleteQuery = supabase
      .from("day_items")
      .delete()
      .eq("day_plan_id", dayPlanId)
      .eq("kind", "activity")

    if (newIds.length > 0) {
      deleteQuery = deleteQuery.not("id", "in", `(${newIds.join(",")})`)
    }

    const { error: deleteError } = await deleteQuery
    if (deleteError) throw deleteError

    await applyTemplateSlotTimes(dayPlanId, template, "fresh")
    return
  }

  const maxBySlot = await maxSortOrderBySlot(dayPlanId)
  const nextBySlot = { ...maxBySlot }
  const dayItems = buildTemplateDayItems(dayPlanId, template, (slot) => {
    nextBySlot[slot] += 1
    return nextBySlot[slot]
  })

  if (dayItems.length > 0) {
    const { error: insertError } = await supabase
      .from("day_items")
      .insert(dayItems)
    if (insertError) throw insertError
  }

  await applyTemplateSlotTimes(dayPlanId, template, "merge")
}

export function useApplyTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyTemplate,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["day-plan", variables.date] })
    },
  })
}
