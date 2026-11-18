import { upload } from "@imagekit/javascript"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import { profileQueryKey } from "@/lib/query-keys"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { fetchImagekitAuth } from "@/features/settings/lib/imagekit-auth"
import { assertOnline } from "@/features/sync/lib/assert-online"

const IMAGEKIT_FOLDER = "/daily-aadat"

async function uploadAvatar(file: File) {
  assertOnline()
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
  if (typeof publicKey !== "string" || publicKey.length === 0) {
    throw new Error("ImageKit public key is missing")
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const user = userData.user
  if (!user) throw new Error("Not signed in")

  const auth = await fetchImagekitAuth()
  const extension = file.name.split(".").pop() ?? "jpg"
  const result = await upload({
    file,
    fileName: `avatar-${user.id}.${extension}`,
    folder: IMAGEKIT_FOLDER,
    useUniqueFileName: true,
    publicKey,
    token: auth.token,
    expire: auth.expire,
    signature: auth.signature,
  })

  const avatarUrl = result.url
  if (!avatarUrl) throw new Error("Upload did not return a URL")

  const { error: authUpdateError } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      avatar_url: avatarUrl,
      avatar_preset: null,
    },
  })
  if (authUpdateError) throw authUpdateError

  const { error: rowError } = await supabase
    .from("users")
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
  if (rowError) throw rowError

  const { data: refreshed } = await supabase.auth.getUser()
  return { url: avatarUrl, user: refreshed.user }
}

function useUploadAvatar() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: ({ user }) => {
      if (user) setUser(user)
      void queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

export { useUploadAvatar }
