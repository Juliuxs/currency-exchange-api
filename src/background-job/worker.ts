import { logger } from '../util/logger.js'
import { synchronizeWithStorageJob } from './jobs/synchronize-with-storage.js'
import { logAccessJob } from './jobs/log-access.js'

export interface WorkerTask {
  type: 'LOG_ACCESS' | 'SYNCHRONIZE_WITH_STORAGE'
  payload?: {
    ipAddress: string
    accessedAt: string
  }
}
// Worker function that processes tasks
export async function worker (task: WorkerTask): Promise<void> {
  try {
    switch (task.type) {
      case 'LOG_ACCESS': {
        const ipAddress = task.payload?.ipAddress || 'unknown'
        const accessedAt = task.payload?.accessedAt

        await logAccessJob({
          ipAddress,
          accessedAt
        })
        logger.info(`Processing access log for IP: ${ipAddress}`)
        break
      }
      case 'SYNCHRONIZE_WITH_STORAGE': {
        await synchronizeWithStorageJob()
        logger.info('Processing data synchronization')
        break
      }
      default: {
        logger.warn(`Unknown task type: ${String(task.type)}`)
      }
    }
  } catch (error) {
    logger.error('Error processing background task:', error)
  }
}
