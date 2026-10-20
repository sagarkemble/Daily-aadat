import { useState, type CSSProperties } from "react"

import { PageHeader } from "@/components/page-header"
import { AccentLab } from "@/features/design-system/components/accent-lab"
import { ExpressionCards } from "@/features/design-system/components/expression-cards"
import { PrimitivesGallery } from "@/features/design-system/components/primitives-gallery"
import { TokenBoard } from "@/features/design-system/components/token-board"
import {
  ACCENT_PRESETS,
  accentTokens,
} from "@/features/design-system/lib/accent-presets"

export function DesignSystemPage() {
  const [presetId, setPresetId] = useState("ink")
  const preset =
    ACCENT_PRESETS.find((item) => item.id === presetId) ?? ACCENT_PRESETS[0]

  return (
    <div
      className="flex flex-col gap-8"
      style={accentTokens(preset) as CSSProperties}
    >
      <PageHeader
        title="Design system"
        description="Quiet chrome. Colour on slots and highlight cards. Press d for light and dark. Accents below stay on this page."
      />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Accent</h2>
        <AccentLab preset={preset} onPresetChange={setPresetId} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Tokens</h2>
        <TokenBoard />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Slot cards</h2>
        <ExpressionCards />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Components</h2>
        <PrimitivesGallery />
      </section>
    </div>
  )
}
