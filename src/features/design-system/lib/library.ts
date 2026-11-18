export type LibraryItem = {
  id: string
  title: string
}

export const LIBRARY_GROUPS: { label: string; items: LibraryItem[] }[] = [
  {
    label: "Foundations",
    items: [{ id: "tokens", title: "Tokens" }],
  },
  {
    label: "Components",
    items: [
      { id: "alert-dialog", title: "Alert Dialog" },
      { id: "avatar", title: "Avatar" },
      { id: "badge", title: "Badge" },
      { id: "breadcrumb", title: "Breadcrumb" },
      { id: "button", title: "Button" },
      { id: "calendar", title: "Calendar" },
      { id: "card", title: "Card" },
      { id: "checkbox", title: "Checkbox" },
      { id: "collapsible", title: "Collapsible" },
      { id: "dialog", title: "Dialog" },
      { id: "dropdown-menu", title: "Dropdown Menu" },
      { id: "empty", title: "Empty" },
      { id: "field", title: "Field" },
      { id: "input", title: "Input" },
      { id: "input-group", title: "Input Group" },
      { id: "item", title: "Item" },
      { id: "label", title: "Label" },
      { id: "popover", title: "Popover" },
      { id: "progress", title: "Progress" },
      { id: "scroll-area", title: "Scroll Area" },
      { id: "select", title: "Select" },
      { id: "separator", title: "Separator" },
      { id: "sheet", title: "Sheet" },
      { id: "skeleton", title: "Skeleton" },
      { id: "spinner", title: "Spinner" },
      { id: "table", title: "Table" },
      { id: "tabs", title: "Tabs" },
      { id: "textarea", title: "Textarea" },
      { id: "toast", title: "Toast" },
      { id: "toggle", title: "Toggle" },
      { id: "toggle-group", title: "Toggle Group" },
      { id: "tooltip", title: "Tooltip" },
      { id: "dynamic-icon", title: "Dynamic Icon" },
    ],
  },
]

export const LIBRARY_ITEMS = LIBRARY_GROUPS.flatMap((group) => group.items)

export type LibraryId = (typeof LIBRARY_ITEMS)[number]["id"]

export const LIBRARY_IDS = LIBRARY_ITEMS.map((item) => item.id)

export const DEFAULT_LIBRARY_ID: LibraryId = "button"

export function isLibraryId(value: string | undefined): value is LibraryId {
  return value != null && LIBRARY_IDS.includes(value)
}
