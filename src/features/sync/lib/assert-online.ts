function assertOnline() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("Couldn't reach the server")
  }
}

export { assertOnline }
