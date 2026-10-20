const DAY_QUOTES = [
  "Small steps today create big changes tomorrow.",
  "A little progress each day adds up to big results.",
  "Show up. The rest follows.",
  "Protect the hours that protect you.",
  "Done is kinder than perfect.",
  "One slot at a time is still a day lived.",
  "Rest is part of the work.",
  "Keep the aadat. Skip the guilt.",
] as const

function quoteForDate(date: string) {
  let hash = 0
  for (const char of date) {
    hash = (hash + char.charCodeAt(0) * 17) % DAY_QUOTES.length
  }
  return DAY_QUOTES[hash] ?? DAY_QUOTES[0]
}

export { quoteForDate }
