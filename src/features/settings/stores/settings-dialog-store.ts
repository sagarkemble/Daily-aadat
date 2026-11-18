import { create } from "zustand"

type SettingsPane = "account" | "appearance" | "shortcuts" | "privacy"

type SettingsDialogStore = {
  open: boolean
  pane: SettingsPane
  setOpen: (open: boolean) => void
  setPane: (pane: SettingsPane) => void
}

const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
  open: false,
  pane: "account",
  setOpen: (open) => set({ open }),
  setPane: (pane) => set({ pane }),
}))

export { useSettingsDialogStore }
export type { SettingsPane }
