import { Outlet } from "@tanstack/react-router"

import { AppDateMenu } from "@/components/app-date-menu"
import { AppNavTabs } from "@/components/app-nav-tabs"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"

function AppFrame() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 hidden h-20 shrink-0 items-center gap-6 border-b bg-background px-6 md:flex">
        <AppDateMenu />
        <div className="flex flex-1 justify-center">
          <AppNavTabs variant="desktop" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavUser />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pb-24 md:pb-4">
        <Outlet />
      </main>
      <nav
        aria-label="Primary"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="pointer-events-auto">
          <AppNavTabs variant="phone" />
        </div>
      </nav>
    </div>
  )
}

export { AppFrame }
