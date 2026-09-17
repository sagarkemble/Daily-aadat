import { useEffect, useState } from "react"

export function useNow(enabled: boolean) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [enabled])

  return now
}
