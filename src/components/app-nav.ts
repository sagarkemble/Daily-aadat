import type { LucideIcon } from "lucide-react"
import {
  HouseIcon,
  LayoutTemplateIcon,
  ListTodoIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react"

type AppNavItem = {
  title: string
  url: "/" | "/templates" | "/activites" | "/todos" | "/settings"
  icon: LucideIcon
}

const desktopNavItems = [
  { title: "Day", url: "/", icon: HouseIcon },
  { title: "Templates", url: "/templates", icon: LayoutTemplateIcon },
  { title: "Activities", url: "/activites", icon: SparklesIcon },
  { title: "Todos", url: "/todos", icon: ListTodoIcon },
] as const satisfies readonly AppNavItem[]

const phoneNavItems = [
  ...desktopNavItems,
  { title: "You", url: "/settings", icon: UserIcon },
] as const satisfies readonly AppNavItem[]

function tabFromPathname(pathname: string): AppNavItem["url"] | undefined {
  if (pathname === "/") {
    return "/"
  }
  if (pathname.startsWith("/templates")) {
    return "/templates"
  }
  if (pathname.startsWith("/activites")) {
    return "/activites"
  }
  if (pathname.startsWith("/todos")) {
    return "/todos"
  }
  if (pathname.startsWith("/settings")) {
    return "/settings"
  }
  return undefined
}

export { desktopNavItems, phoneNavItems, tabFromPathname }
export type { AppNavItem }
