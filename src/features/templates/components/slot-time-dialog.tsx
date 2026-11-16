import { useId, useState } from "react"
import { ArrowRightIcon, ClockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  SLOT_DEFAULT_RANGE,
  formatClock,
  formatDuration,
  formatSlotRange,
  fromMinutes,
  toClock,
  toMinutes,
} from "../lib/slot-time"
import type { TimedSlot } from "../types/slots"

const STEP_MINUTES = 15
const DURATION_PRESETS = [30, 60, 90, 120, 180]

type SlotTimes = { start: string | null; end: string | null }

type SlotTimeDialogProps = {
  slot: TimedSlot
  title: string
  startTime: string | null
  endTime: string | null
  disabled?: boolean
  onSave: (times: SlotTimes) => Promise<unknown>
}

function timeOptions(extra: (string | null)[]) {
  const values = new Set<string>()
  for (let minutes = 0; minutes < 24 * 60; minutes += STEP_MINUTES) {
    values.add(fromMinutes(minutes))
  }
  for (const value of extra) if (value) values.add(value)
  return [...values]
    .sort((a, b) => toMinutes(a) - toMinutes(b))
    .map((value) => ({ value, label: formatClock(value) }))
}

function presetLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`
}

function TimeSelect({
  id,
  value,
  options,
  disabled,
  invalid,
  onChange,
}: {
  id: string
  value: string
  options: { value: string; label: string }[]
  disabled: boolean
  invalid?: boolean
  onChange: (value: string) => void
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as string)
      }}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid || undefined}
        className="w-full tabular-nums"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="tabular-nums"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SlotTimeDialog({
  slot,
  title,
  startTime,
  endTime,
  disabled = false,
  onSave,
}: SlotTimeDialogProps) {
  const id = useId()
  const savedStart = toClock(startTime)
  const savedEnd = toClock(endTime)
  const hasSaved = savedStart !== null && savedEnd !== null
  const suggested = SLOT_DEFAULT_RANGE[slot]
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(savedStart ?? suggested.start)
  const [end, setEnd] = useState(savedEnd ?? suggested.end)
  const [pendingAction, setPendingAction] = useState<"save" | "clear" | null>(
    null
  )
  const isPending = pendingAction !== null

  const options = timeOptions([savedStart, savedEnd, start, end])
  const duration = formatDuration(start, end)
  const invalid = duration === null
  const durationMinutes = toMinutes(end) - toMinutes(start)
  const unchanged = hasSaved && start === savedStart && end === savedEnd

  function handleStartChange(next: string) {
    const length = durationMinutes > 0 ? durationMinutes : 60
    setStart(next)
    setEnd(fromMinutes(toMinutes(next) + length))
  }

  function run(action: "save" | "clear", times: SlotTimes) {
    setPendingAction(action)
    toast
      .promise(onSave(times), {
        loading: {
          title: action === "clear" ? "Clearing time…" : "Saving time…",
        },
        success: {
          title:
            action === "clear"
              ? `${title} time cleared`
              : `${title} · ${formatSlotRange(start, end)}`,
        },
        error: { title: "Couldn't save the time" },
      })
      .then(() => setOpen(false))
      .finally(() => setPendingAction(null))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (invalid) return
    if (unchanged) {
      setOpen(false)
      return
    }
    run("save", { start, end })
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className={cn(
          "-ml-2 w-fit self-start tabular-nums",
          hasSaved ? "text-foreground" : "text-muted-foreground"
        )}
        disabled={disabled}
        onClick={() => {
          setStart(savedStart ?? suggested.start)
          setEnd(savedEnd ?? suggested.end)
          setOpen(true)
        }}
        aria-label={
          hasSaved
            ? `${title} time ${formatSlotRange(savedStart, savedEnd)}, edit`
            : `Set ${title} time`
        }
      >
        <ClockIcon data-icon="inline-start" />
        {hasSaved ? formatSlotRange(savedStart, savedEnd) : "Set time"}
      </Button>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title} time</DialogTitle>
            <DialogDescription>
              When this part of your day starts and ends.
            </DialogDescription>
          </DialogHeader>

          <form id={id} onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <Field data-disabled={isPending || undefined}>
                    <FieldLabel htmlFor={`${id}-start`}>Start</FieldLabel>
                    <TimeSelect
                      id={`${id}-start`}
                      value={start}
                      options={options}
                      disabled={isPending}
                      onChange={handleStartChange}
                    />
                  </Field>
                  <ArrowRightIcon
                    aria-hidden
                    className="mb-2.5 size-4 text-muted-foreground"
                  />
                  <Field
                    data-disabled={isPending || undefined}
                    data-invalid={invalid || undefined}
                  >
                    <FieldLabel htmlFor={`${id}-end`}>End</FieldLabel>
                    <TimeSelect
                      id={`${id}-end`}
                      value={end}
                      options={options}
                      disabled={isPending}
                      invalid={invalid}
                      onChange={setEnd}
                    />
                  </Field>
                </div>
                <p
                  aria-live="polite"
                  className="text-sm font-medium tabular-nums"
                >
                  {invalid ? (
                    <FieldError>End needs to be after start.</FieldError>
                  ) : (
                    <>
                      {formatSlotRange(start, end)}
                      <span className="text-muted-foreground">
                        {" "}
                        · {duration}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <FieldSet>
                <FieldLegend variant="label">Length</FieldLegend>
                <ToggleGroup
                  value={
                    DURATION_PRESETS.includes(durationMinutes)
                      ? [String(durationMinutes)]
                      : []
                  }
                  onValueChange={(value) => {
                    const minutes = Number(value[0])
                    if (minutes) setEnd(fromMinutes(toMinutes(start) + minutes))
                  }}
                  variant="outline"
                  size="sm"
                  spacing={1}
                  className="flex-wrap"
                  disabled={isPending}
                >
                  {DURATION_PRESETS.map((minutes) => (
                    <ToggleGroupItem key={minutes} value={String(minutes)}>
                      {presetLabel(minutes)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>

              {start !== suggested.start || end !== suggested.end ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto w-fit px-0 text-muted-foreground"
                  disabled={isPending}
                  onClick={() => {
                    setStart(suggested.start)
                    setEnd(suggested.end)
                  }}
                >
                  {`Use typical ${title.toLowerCase()} (${formatSlotRange(suggested.start, suggested.end)})`}
                </Button>
              ) : null}
            </FieldGroup>
          </form>

          <DialogFooter className="sm:justify-between">
            {hasSaved ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={isPending}
                onClick={() => run("clear", { start: null, end: null })}
              >
                {pendingAction === "clear" ? (
                  <Spinner data-icon="inline-start" />
                ) : null}
                Clear time
              </Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button type="submit" form={id} disabled={isPending || invalid}>
                {pendingAction === "save" ? (
                  <Spinner data-icon="inline-start" />
                ) : null}
                {pendingAction === "save" ? "Saving…" : "Save time"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { SlotTimeDialog }
export type { SlotTimes }
