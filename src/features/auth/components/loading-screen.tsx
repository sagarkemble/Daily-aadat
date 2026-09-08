import { GalleryVerticalEndIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"

export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-8 items-center justify-center rounded-md">
          <GalleryVerticalEndIcon className="size-6" />
        </div>
        <Spinner className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  )
}
