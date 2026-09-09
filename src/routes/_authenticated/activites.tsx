import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/activites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/activites"!</div>
}
