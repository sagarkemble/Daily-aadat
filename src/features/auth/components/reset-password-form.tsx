import { cn } from "cn"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEndIcon } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"

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
  type ResetPasswordInput,
  resetPasswordInputSchema,
} from "../types/reset-password-input"
import { useResetPassword } from "../hooks/use-reset-password"
import { useAuthStore } from "../stores/auth-store"
import { useSignOut } from "../hooks/use-sign-out"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
  })
  const setIsPasswordRecovery = useAuthStore(
    (state) => state.setIsPasswordRecovery
  )
  const { mutate: signOutMutation } = useSignOut()
  const navigate = useNavigate()
  const {
    mutate: resetPasswordMutation,
    isPending,
    isSuccess,
    isError,
    error,
  } = useResetPassword()

  function onSubmit(data: ResetPasswordInput) {
    resetPasswordMutation(data.password, {
      onError: (error) => {
        console.error("Error resetting password", error.message)
      },
      onSuccess: () => {
        signOutMutation(undefined, {
          onError: (error) => {
            console.error("Error signing out", error.message)
          },
          onSuccess: () => {
            setIsPasswordRecovery(false)
            navigate({ to: "/sign-in" })
          },
        })
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
            <h1 className="text-xl font-bold">Reset password</h1>
            <FieldDescription>
              Enter a new password for your account.
            </FieldDescription>
          </div>
          {isError && (
            <FieldError
              errors={[
                {
                  message:
                    error.name === "AuthSessionMissingError"
                      ? "Session Expired"
                      : error.message,
                },
              ]}
            />
          )}
          <Field data-invalid={!!errors.password || undefined}>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
          <Field data-invalid={!!errors.confirmPassword || undefined}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>
          {isSuccess && (
            <p className="text-center text-sm text-green-600 dark:text-green-500">
              Password reset successfully.{" "}
              <Link to="/sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </p>
          )}
          <Field>
            <Button type="submit" disabled={isPending || isSuccess}>
              {isPending ? "Resetting..." : "Reset password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        <Link to="/forgot-password" className="underline underline-offset-4">
          Forgot password?
        </Link>
      </FieldDescription>
    </div>
  )
}
