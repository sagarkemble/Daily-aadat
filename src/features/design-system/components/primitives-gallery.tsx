import { useState, type ReactNode } from "react"
import { CalendarIcon, InfoIcon, ListTodoIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const typeItems = [
  { value: "check", label: "Check" },
  { value: "timed", label: "Timed" },
  { value: "count", label: "Count" },
]

function Block({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

export function PrimitivesGallery() {
  const [date, setDate] = useState(new Date(2026, 9, 20))

  return (
    <div className="flex flex-col gap-4">
      <Block title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>
            <Spinner data-icon="inline-start" />
            Saving
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Block>

      <Block title="Badges and toggles">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Toggle aria-label="Todos">
            <ListTodoIcon />
          </Toggle>
          <ToggleGroup defaultValue={["day"]}>
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Block>

      <Block title="Forms">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="ds-name">Activity name</FieldLabel>
            <Input id="ds-name" defaultValue="Walk" />
            <FieldDescription>Name in the catalog.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-type">Tracking type</FieldLabel>
            <Select items={typeItems} defaultValue="check">
              <SelectTrigger id="ds-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {typeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="ds-note">Note</FieldLabel>
            <Textarea id="ds-note" defaultValue="Keep it short." />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="ds-done" />
            <FieldLabel htmlFor="ds-done">Mark done</FieldLabel>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="ds-error">Invalid</FieldLabel>
            <Input id="ds-error" aria-invalid />
            <FieldError>This field is required.</FieldError>
          </Field>
        </FieldGroup>
      </Block>

      <Block title="Card, item, empty">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Afternoon</CardTitle>
            <CardDescription>Quiet surface, not a slot fill.</CardDescription>
          </CardHeader>
          <CardContent>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Tea</ItemTitle>
                <ItemDescription>Check</ItemDescription>
              </ItemContent>
            </Item>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Add activity</Button>
          </CardFooter>
        </Card>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarIcon />
            </EmptyMedia>
            <EmptyTitle>No plan yet</EmptyTitle>
            <EmptyDescription>Apply a template to this date.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Block>

      <Block title="Feedback and overlays">
        <div className="flex flex-wrap items-center gap-2">
          <Spinner />
          <Skeleton className="h-8 w-40" />
          <Avatar>
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            onClick={() =>
              toast.add({ title: "Saved", description: "Template applied." })
            }
          >
            Toast
          </Button>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Dialog
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
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Alert
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
          <Popover>
            <PopoverTrigger render={<Button variant="outline">Calendar</Button>} />
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                required
              />
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                <InfoIcon />
              </TooltipTrigger>
              <TooltipContent>Tooltip</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator />
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <TabsContent value="open">Open todos</TabsContent>
          <TabsContent value="done">Done todos</TabsContent>
        </Tabs>
      </Block>

      <Block title="Menu, sheet, scroll">
        <div className="flex flex-wrap items-center gap-2">
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
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Sheet
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>You</SheetTitle>
                <SheetDescription>Phone settings stub.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Collapsible>
            <CollapsibleTrigger render={<Button variant="outline" />}>
              Collapsible
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="pt-2 text-sm text-muted-foreground">
                Hidden until opened.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
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
        <ScrollArea className="h-24 rounded-lg border">
          <div className="flex flex-col gap-2 p-3">
            <p className="text-sm">Early morning</p>
            <p className="text-sm">Morning</p>
            <p className="text-sm">Afternoon</p>
            <p className="text-sm">Evening</p>
            <p className="text-sm">Night</p>
            <p className="text-sm">Day-wide</p>
          </div>
        </ScrollArea>
      </Block>
    </div>
  )
}
