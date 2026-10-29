import type { Slot } from "@/features/templates/types/slots"
import { supabase } from "@/lib/supabase"

async function nextSlotSortOrder(
  dayPlanId: string,
  slot: Slot
): Promise<number> {
  const { data, error } = await supabase
    .from("day_items")
    .select("sort_order")
    .eq("day_plan_id", dayPlanId)
    .eq("slot", slot)
  if (error) throw error
  const orders = (data ?? []).map((row) => row.sort_order)
  if (orders.length === 0) return 0
  return Math.max(...orders) + 1
}

export { nextSlotSortOrder }
