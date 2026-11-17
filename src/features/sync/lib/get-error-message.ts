function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Couldn't save"
}

export { getErrorMessage }
