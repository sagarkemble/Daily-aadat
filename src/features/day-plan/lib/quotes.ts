const DAY_QUOTES = [
  "Show up today.\nThe rest follows.",
  "Done is kinder\nthan perfect.",
  "Small steps today.\nBig change tomorrow.",
  "Protect the hours\nthat protect you.",
  "Rest is part\nof the work.",
  "Keep the aadat.\nSkip the guilt.",
  "One slot at a time\nis still a day lived.",
  "A little each day\nadds up.",
] as const

function quoteForDate(date: string) {
  let hash = 0
  for (const char of date) {
    hash = (hash + char.charCodeAt(0) * 17) % DAY_QUOTES.length
  }
  return DAY_QUOTES[hash] ?? DAY_QUOTES[0]
}

export { quoteForDate }
