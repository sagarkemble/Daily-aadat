import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import { profileQueryKey } from "@/lib/query-keys"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { assertOnline } from "@/features/sync/lib/assert-online"

async function changePassword(password: string) {
  assertOnline()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

async function changeEmail(email: string) {
  assertOnline()
  const { error } = await supabase.auth.updateUser({ email })
  if (error) throw error
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (user) {
    await supabase
      .from("users")
      .update({ email, updated_at: new Date().toISOString() })
      .eq("id", user.id)
  }
}

async function linkGoogle() {
  assertOnline()
  const { error } = await supabase.auth.linkIdentity({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/settings`,
    },
  })
  if (error) throw error
}

async function unlinkGoogle() {
  assertOnline()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  const identity = data.user?.identities?.find(
    (item) => item.provider === "google"
  )
  if (!identity) throw new Error("Google is not linked")
  if ((data.user?.identities?.length ?? 0) < 2) {
    throw new Error("Add a password before unlinking Google")
  }
  const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity)
  if (unlinkError) throw unlinkError
  const { data: refreshed } = await supabase.auth.getUser()
  return refreshed.user
}

async function deleteAccount() {
  assertOnline()
  const { error } = await supabase.rpc("delete_own_account")
  if (error) throw error
  await supabase.auth.signOut()
}

function useChangePassword() {
  return useMutation({ mutationFn: changePassword })
}

function useChangeEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

function useLinkGoogle() {
  return useMutation({ mutationFn: linkGoogle })
}

function useUnlinkGoogle() {
  const setUser = useAuthStore((state) => state.setUser)
  return useMutation({
    mutationFn: unlinkGoogle,
    onSuccess: (user) => {
      if (user) setUser(user)
    },
  })
}

function useDeleteAccount() {
  const setUser = useAuthStore((state) => state.setUser)
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => setUser(null),
  })
}

export {
  useChangeEmail,
  useChangePassword,
  useDeleteAccount,
  useLinkGoogle,
  useUnlinkGoogle,
}
