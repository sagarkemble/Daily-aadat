import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ForgotPasswordInput } from "../types/forgot-password-input"

async function forgotPassword({ email }: ForgotPasswordInput) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) {
    throw error
  }
  return data
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  })
}
