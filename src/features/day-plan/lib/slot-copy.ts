import {
  BookOpenIcon,
  LaptopIcon,
  LeafIcon,
  MoonIcon,
  SunIcon,
  type LucideIcon,
} from "lucide-react"

import type { Slot } from "@/features/templates/types/slots"

type SlotCopy = {
  description: string
  icon: LucideIcon
  sky: string
}

const SLOT_COPY: Record<Slot, SlotCopy> = {
  early_morning: {
    description: "Start fresh, your way.",
    icon: SunIcon,
    sky: "#FF8A80",
  },
  morning: {
    description: "Build momentum.",
    icon: BookOpenIcon,
    sky: "#FFC94D",
  },
  afternoon: {
    description: "Keep going.",
    icon: LaptopIcon,
    sky: "#B2A0F6",
  },
  evening: {
    description: "Wind down and reflect.",
    icon: LeafIcon,
    sky: "#F59A6B",
  },
  night: {
    description: "Rest for a better tomorrow.",
    icon: MoonIcon,
    sky: "#8F8DF2",
  },
}

export { SLOT_COPY }
export type { SlotCopy }
