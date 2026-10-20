import { ChevronDownIcon, LogOutIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSignOut } from "@/features/auth/hooks/use-sign-out"
import { useAuthStore } from "@/features/auth/stores/auth-store"

function displayNameFromUser(
  email: string | undefined,
  metadata: Record<string, unknown> | undefined
) {
  const fullName = metadata?.full_name
  if (typeof fullName === "string" && fullName.trim() !== "") {
    return fullName
  }
  if (email) {
    return email.split("@")[0] ?? "Account"
  }
  return "Account"
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function NavUser() {
  const user = useAuthStore((state) => state.user)
  const { mutate: signOut } = useSignOut()
  const email = user?.email ?? ""
  const name = displayNameFromUser(email, user?.user_metadata)
  const avatar =
    typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : ""
  const initials = initialsFromName(name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            aria-label="Account menu"
            className="rounded-full pl-1.5 pr-3"
          />
        }
      >
        <Avatar size="sm">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                {email ? (
                  <span className="truncate text-xs">{email}</span>
                ) : null}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { NavUser }
