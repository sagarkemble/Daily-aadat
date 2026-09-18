import { lazy, Suspense, useState } from "react"
import { FaceSlightlySmiling } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const IconPicker = lazy(() => import("@/components/icon-picker-tanstack"))

type IconPickerPopoverProps = {
  selectedIcon: string | null
  setSelectedIcon: (icon: string) => void
}

function IconPickerPopover({
  selectedIcon,
  setSelectedIcon,
}: IconPickerPopoverProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button type="button" className={"w-fit"} variant="outline" />}
      >
        {selectedIcon ? (
          <DynamicIcon
            name={selectedIcon as IconName}
            className="size-4"
            fallback={() => <FaceSlightlySmiling className="size-4" />}
          />
        ) : (
          <FaceSlightlySmiling className="size-4" />
        )}
      </PopoverTrigger>
      {open ? (
        <PopoverContent className="w-auto p-0" align="start">
          <Suspense fallback={<div className="h-80 w-72" />}>
            <IconPicker
              selectedIcon={selectedIcon}
              setSelectedIcon={(iconName) => {
                setSelectedIcon(iconName)
                setOpen(false)
              }}
            />
          </Suspense>
        </PopoverContent>
      ) : null}
    </Popover>
  )
}

export default IconPickerPopover
