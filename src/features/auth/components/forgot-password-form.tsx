import { cn } from "cn"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEndIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  type ForgotPasswordInput,
  forgotPasswordInputSchema,
} from "../types/forgot-password-input"
import { useForgotPassword } from "../hooks/use-forgot-password"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordInputSchema),
  })

  const {
    mutate: forgotPasswordMutation,
    isPending,
    isSuccess,
    isError,
    error,
  } = useForgotPassword()

  function onSubmit(data: ForgotPasswordInput) {
    forgotPasswordMutation(data, {
      onError: (error) => {
        console.error("Error sending reset email", error.message)
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">Daily Aadat</span>
            </a>
            <h1 className="text-xl font-bold">Forgot password</h1>
            <FieldDescription>
              Remember your password? <Link to="/sign-in">Sign in</Link>
            </FieldDescription>
            {isSuccess && (
              <p className="text-center text-sm text-green-600 dark:text-green-500">
                Email sent for password reset.
              </p>
            )}
          </div>
          {isError && <FieldError errors={[{ message: error.message }]} />}
          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send reset email"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
