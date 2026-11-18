function PrivacyPolicyCopy() {
  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground">
      <p>
        Daily Aadat is a personal day planner. This note describes what we
        store and why. It is not a substitute for advice from a lawyer.
      </p>
      <p>
        <span className="font-medium text-foreground">Account.</span> We keep
        your email, display name, avatar, and how you sign in (email or
        Google). Auth is handled by Supabase.
      </p>
      <p>
        <span className="font-medium text-foreground">Planner data.</span>{" "}
        Activities, templates, day plans, placements, and todos belong to your
        account. They are stored so the app can show your days.
      </p>
      <p>
        <span className="font-medium text-foreground">Avatars.</span> Photos
        you upload are stored with ImageKit in the Daily Aadat folder. Preset
        avatars stay as a choice on your profile.
      </p>
      <p>
        <span className="font-medium text-foreground">Device.</span> Look and
        theme are saved in this browser only.
      </p>
      <p>
        <span className="font-medium text-foreground">We do not</span> sell
        your data, run ads against it, or make your days public.
      </p>
      <p>
        <span className="font-medium text-foreground">Delete.</span> Delete
        account in Settings removes your profile and planner data we store.
        Sign-out leaves the data in place.
      </p>
      <p>Last updated 18 November 2026.</p>
    </div>
  )
}

function TermsOfServiceCopy() {
  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground">
      <p>
        Daily Aadat is a personal tool. Use it for your own days. Do not use
        it to harm others or to break the law.
      </p>
      <p>
        <span className="font-medium text-foreground">Your content.</span> You
        own the names, notes, and photos you add. You give us permission to
        store them so the app can work.
      </p>
      <p>
        <span className="font-medium text-foreground">The service.</span> The
        app may change, pause, or have gaps. We do not promise it will always
        be up.
      </p>
      <p>
        <span className="font-medium text-foreground">Account.</span> Keep your
        sign-in to yourself. You can change email, password, and linked Google
        in Settings, or delete the account.
      </p>
      <p>
        <span className="font-medium text-foreground">Google.</span> If you
        sign in with Google, you also follow Google&apos;s terms for that
        sign-in.
      </p>
      <p>Last updated 18 November 2026.</p>
    </div>
  )
}

export { PrivacyPolicyCopy, TermsOfServiceCopy }
