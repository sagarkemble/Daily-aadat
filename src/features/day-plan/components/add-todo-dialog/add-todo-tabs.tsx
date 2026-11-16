import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AddTodoTabsProps = {
  pileCount: number
  pile: ReactNode
  create: ReactNode
}

export function AddTodoTabs({ pileCount, pile, create }: AddTodoTabsProps) {
  return (
    <Tabs defaultValue="pile" className="gap-4">
      <TabsList className="w-full">
        <TabsTrigger value="pile">
          From your pile
          {pileCount > 0 ? (
            <span className="text-muted-foreground tabular-nums">
              {pileCount}
            </span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="new">New todo</TabsTrigger>
      </TabsList>
      <TabsContent value="pile" className="flex flex-col gap-3">
        {pile}
      </TabsContent>
      <TabsContent value="new">{create}</TabsContent>
    </Tabs>
  )
}
