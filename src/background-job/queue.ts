import fastq, { type queueAsPromised } from 'fastq'
import { worker, type WorkerTask } from './worker.js'
import { logger } from '../util/logger.js'

const queue: queueAsPromised<WorkerTask> = fastq.promise(worker, 10)

export const backgroundWorker = {
  async addTask (task: WorkerTask): Promise<void> {
    try {
      await queue.push(task)
    } catch (error) {
      logger.error('Failed to add task to queue:', error)
    }
  }
}
