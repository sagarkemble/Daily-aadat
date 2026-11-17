import { create } from "zustand"

type SyncKind = "write" | "refresh"
type SyncLevel = "error" | "warning"

type SyncStore = {
  lastSavedAt: number | null
  lastError: string | null
  lastKind: SyncKind
  lastLevel: SyncLevel | null
  clearError: () => void
  markSaved: () => void
  markError: (message: string) => void
  markWarning: (message: string) => void
}

export const useSyncStore = create<SyncStore>((set) => ({
  lastSavedAt: null,
  lastError: null,
  lastKind: "write",
  lastLevel: null,
  clearError: () => set({ lastError: null, lastLevel: null }),
  markSaved: () =>
    set({ lastSavedAt: Date.now(), lastError: null, lastLevel: null }),
  markError: (message) =>
    set({ lastError: message, lastKind: "write", lastLevel: "error" }),
  markWarning: (message) =>
    set({ lastError: message, lastKind: "refresh", lastLevel: "warning" }),
}))

export type { SyncKind, SyncLevel }
