export type Profile = {
  id: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  auth_source: "email" | "google"
}
