import { useEffect, useState } from "react"
import {
  RefreshCwIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import type { SyncPhase } from "../lib/sync-copy"

const faceTransition = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1],
} as const

const SAVED_HOLD_MS = 1200

function faceFromPhase(phase: SyncPhase) {
  if (phase === "saving") return "saving"
  if (phase === "warning") return "warning"
  if (phase === "error") return "error"
  if (phase === "saved") return "saved"
  return "idle"
}

function SyncFace({ phase }: { phase: SyncPhase }) {
  const shouldReduceMotion = useReducedMotion()
  const [face, setFace] = useState(() => faceFromPhase(phase))

  useEffect(() => {
    if (phase !== "saved") {
      setFace(faceFromPhase(phase))
      return
    }
    setFace("saved")
    const id = window.setTimeout(() => setFace("idle"), SAVED_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [phase])

  const icon =
    face === "saving" ? (
      <RefreshCwIcon className="animate-spin text-muted-foreground" />
    ) : face === "warning" ? (
      <TriangleAlertIcon className="text-warning" />
    ) : face === "error" ? (
      <XIcon className="text-destructive" />
    ) : (
      <RefreshCwIcon />
    )

  return (
    <span className="relative flex size-5 items-center justify-center overflow-visible">
      <AnimatePresence initial={false}>
        <motion.span
          key={
            face === "saving" || face === "warning" || face === "error"
              ? face
              : "idle"
          }
          className="absolute inset-0 flex items-center justify-center overflow-visible"
          initial={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : faceTransition}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { SyncFace }
