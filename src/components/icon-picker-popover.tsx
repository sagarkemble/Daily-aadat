import { useState } from "react"
import { FaceSlightlySmiling, icons } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import IconPicker from "@/components/icon-picker-tanstack"

type IconPickerPopoverProps = {
  selectedIcon: string | null
  setSelectedIcon: (icon: string) => void
}

function IconPickerPopover({
  selectedIcon,
  setSelectedIcon,
}: IconPickerPopoverProps) {
  const [open, setOpen] = useState(false)
  const Selected = selectedIcon
    ? icons[selectedIcon as keyof typeof icons]
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button type="button" className={"w-fit"} variant="outline" />}
      >
        {Selected ? <Selected className="size-4" /> : <FaceSlightlySmiling />}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <IconPicker
          selectedIcon={selectedIcon}
          setSelectedIcon={(iconName) => {
            setSelectedIcon(iconName)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default IconPickerPopover
