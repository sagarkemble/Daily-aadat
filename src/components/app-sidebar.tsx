"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavBrand } from "@/components/nav-brand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Settings2Icon,
  LayoutTemplateIcon,
  ListIcon,
  CalendarIcon,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Day",
      url: "/",
      icon: <CalendarIcon />,
    },
    {
      title: "Activities",
      url: "/activites",
      icon: <ListIcon />,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: <LayoutTemplateIcon />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
