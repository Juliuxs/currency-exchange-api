import { describe, it, expect, vi, beforeEach } from 'vitest'
import { worker, type WorkerTask } from '../worker.js'
import { synchronizeWithStorageJob } from '../jobs/synchronize-with-storage.js'
import { logAccessJob } from '../jobs/log-access.js'
import { logger } from '../../util/logger.js'


vi.mock('../jobs/synchronize-with-storage.js', () => ({
  synchronizeWithStorageJob: vi.fn()
}))
vi.mock('../jobs/log-access.js', () => ({
  logAccessJob: vi.fn()
}))
vi.mock('../../util/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}))

describe('Background Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should process LOG_ACCESS task', async () => {
    const accessedAt = new Date().toISOString()
    const task: WorkerTask = {
      type: 'LOG_ACCESS',
      payload: {
        ipAddress: '192.168.1.1',
        accessedAt
      }
    }

    await worker(task)

    expect(logAccessJob).toHaveBeenCalledWith({
      ipAddress: '192.168.1.1',
      accessedAt
    })
    expect(vi.mocked(logger.info)).toHaveBeenCalledWith('Processing access log for IP: 192.168.1.1')
  })

  it('should use "unknown" as default IP if payload is missing', async () => {
    const task: WorkerTask = {
      type: 'LOG_ACCESS'
    }

    await worker(task)

    expect(logAccessJob).toHaveBeenCalledWith({
      ipAddress: 'unknown',
      accessedAt: undefined
    })
    expect(vi.mocked(logger.info)).toHaveBeenCalledWith('Processing access log for IP: unknown')
  })

  it('should process SYNCHRONIZE_WITH_STORAGE task', async () => {
    const task: WorkerTask = {
      type: 'SYNCHRONIZE_WITH_STORAGE'
    }

    await worker(task)

    expect(synchronizeWithStorageJob).toHaveBeenCalled()
    expect(vi.mocked(logger.info)).toHaveBeenCalledWith('Processing data synchronization')
  })

  it('should log warning for unknown task type', async () => {
    // Using type assertion to unknown first to avoid TypeScript error
    const task = {
      type: 'UNKNOWN_TASK'
    } as unknown as WorkerTask

    await worker(task)

    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith('Unknown task type: UNKNOWN_TASK')
  })

  it('should handle errors during task processing', async () => {
    const error = new Error('Processing failed')
    vi.mocked(logAccessJob).mockRejectedValueOnce(error)

    const task: WorkerTask = {
      type: 'LOG_ACCESS',
      payload: {
        accessedAt: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      }
    }

    await worker(task)

    expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Error processing background task:', error)
  })
})
