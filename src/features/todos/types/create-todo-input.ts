import { z } from "zod"

export const createTodoInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  icon: z.string().trim().min(1, "Icon is required").default("list-todo"),
  note: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
  priority: z.enum(["high", "medium", "low"]).optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
})

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>
export type CreateTodoFormInput = z.input<typeof createTodoInputSchema>
