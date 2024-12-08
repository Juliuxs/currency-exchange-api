import { logger } from '../../util/logger.js'
import { synchronizeWithStorage } from '../../service/current-rates.js'

export async function synchronizeWithStorageJob (): Promise<void> {
  try {
    await synchronizeWithStorage()
  } catch (error) {
    logger.error('Error synchronizing with storage:', error)
    throw error
  }
}
