import type { User } from "@supabase/supabase-js"
import { create } from "zustand"

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (isLoading: boolean) => void
  isPasswordRecovery: boolean
  setIsPasswordRecovery: (isPasswordRecovery: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  isPasswordRecovery: false,
  setIsPasswordRecovery: (isPasswordRecovery) => set({ isPasswordRecovery }),
}))
