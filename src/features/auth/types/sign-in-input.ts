import { z } from "zod"

export const signInInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
})

export type SignInInput = z.infer<typeof signInInputSchema>
