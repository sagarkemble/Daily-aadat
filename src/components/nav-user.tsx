import { LogOutIcon, SettingsIcon } from "lucide-react"

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
import { useFetchProfile } from "@/features/settings/hooks/use-fetch-profile"
import { AVATAR_PRESETS } from "@/features/settings/lib/looks"
import {
  avatarPresetFromUser,
  displayNameFromUser,
  initialsFromName,
} from "@/features/settings/lib/profile-display"
import { useSettingsDialogStore } from "@/features/settings/stores/settings-dialog-store"

function NavUser() {
  const user = useAuthStore((state) => state.user)
  const { data: profile } = useFetchProfile()
  const { mutate: signOut } = useSignOut()
  const setOpen = useSettingsDialogStore((state) => state.setOpen)
  const email = profile?.email ?? user?.email ?? ""
  const name = displayNameFromUser(user, profile ?? undefined)
  const avatar = profile?.avatar_url ?? ""
  const preset = avatarPresetFromUser(user)
  const presetBg = AVATAR_PRESETS.find((item) => item.id === preset)?.bg
  const initials = initialsFromName(name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account menu"
          />
        }
      >
        <Avatar style={presetBg && !avatar ? { background: presetBg } : undefined}>
          {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
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
          <DropdownMenuItem
            onClick={() => {
              setOpen(true)
            }}
          >
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
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
