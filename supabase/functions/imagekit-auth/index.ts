const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const authHeader = request.headers.get("Authorization")
  if (!authHeader) {
    return json({ error: "Unauthorized" }, 401)
  }

  const privateKey = Deno.env.get("IMAGEKIT_PRIVATE_KEY")
  if (!privateKey) {
    return json({ error: "IMAGEKIT_PRIVATE_KEY is missing" }, 500)
  }

  const token = crypto.randomUUID()
  const expire = Math.floor(Date.now() / 1000) + 60 * 30
  const signature = await hmacSha1(privateKey, token + String(expire))

  return json({ token, expire, signature }, 200)
})

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

async function hmacSha1(secret: string, value: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
