import { useRef, useState } from "react"
import { LinkIcon, Trash2Icon, UnlinkIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import {
  useChangeEmail,
  useChangePassword,
  useDeleteAccount,
  useLinkGoogle,
  useUnlinkGoogle,
} from "@/features/settings/hooks/use-account-security"
import { useUpdateProfile } from "@/features/settings/hooks/use-update-profile"
import { useUploadAvatar } from "@/features/settings/hooks/use-upload-avatar"
import { AVATAR_PRESETS } from "@/features/settings/lib/looks"
import {
  avatarPresetFromUser,
  displayNameFromUser,
  hasEmailIdentity,
  hasGoogleIdentity,
  initialsFromName,
} from "@/features/settings/lib/profile-display"
import type { Profile } from "@/features/settings/types/profile"

type AccountPaneProps = {
  profile: Profile | null | undefined
}

function AccountPane({ profile }: AccountPaneProps) {
  const user = useAuthStore((state) => state.user)
  const name = displayNameFromUser(user, profile ?? undefined)
  const email = profile?.email ?? user?.email ?? ""
  const avatarUrl = profile?.avatar_url ?? ""
  const preset = avatarPresetFromUser(user)
  const initials = initialsFromName(name)
  const googleLinked = hasGoogleIdentity(user)
  const canUnlinkGoogle = googleLinked && hasEmailIdentity(user)
  const fileRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState(name)
  const [emailValue, setEmailValue] = useState(email)
  const [password, setPassword] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: saveProfile, isPending: savingProfile } = useUpdateProfile()
  const { mutate: uploadAvatar, isPending: uploading } = useUploadAvatar()
  const { mutate: saveEmail, isPending: savingEmail } = useChangeEmail()
  const { mutate: savePassword, isPending: savingPassword } =
    useChangePassword()
  const { mutate: linkGoogle, isPending: linking } = useLinkGoogle()
  const { mutate: unlinkGoogle, isPending: unlinking } = useUnlinkGoogle()
  const { mutate: deleteAccount, isPending: deleting } = useDeleteAccount()

  const presetBg = AVATAR_PRESETS.find((item) => item.id === preset)?.bg

  return (
    <FieldGroup>
      <div className="flex items-center gap-3">
        <Avatar size="lg" style={presetBg ? { background: presetBg } : undefined}>
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback
            style={presetBg ? { background: presetBg, color: "oklch(0.16 0.02 80)" } : undefined}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium">{name}</p>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <Field>
        <FieldLabel>Presets</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {AVATAR_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Avatar preset ${item.id}`}
              onClick={() =>
                saveProfile(
                  {
                    avatarUrl: null,
                    avatarPreset: item.id,
                  },
                  {
                    onError: (error) =>
                      toast.add({
                        title: "Could not save avatar",
                        description: error.message,
                        type: "error",
                      }),
                  }
                )
              }
              className="size-10 rounded-full ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                background: item.bg,
                outline:
                  preset === item.id && !avatarUrl
                    ? "2px solid var(--foreground)"
                    : undefined,
              }}
            />
          ))}
        </div>
      </Field>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (!file) return
          uploadAvatar(file, {
            onSuccess: () =>
              toast.add({
                title: "Avatar updated",
                type: "success",
              }),
            onError: (error) =>
              toast.add({
                title: "Could not upload",
                description: error.message,
                type: "error",
              }),
          })
        }}
      />
      <Button
        variant="outline"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? <Spinner data-icon="inline-start" /> : null}
        {uploading ? "Uploading…" : "Upload photo"}
      </Button>
      <Field>
        <FieldLabel htmlFor="settings-name">Display name</FieldLabel>
        <Input
          id="settings-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={savingProfile || displayName.trim() === ""}
          onClick={() =>
            saveProfile(
              { displayName: displayName.trim() },
              {
                onSuccess: () =>
                  toast.add({ title: "Name saved", type: "success" }),
                onError: (error) =>
                  toast.add({
                    title: "Could not save name",
                    description: error.message,
                    type: "error",
                  }),
              }
            )
          }
        >
          Save name
        </Button>
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-email">Email</FieldLabel>
        <Input
          id="settings-email"
          type="email"
          value={emailValue}
          onChange={(event) => setEmailValue(event.target.value)}
        />
        <FieldDescription>
          We send a confirm link to the new address.
        </FieldDescription>
        <Button
          variant="outline"
          size="sm"
          disabled={savingEmail || emailValue.trim() === ""}
          onClick={() =>
            saveEmail(emailValue.trim(), {
              onSuccess: () =>
                toast.add({
                  title: "Check your inbox",
                  description: "Confirm the new email to finish the change.",
                  type: "success",
                }),
              onError: (error) =>
                toast.add({
                  title: "Could not change email",
                  description: error.message,
                  type: "error",
                }),
            })
          }
        >
          Save email
        </Button>
      </Field>
      <Separator />
      <Field>
        <FieldLabel>Sign-in</FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          {hasEmailIdentity(user) ? (
            <Badge variant="secondary">Password</Badge>
          ) : null}
          {googleLinked ? <Badge variant="secondary">Google</Badge> : null}
          {googleLinked ? (
            <Button
              variant="outline"
              size="sm"
              disabled={unlinking || !canUnlinkGoogle}
              onClick={() =>
                unlinkGoogle(undefined, {
                  onSuccess: () =>
                    toast.add({ title: "Google unlinked", type: "success" }),
                  onError: (error) =>
                    toast.add({
                      title: "Could not unlink Google",
                      description: error.message,
                      type: "error",
                    }),
                })
              }
            >
              <UnlinkIcon data-icon="inline-start" />
              Unlink Google
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={linking}
              onClick={() =>
                linkGoogle(undefined, {
                  onError: (error) =>
                    toast.add({
                      title: "Could not link Google",
                      description: error.message,
                      type: "error",
                    }),
                })
              }
            >
              <LinkIcon data-icon="inline-start" />
              Link Google
            </Button>
          )}
        </div>
        {googleLinked && !canUnlinkGoogle ? (
          <FieldDescription>
            Set a password before unlinking Google.
          </FieldDescription>
        ) : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="settings-password">Password</FieldLabel>
        <Input
          id="settings-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        <Button
          variant="outline"
          size="sm"
          disabled={savingPassword || password.length < 8}
          onClick={() =>
            savePassword(password, {
              onSuccess: () => {
                setPassword("")
                toast.add({ title: "Password updated", type: "success" })
              },
              onError: (error) =>
                toast.add({
                  title: "Could not update password",
                  description: error.message,
                  type: "error",
                }),
            })
          }
        >
          Save password
        </Button>
      </Field>
      <Separator />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          <Trash2Icon data-icon="inline-start" />
          Delete account
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Days, templates, activities, and todos are removed. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault()
                deleteAccount(undefined, {
                  onError: (error) =>
                    toast.add({
                      title: "Could not delete account",
                      description: error.message,
                      type: "error",
                    }),
                })
              }}
            >
              {deleting ? <Spinner data-icon="inline-start" /> : null}
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FieldGroup>
  )
}

export { AccountPane }
