import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

export function NavBrand() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: "/" })
  }
  return (
    <SidebarMenu onClick={handleClick}>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEndIcon />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Daily Aadat</span>
            <span className="truncate text-xs">Your subtitle here</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
