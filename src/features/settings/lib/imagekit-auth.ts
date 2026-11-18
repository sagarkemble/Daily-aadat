import { supabase } from "@/lib/supabase"

type ImagekitAuth = {
  token: string
  expire: number
  signature: string
}

async function fetchImagekitAuth(): Promise<ImagekitAuth> {
  const urls: string[] = []
  if (import.meta.env.DEV) {
    urls.push("/api/imagekit-auth")
  }
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (typeof supabaseUrl === "string" && supabaseUrl.length > 0) {
    urls.push(`${supabaseUrl}/functions/v1/imagekit-auth`)
  }

  let lastError = "Could not get ImageKit auth"
  for (const url of urls) {
    try {
      const { data } = await supabase.auth.getSession()
      const headers: HeadersInit = {}
      if (data.session?.access_token && url.includes("/functions/")) {
        headers.Authorization = `Bearer ${data.session.access_token}`
        const publishable = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        if (typeof publishable === "string") {
          headers.apikey = publishable
        }
      }
      const response = await fetch(url, { headers })
      if (!response.ok) {
        lastError = `ImageKit auth failed (${response.status})`
        continue
      }
      const payload = (await response.json()) as ImagekitAuth
      if (!payload.token || !payload.signature || !payload.expire) {
        lastError = "ImageKit auth response was incomplete"
        continue
      }
      return payload
    } catch {
      lastError = "ImageKit auth request failed"
    }
  }

  throw new Error(lastError)
}

export { fetchImagekitAuth }
export type { ImagekitAuth }
