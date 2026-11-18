import { Link } from "@tanstack/react-router"

import { AadatLogoLink } from "@/components/aadat-wordmark"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import {
  PrivacyPolicyCopy,
  TermsOfServiceCopy,
} from "@/features/settings/components/legal-copy"

type LegalPageProps = {
  kind: "privacy" | "terms"
}

function LegalPage({ kind }: LegalPageProps) {
  const title = kind === "privacy" ? "Privacy policy" : "Terms of service"
  const user = useAuthStore((state) => state.user)

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-8 px-6 py-10">
      <AadatLogoLink />
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-xl font-medium tracking-tight">
          {title}
        </h1>
        {kind === "privacy" ? <PrivacyPolicyCopy /> : <TermsOfServiceCopy />}
      </div>
      <p className="text-sm text-muted-foreground">
        {user ? (
          <Link to="/" className="underline underline-offset-4">
            Back to the app
          </Link>
        ) : (
          <Link to="/sign-in" className="underline underline-offset-4">
            Back to sign in
          </Link>
        )}
      </p>
    </div>
  )
}

export { LegalPage }
