import { logger } from '../../util/logger.js'

export async function synchronizeWithStorageJob (): Promise<void> {
  try {

  } catch (error) {
    logger.error('Error synchronizing with storage:', error)
    throw error
  }
}
