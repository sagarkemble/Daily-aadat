import { PageHeader } from "@/components/page-header"
import { PrimitivesGallery } from "@/features/design-system/components/primitives-gallery"
import { TokenBoard } from "@/features/design-system/components/token-board"

export function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Design system"
        description="Tokens and components as they ship. Press d for light and dark."
      />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Tokens</h2>
        <TokenBoard />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Components</h2>
        <PrimitivesGallery />
      </section>
    </div>
  )
}
