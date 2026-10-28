import {
  DynamicIcon,
  dynamicIconSizes,
  dynamicIconVariantsList,
} from "@/components/dynamic-icon"
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
        <h2 className="text-sm font-medium">Dynamic icon</h2>
        <p className="text-sm text-muted-foreground">
          Size and surface variants for catalog icons. Pass size and variant
          instead of custom classes.
        </p>
        <div className="flex flex-col gap-6">
          {dynamicIconVariantsList.map((variant) => (
            <div key={variant} className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-muted-foreground">
                {variant}
              </h3>
              <div className="flex flex-wrap items-end gap-8">
                {dynamicIconSizes.map((size) => (
                  <div
                    key={size}
                    className="flex flex-col items-center gap-2"
                  >
                    <DynamicIcon name="house" size={size} variant={variant} />
                    <span className="text-xs text-muted-foreground">
                      {size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
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
