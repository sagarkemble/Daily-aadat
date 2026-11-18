import type { User } from "@supabase/supabase-js"

import type { Profile } from "@/features/settings/types/profile"

function displayNameFromUser(user: User | null, profile: Profile | undefined) {
  if (profile?.display_name?.trim()) return profile.display_name.trim()
  const fullName = user?.user_metadata?.full_name
  if (typeof fullName === "string" && fullName.trim() !== "") return fullName
  const email = profile?.email ?? user?.email
  if (email) return email.split("@")[0] ?? "Account"
  return "Account"
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function avatarPresetFromUser(user: User | null) {
  const preset = user?.user_metadata?.avatar_preset
  return typeof preset === "string" ? preset : ""
}

function hasGoogleIdentity(user: User | null) {
  return Boolean(user?.identities?.some((identity) => identity.provider === "google"))
}

function hasEmailIdentity(user: User | null) {
  return Boolean(
    user?.identities?.some((identity) => identity.provider === "email")
  )
}

export {
  avatarPresetFromUser,
  displayNameFromUser,
  hasEmailIdentity,
  hasGoogleIdentity,
  initialsFromName,
}
