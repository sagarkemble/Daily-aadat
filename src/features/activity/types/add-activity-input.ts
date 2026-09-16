import { z } from "zod"

export const addActivityInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  suggested_type: z.enum(["check", "timed", "count"]),
  suggested_target: z.string().optional(),
  suggested_unit: z.string().optional(),
  note: z.string().optional(),
})

export type AddActivityInput = z.infer<typeof addActivityInputSchema>
