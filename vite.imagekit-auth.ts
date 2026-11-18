import { createHmac, randomUUID } from "node:crypto"
import type { Plugin } from "vite"

function imagekitAuthPlugin(privateKey: string | undefined): Plugin {
  return {
    name: "imagekit-auth",
    configureServer(server) {
      server.middlewares.use("/api/imagekit-auth", (_req, res) => {
        if (!privateKey) {
          res.statusCode = 500
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ error: "IMAGEKIT_PRIVATE_KEY is missing" }))
          return
        }

        const token = randomUUID()
        const expire = Math.floor(Date.now() / 1000) + 60 * 30
        const signature = createHmac("sha1", privateKey)
          .update(token + String(expire))
          .digest("hex")

        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ token, expire, signature }))
      })
    },
  }
}

export { imagekitAuthPlugin }
