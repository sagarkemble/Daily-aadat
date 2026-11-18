import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

import { imagekitAuthPlugin } from "./vite.imagekit-auth"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
  plugins: [
    tanstackRouter(),
    react(),
    tailwindcss(),
    imagekitAuthPlugin(env.IMAGEKIT_PRIVATE_KEY),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["lucide-react"],
    exclude: ["lucide-react/dynamic"],
  },
  }
})
