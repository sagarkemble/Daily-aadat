import {
  PrivacyPolicyCopy,
  TermsOfServiceCopy,
} from "@/features/settings/components/legal-copy"

function PrivacyPane() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-base font-medium">Privacy policy</h2>
          <p className="text-sm text-muted-foreground">
            What Daily Aadat stores about you.
          </p>
        </div>
        <PrivacyPolicyCopy />
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-base font-medium">Terms of service</h2>
          <p className="text-sm text-muted-foreground">
            The rules for using the app.
          </p>
        </div>
        <TermsOfServiceCopy />
      </section>
    </div>
  )
}

export { PrivacyPane }
