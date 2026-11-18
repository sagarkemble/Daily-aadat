import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { SHORTCUTS } from "@/features/settings/lib/shortcuts"

function ShortcutsPane() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-base font-medium">Shortcuts</h2>
        <p className="text-sm text-muted-foreground">
          Keys that work anywhere in the app, except inside text fields.
        </p>
      </div>
      <ItemGroup className="gap-2">
        {SHORTCUTS.map((shortcut) => (
          <Item key={shortcut.title} variant="outline">
            <ItemContent>
              <ItemTitle>{shortcut.title}</ItemTitle>
              <ItemDescription>{shortcut.detail}</ItemDescription>
            </ItemContent>
            <ItemActions>
              {shortcut.keys.map((key) => (
                <Badge key={key} variant="outline">
                  {key}
                </Badge>
              ))}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

export { ShortcutsPane }
