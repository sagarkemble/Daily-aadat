import { Outlet } from "@tanstack/react-router"

import { AppDateMenu } from "@/components/app-date-menu"
import { AppNavTabs } from "@/components/app-nav-tabs"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"

function AppFrame() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 hidden border-b bg-background md:block">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center gap-6 px-6 lg:px-8">
          <AppDateMenu />
          <div className="flex flex-1 justify-center">
            <AppNavTabs variant="desktop" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavUser />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 pb-24 md:px-6 md:pb-4 lg:px-8">
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
