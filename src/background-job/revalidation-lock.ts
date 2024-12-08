import { logger } from "../util/logger.js"

interface RevalidationLockState {
  inProgress: boolean
  promise: Promise<void> | null
}

interface RevalidationLock {
  startRevalidation: (revalidateFn: () => Promise<void>) => Promise<void>
}

export function createRevalidationLock (): RevalidationLock {
  const state: RevalidationLockState = {
    inProgress: false,
    promise: null
  }

  return {
    startRevalidation: async (revalidateFn: () => Promise<void>): Promise<void> => {
      if (!state.inProgress) {
        state.inProgress = true
        state.promise = (async () => {
          try {
            await revalidateFn()
          } catch (error) {
            logger.error('Background revalidation failed:', error)
          } finally {
            state.inProgress = false
            state.promise = null
          }
        })()
      }
    }
  }
}
