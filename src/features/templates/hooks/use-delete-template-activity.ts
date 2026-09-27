import { toast } from "@/components/ui/toast"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteTemplateActivity(id: string) {
  const { data, error } = await supabase
    .from("template_items")
    .delete()
    .eq("id", id)
    .select()
  if (error) throw error
  return data
}

export function useDeleteTemplateActivity(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTemplateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.add({
        title: "Activity deleted",
        description: "Activity deleted successfully",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message,
        type: "error",
      })
    },
  })
}
