import { useQuery } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import { profileQueryKey } from "@/lib/query-keys"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import type { Profile } from "@/features/settings/types/profile"

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, display_name, email, avatar_url, auth_source")
    .eq("id", userId)
    .maybeSingle()

  if (error) throw error
  return data as Profile | null
}

function useFetchProfile() {
  const userId = useAuthStore((state) => state.user?.id)
  return useQuery({
    queryKey: [...profileQueryKey, userId],
    queryFn: () => fetchProfile(userId as string),
    enabled: Boolean(userId),
  })
}

export { useFetchProfile }
