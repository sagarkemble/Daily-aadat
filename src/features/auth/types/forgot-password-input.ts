import { z } from "zod"

export const forgotPasswordInputSchema = z.object({
  email: z.email(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>
