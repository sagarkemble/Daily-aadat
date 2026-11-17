const generations = new Map<string, number>()

function nextSyncGeneration(entityId: string) {
  const next = (generations.get(entityId) ?? 0) + 1
  generations.set(entityId, next)
  return next
}

function isCurrentSyncGeneration(entityId: string, generation: number) {
  return generations.get(entityId) === generation
}

export { nextSyncGeneration, isCurrentSyncGeneration }
