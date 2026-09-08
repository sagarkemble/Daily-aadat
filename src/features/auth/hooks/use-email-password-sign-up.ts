import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { SignUpInput } from "../types/sign-up-input"

async function EmailPasswordSignUp({ email, password }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export function useEmailPasswordSignUp() {
  return useMutation({
    mutationFn: EmailPasswordSignUp,
  })
}
