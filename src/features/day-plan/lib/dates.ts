const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function todayDate(): string {
  return formatLocalDate(new Date())
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(value: string, amount: number): string {
  const date = parseLocalDate(value)
  date.setDate(date.getDate() + amount)
  return formatLocalDate(date)
}

export function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  return formatLocalDate(parseLocalDate(value)) === value
}

export function formatDayHeading(value: string, today: string): string {
  const pretty = parseLocalDate(value).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
  if (value === today) return `Today, ${pretty}`
  return pretty
}
