import { supabase } from "@/lib/supabase"
import type { SignInInput } from "../types/sign-in-input"
import { useMutation } from "@tanstack/react-query"

async function signIn({ email, password }: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    throw error
  }
  return data
}
export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  })
}
