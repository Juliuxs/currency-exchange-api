import { CronJob } from 'cron'
import { backgroundWorker } from '../background-job/queue.js'
import { logger } from '../util/logger.js'
import { config } from '../config.js'

export const syncRatesCron = new CronJob(`*/${config.syncIntervalInMins} * * * *`, async () => {
  try {
    void backgroundWorker.addTask({
      type: 'SYNCHRONIZE_WITH_STORAGE'
    })
    logger.info('Scheduled currency rates sync task added to queue')
  } catch (error) {
    logger.error('Failed to schedule currency rates sync task:', error)
  }
})
