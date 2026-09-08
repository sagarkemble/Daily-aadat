import { supabase } from "@/lib/supabase"
import { useMutation } from "@tanstack/react-query"

async function resetPassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  if (error) {
    console.error("Error resetting password", error.message)
    throw error
  }
  return data
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  })
}
