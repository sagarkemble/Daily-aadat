import type { CSSProperties } from "react"
import { Link } from "@tanstack/react-router"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { LibraryPreview } from "@/features/design-system/components/library-previews"
import {
  LIBRARY_GROUPS,
  LIBRARY_ITEMS,
  type LibraryId,
} from "@/features/design-system/lib/library"

type LibraryShellProps = {
  component: LibraryId
  onComponentChange: (id: LibraryId) => void
}

const SELECT_ITEMS = LIBRARY_ITEMS.map((item) => ({
  value: item.id,
  label: item.title,
}))

export function LibraryShell({
  component,
  onComponentChange,
}: LibraryShellProps) {
  const current = LIBRARY_ITEMS.find((item) => item.id === component)

  return (
    <SidebarProvider
      className="min-h-0 items-start gap-8 md:gap-10"
      style={{ "--sidebar-width": "14rem" } as CSSProperties}
    >
      <Sidebar
        collapsible="none"
        className="hidden border-r bg-background pr-3 md:flex md:sticky md:top-24 md:h-[calc(100svh-8rem)]"
      >
        <SidebarContent>
          <ScrollArea className="h-full">
            {LIBRARY_GROUPS.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          size="sm"
                          isActive={item.id === component}
                          render={
                            <Link
                              to="/design-system"
                              search={{ component: item.id }}
                            />
                          }
                        >
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col gap-6 md:pl-2">
        <div className="flex flex-col gap-3 md:hidden">
          <Select
            items={SELECT_ITEMS}
            value={component}
            onValueChange={(value) => {
              if (typeof value === "string") onComponentChange(value as LibraryId)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {LIBRARY_GROUPS.map((group) => (
                <SelectGroup key={group.label}>
                  {group.items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-medium tracking-tight">
            {current?.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Live variants from the project tokens. Press d for light and dark.
          </p>
        </div>
        <LibraryPreview id={component} />
      </div>
    </SidebarProvider>
  )
}
