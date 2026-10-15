import { z } from "zod"

export const createTodoInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  icon: z.string().trim().min(1, "Icon is required").default("list-todo"),
})

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>
