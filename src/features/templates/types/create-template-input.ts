import { z } from "zod"

export const createTemplateInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim(),
  icon: z.string().trim(),
})

export type CreateTemplateInput = z.infer<typeof createTemplateInputSchema>
