import { useState, type ReactNode } from "react"
import {
  CalendarIcon,
  ChevronDownIcon,
  InfoIcon,
  ListTodoIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import {
  DynamicIcon,
  dynamicIconSizes,
  dynamicIconVariantsList,
} from "@/components/dynamic-icon"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TokenBoard } from "@/features/design-system/components/token-board"
import { PreviewFrame } from "@/features/design-system/components/library-preview-frame"
import type { LibraryId } from "@/features/design-system/lib/library"
import {
  activityTypeItems,
  activityTypeSelectValue,
} from "@/features/activity/types/activity"

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const
const BUTTON_ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>
}

function Stack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>
}

function TokensPreview() {
  return <TokenBoard />
}

function ButtonPreview() {
  return (
    <Stack>
      <PreviewFrame title="Variant">
        <Row>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </Row>
      </PreviewFrame>
      <PreviewFrame title="Size">
        <Row>
          {BUTTON_SIZES.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </Row>
      </PreviewFrame>
      <PreviewFrame title="Icon">
        <Row>
          <Button>
            <PlusIcon data-icon="inline-start" />
            Add activity
          </Button>
          {BUTTON_ICON_SIZES.map((size) => (
            <Button key={size} size={size} variant="outline" aria-label={size}>
              <PlusIcon />
            </Button>
          ))}
        </Row>
      </PreviewFrame>
      <PreviewFrame title="Disabled">
        <Row>
          <Button disabled>Primary</Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button disabled>
            <Spinner data-icon="inline-start" />
            Saving
          </Button>
        </Row>
      </PreviewFrame>
    </Stack>
  )
}

function BadgePreview() {
  return (
    <PreviewFrame title="Variant">
      <Row>
        {BADGE_VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </Row>
    </PreviewFrame>
  )
}

function TogglePreview() {
  return (
    <Stack>
      <PreviewFrame title="Variant">
        <Row>
          <Toggle aria-label="Default">
            <ListTodoIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Outline">
            <ListTodoIcon />
          </Toggle>
        </Row>
      </PreviewFrame>
      <PreviewFrame title="Size">
        <Row>
          {(["sm", "default", "lg"] as const).map((size) => (
            <Toggle key={size} size={size} aria-label={size} variant="outline">
              <ListTodoIcon />
            </Toggle>
          ))}
        </Row>
      </PreviewFrame>
    </Stack>
  )
}

function ToggleGroupPreview() {
  return (
    <Stack>
      <PreviewFrame title="Default">
        <ToggleGroup defaultValue={["day"]}>
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </PreviewFrame>
      <PreviewFrame title="Outline">
        <ToggleGroup variant="outline" defaultValue={["open"]}>
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="done">Done</ToggleGroupItem>
        </ToggleGroup>
      </PreviewFrame>
    </Stack>
  )
}

function AvatarPreview() {
  return (
    <PreviewFrame title="Fallback">
      <Row>
        <Avatar>
          <AvatarFallback>DA</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
      </Row>
    </PreviewFrame>
  )
}

function CheckboxPreview() {
  return (
    <PreviewFrame title="States">
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id="lib-check" />
          <FieldLabel htmlFor="lib-check">Unchecked</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="lib-check-on" defaultChecked />
          <FieldLabel htmlFor="lib-check-on">Checked</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="lib-check-off" disabled />
          <FieldLabel htmlFor="lib-check-off">Disabled</FieldLabel>
        </Field>
      </FieldGroup>
    </PreviewFrame>
  )
}

function InputPreview() {
  return (
    <PreviewFrame title="States">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="lib-input">Default</FieldLabel>
          <Input id="lib-input" placeholder="Walk" />
        </Field>
        <Field>
          <FieldLabel htmlFor="lib-input-disabled">Disabled</FieldLabel>
          <Input id="lib-input-disabled" disabled defaultValue="Walk" />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="lib-input-invalid">Invalid</FieldLabel>
          <Input id="lib-input-invalid" aria-invalid />
          <FieldError>This field is required.</FieldError>
        </Field>
      </FieldGroup>
    </PreviewFrame>
  )
}

function TextareaPreview() {
  return (
    <PreviewFrame title="Default">
      <Field>
        <FieldLabel htmlFor="lib-note">Note</FieldLabel>
        <Textarea id="lib-note" defaultValue="Keep it short." />
      </Field>
    </PreviewFrame>
  )
}

function InputGroupPreview() {
  return (
    <PreviewFrame title="Addon">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="lib-search">Inline start</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput id="lib-search" placeholder="Search activities" />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="lib-pages">Inline end</FieldLabel>
          <InputGroup>
            <InputGroupInput id="lib-pages" defaultValue="20" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>pages</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </PreviewFrame>
  )
}

function FieldPreview() {
  return (
    <Stack>
      <PreviewFrame title="Vertical">
        <Field>
          <FieldLabel htmlFor="lib-field-v">Activity name</FieldLabel>
          <Input id="lib-field-v" defaultValue="Walk" />
          <FieldDescription>Name in the catalog.</FieldDescription>
        </Field>
      </PreviewFrame>
      <PreviewFrame title="Horizontal">
        <Field orientation="horizontal">
          <Checkbox id="lib-field-h" />
          <FieldLabel htmlFor="lib-field-h">Mark done</FieldLabel>
        </Field>
      </PreviewFrame>
    </Stack>
  )
}

function LabelPreview() {
  return (
    <PreviewFrame title="Default">
      <div className="flex flex-col gap-2">
        <Label htmlFor="lib-label">Slot</Label>
        <Input id="lib-label" defaultValue="Morning" />
      </div>
    </PreviewFrame>
  )
}

function SelectPreview() {
  return (
    <PreviewFrame title="Items">
      <Field>
        <FieldLabel htmlFor="lib-type">Tracking type</FieldLabel>
        <Select items={activityTypeItems} defaultValue="check">
          <SelectTrigger id="lib-type" className="w-full">
            <SelectValue>{activityTypeSelectValue}</SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {activityTypeItems.map(({ icon: Icon, label, value }) => (
                <SelectItem key={value} value={value}>
                  <Icon />
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </PreviewFrame>
  )
}

function CardPreview() {
  return (
    <Stack>
      <PreviewFrame title="Default">
        <Card>
          <CardHeader>
            <CardTitle>Afternoon</CardTitle>
            <CardDescription>Quiet surface, not a slot fill.</CardDescription>
          </CardHeader>
          <CardContent>Tea is a check activity on this day.</CardContent>
          <CardFooter>
            <Button variant="outline">Add activity</Button>
          </CardFooter>
        </Card>
      </PreviewFrame>
      <PreviewFrame title="Small">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Weekday</CardTitle>
            <CardDescription>6 activities</CardDescription>
          </CardHeader>
        </Card>
      </PreviewFrame>
    </Stack>
  )
}

function ItemPreview() {
  return (
    <Stack>
      <PreviewFrame title="Variant">
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <ListTodoIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Default</ItemTitle>
              <ItemDescription>No border.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <ListTodoIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Outline</ItemTitle>
              <ItemDescription>Bordered row.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <ListTodoIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Muted</ItemTitle>
              <ItemDescription>Quiet fill.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </PreviewFrame>
      <PreviewFrame title="Size">
        <ItemGroup>
          {(["default", "sm", "xs"] as const).map((size) => (
            <Item key={size} variant="outline" size={size}>
              <ItemContent>
                <ItemTitle>{size}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </PreviewFrame>
    </Stack>
  )
}

function EmptyPreview() {
  return (
    <Stack>
      <PreviewFrame title="Icon media">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarIcon />
            </EmptyMedia>
            <EmptyTitle>No plan yet</EmptyTitle>
            <EmptyDescription>
              Apply a template to this date.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PreviewFrame>
      <PreviewFrame title="Default media">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia>
              <CalendarIcon />
            </EmptyMedia>
            <EmptyTitle>Nothing on this day</EmptyTitle>
            <EmptyDescription>
              Start by adding an activity or todo.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PreviewFrame>
    </Stack>
  )
}

function SeparatorPreview() {
  return (
    <PreviewFrame title="Horizontal">
      <div className="flex flex-col gap-3">
        <p className="text-sm">Morning</p>
        <Separator />
        <p className="text-sm">Afternoon</p>
      </div>
    </PreviewFrame>
  )
}

function SkeletonPreview() {
  return (
    <PreviewFrame title="Default">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="size-10 rounded-lg" />
      </div>
    </PreviewFrame>
  )
}

function SpinnerPreview() {
  return (
    <PreviewFrame title="Default">
      <Row>
        <Spinner />
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Saving
        </Button>
      </Row>
    </PreviewFrame>
  )
}

function ProgressPreview() {
  return (
    <PreviewFrame title="Value">
      <Progress value={64}>
        <ProgressLabel>Onboarding</ProgressLabel>
        <ProgressValue />
      </Progress>
    </PreviewFrame>
  )
}

function TabsPreview() {
  return (
    <PreviewFrame title="Default">
      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <TabsContent value="open">Open todos</TabsContent>
        <TabsContent value="done">Done todos</TabsContent>
      </Tabs>
    </PreviewFrame>
  )
}

function TablePreview() {
  return (
    <PreviewFrame title="Default">
      <Table>
        <TableCaption>Day plan placements</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Morning walk</TableCell>
            <TableCell>Morning</TableCell>
            <TableCell>Done</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Read</TableCell>
            <TableCell>Evening</TableCell>
            <TableCell>Pending</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </PreviewFrame>
  )
}

function CalendarPreview() {
  const [date, setDate] = useState(new Date(2026, 10, 18))
  return (
    <PreviewFrame title="Single">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        required
      />
    </PreviewFrame>
  )
}

function DialogPreview() {
  return (
    <PreviewFrame title="Default">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply template</DialogTitle>
            <DialogDescription>
              Replaces the plan for this date.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PreviewFrame>
  )
}

function AlertDialogPreview() {
  return (
    <PreviewFrame title="Default">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          Open alert
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unplan this day?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos return to the pile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Unplan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreviewFrame>
  )
}

function SheetPreview() {
  return (
    <PreviewFrame title="Default">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Open sheet
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>You</SheetTitle>
            <SheetDescription>Phone settings stub.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </PreviewFrame>
  )
}

function PopoverPreview() {
  const [date, setDate] = useState(new Date(2026, 10, 18))
  return (
    <PreviewFrame title="Calendar">
      <Popover>
        <PopoverTrigger render={<Button variant="outline">Pick a date</Button>} />
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            required
          />
        </PopoverContent>
      </Popover>
    </PreviewFrame>
  )
}

function TooltipPreview() {
  return (
    <PreviewFrame title="Default">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" />}>
            <InfoIcon />
          </TooltipTrigger>
          <TooltipContent>Tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </PreviewFrame>
  )
}

function DropdownMenuPreview() {
  return (
    <PreviewFrame title="Default">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </PreviewFrame>
  )
}

function CollapsiblePreview() {
  return (
    <PreviewFrame title="Default">
      <Collapsible>
        <CollapsibleTrigger render={<Button variant="outline" />}>
          <ChevronDownIcon data-icon="inline-start" />
          Slot times
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="pt-3 text-sm text-muted-foreground">
            Hidden until opened.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </PreviewFrame>
  )
}

function BreadcrumbPreview() {
  return (
    <PreviewFrame title="Default">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Day</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Design system</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </PreviewFrame>
  )
}

function ScrollAreaPreview() {
  return (
    <PreviewFrame title="Default">
      <ScrollArea className="h-32 rounded-lg border">
        <div className="flex flex-col gap-2 p-3">
          <p className="text-sm">Early morning</p>
          <p className="text-sm">Morning</p>
          <p className="text-sm">Afternoon</p>
          <p className="text-sm">Evening</p>
          <p className="text-sm">Night</p>
          <p className="text-sm">Day-wide</p>
        </div>
      </ScrollArea>
    </PreviewFrame>
  )
}

function ToastPreview() {
  return (
    <PreviewFrame title="Default">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ title: "Saved", description: "Template applied." })
        }
      >
        Show toast
      </Button>
    </PreviewFrame>
  )
}

function DynamicIconPreview() {
  return (
    <Stack>
      {dynamicIconVariantsList.map((variant) => (
        <PreviewFrame key={variant} title={variant}>
          <div className="flex flex-wrap items-end gap-8">
            {dynamicIconSizes.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <DynamicIcon name="house" size={size} variant={variant} />
                <span className="text-xs text-muted-foreground">{size}</span>
              </div>
            ))}
          </div>
        </PreviewFrame>
      ))}
    </Stack>
  )
}

const PREVIEWS: Record<LibraryId, () => ReactNode> = {
  tokens: TokensPreview,
  button: ButtonPreview,
  badge: BadgePreview,
  toggle: TogglePreview,
  "toggle-group": ToggleGroupPreview,
  avatar: AvatarPreview,
  checkbox: CheckboxPreview,
  input: InputPreview,
  textarea: TextareaPreview,
  "input-group": InputGroupPreview,
  field: FieldPreview,
  label: LabelPreview,
  select: SelectPreview,
  card: CardPreview,
  item: ItemPreview,
  empty: EmptyPreview,
  separator: SeparatorPreview,
  skeleton: SkeletonPreview,
  spinner: SpinnerPreview,
  progress: ProgressPreview,
  tabs: TabsPreview,
  table: TablePreview,
  calendar: CalendarPreview,
  dialog: DialogPreview,
  "alert-dialog": AlertDialogPreview,
  sheet: SheetPreview,
  popover: PopoverPreview,
  tooltip: TooltipPreview,
  "dropdown-menu": DropdownMenuPreview,
  collapsible: CollapsiblePreview,
  breadcrumb: BreadcrumbPreview,
  "scroll-area": ScrollAreaPreview,
  toast: ToastPreview,
  "dynamic-icon": DynamicIconPreview,
}

export function LibraryPreview({ id }: { id: LibraryId }) {
  const Preview = PREVIEWS[id]
  return <Preview />
}
