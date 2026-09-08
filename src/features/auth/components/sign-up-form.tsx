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
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type SignUpInput } from "../types/sign-up-input"
import { signUpInputSchema } from "../types/sign-up-input"
import { useEmailPasswordSignUp } from "../hooks/use-email-password-sign-up"
import { useGoogleSignIn } from "../hooks/use-google-sign-in"
import { useState } from "react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpInputSchema),
  })

  const [isEmailSent, setIsEmailSent] = useState(false)
  const {
    mutate: emailPasswordSignUpMutation,
    isPending: isEmailPasswordSignUpPending,
    isError: isEmailPasswordSignUpError,
    error: emailPasswordSignUpError,
  } = useEmailPasswordSignUp()
  const {
    mutate: googleSignInMutation,
    isPending: isGoogleSignInPending,
    isError: isGoogleSignInError,
    error: googleSignInError,
  } = useGoogleSignIn()

  function onSubmit(_data: SignUpInput) {
    emailPasswordSignUpMutation(_data, {
      onSuccess: (data) => {
        console.log("Account created successfully", data)
        if (data.user && !data.session) setIsEmailSent(true)
      },
      onError: (error) => {
        console.log(error.message)
      },
    })
  }

  function onGoogleSignIn() {
    googleSignInMutation()
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
            <h1 className="text-xl font-bold">Welcome to Daily Aadat</h1>
            <FieldDescription>
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </FieldDescription>
          </div>
          {isEmailSent && (
            <FieldDescription className="text-green-600 dark:text-green-500">
              Please check your email to verify your account.
            </FieldDescription>
          )}
          {isEmailPasswordSignUpError && (
            <FieldError
              errors={[{ message: emailPasswordSignUpError.message }]}
            />
          )}
          {isGoogleSignInError && (
            <FieldError errors={[{ message: googleSignInError.message }]} />
          )}
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
          <Field data-invalid={!!errors.password || undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
          <Field>
            <Button type="submit" disabled={isEmailPasswordSignUpPending}>
              {isEmailPasswordSignUpPending
                ? "Creating account..."
                : "Create Account"}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <Button variant="outline" type="button" onClick={onGoogleSignIn}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              {isGoogleSignInPending ? "Signing up..." : "Continue with Google"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
