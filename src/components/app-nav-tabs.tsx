import { Link, useNavigate, useRouterState } from "@tanstack/react-router"

import {
  desktopNavItems,
  phoneNavItems,
  tabFromPathname,
  type AppNavItem,
} from "@/components/app-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type AppNavTabsProps = {
  variant: "desktop" | "phone"
}

function AppNavTabs({ variant }: AppNavTabsProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const items = variant === "phone" ? phoneNavItems : desktopNavItems
  const tab = tabFromPathname(pathname)
  const value = items.some((item) => item.url === tab) ? tab : ""

  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        void navigate({ to: next as AppNavItem["url"] })
      }}
      className={cn(variant === "phone" && "w-fit gap-0")}
    >
      <TabsList
        className={cn(
          variant === "phone" &&
            "h-auto w-fit gap-1 rounded-full bg-card p-1.5 shadow-lg ring-1 ring-foreground/10 group-data-horizontal/tabs:h-auto",
          variant === "desktop" &&
            "h-auto items-center gap-0 rounded-full p-0 group-data-horizontal/tabs:h-auto"
        )}
      >
        {items.map((item) => {
          const Icon = item.icon
          return (
            <TabsTrigger
              key={item.url}
              value={item.url}
              aria-label={item.title}
              nativeButton={false}
              render={<Link to={item.url} />}
              className={cn(
                variant === "desktop" &&
                  "h-11 flex-none items-center justify-center gap-2 rounded-full px-5 text-sm leading-none data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground",
                variant === "phone" &&
                  "size-10 flex-none rounded-full p-0 data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"
              )}
            >
              <Icon />
              {variant === "desktop" ? item.title : null}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export { AppNavTabs }
