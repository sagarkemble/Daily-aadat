import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import { profileQueryKey } from "@/lib/query-keys"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { assertOnline } from "@/features/sync/lib/assert-online"

type UpdateProfileInput = {
  displayName?: string
  avatarUrl?: string | null
  avatarPreset?: string | null
}

async function updateProfile(input: UpdateProfileInput) {
  assertOnline()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const user = userData.user
  if (!user) throw new Error("Not signed in")

  const nextMetadata = {
    ...user.user_metadata,
    full_name:
      input.displayName ??
      (typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : undefined),
    avatar_url:
      input.avatarUrl === undefined
        ? user.user_metadata.avatar_url
        : input.avatarUrl,
    avatar_preset:
      input.avatarPreset === undefined
        ? user.user_metadata.avatar_preset
        : input.avatarPreset,
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: nextMetadata,
  })
  if (authError) throw authError

  const patch: {
    display_name?: string
    avatar_url?: string | null
    updated_at: string
  } = { updated_at: new Date().toISOString() }
  if (input.displayName !== undefined) {
    patch.display_name = input.displayName
  }
  if (input.avatarUrl !== undefined) {
    patch.avatar_url = input.avatarUrl
  }

  const { error: rowError } = await supabase
    .from("users")
    .update(patch)
    .eq("id", user.id)
  if (rowError) throw rowError

  const { data: refreshed } = await supabase.auth.getUser()
  return refreshed.user
}

function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      if (user) setUser(user)
      void queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

export { useUpdateProfile }
