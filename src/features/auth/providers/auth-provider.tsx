import React, { useEffect } from "react"
import { useAuthStore } from "../stores/auth-store"
import { supabase } from "@/lib/supabase"
import { LoadingScreen } from "../components/loading-screen"

type Props = {
  children: React.ReactNode
  onSessionChange: () => void
}

const AuthProvider = ({ children, onSessionChange }: Props) => {
  const isLoading = useAuthStore((state) => state.isLoading)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)
  const setUser = useAuthStore((state) => state.setUser)
  const setIsPasswordRecovery = useAuthStore(
    (state) => state.setIsPasswordRecovery
  )
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.auth.getUser()
      setUser(data.user)
      setIsLoading(false)
      if (error) console.error("Error fetching user", error.message)
    }
    fetchUser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (_event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true)
      }
      if (_event === "SIGNED_OUT") {
        setIsPasswordRecovery(false)
      }

      setIsLoading(false)
      onSessionChange()
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
}

export default AuthProvider
