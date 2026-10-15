import { z } from "zod"

export const createTodoInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
})

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>
