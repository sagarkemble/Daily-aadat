import type { ReactNode } from "react"

export function PreviewFrame({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="rounded-xl border bg-card p-6">{children}</div>
    </section>
  )
}
