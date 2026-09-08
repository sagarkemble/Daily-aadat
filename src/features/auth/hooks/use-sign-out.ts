import { supabase } from "@/lib/supabase"
import { useMutation } from "@tanstack/react-query"

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  })
}
