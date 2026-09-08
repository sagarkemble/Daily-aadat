import { supabase } from "@/lib/supabase"
import { useMutation } from "@tanstack/react-query"

async function googleSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  })

  if (error) {
    throw error
  }

  return data
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: googleSignIn,
  })
}
