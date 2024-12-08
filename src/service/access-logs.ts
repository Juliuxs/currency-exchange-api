import { Between } from 'typeorm'
import { AppDataSource } from '../data-source.js'
import { AccessLog } from '../entity/access-logs.js'
import { AppError } from '../middleware/error-handler.js'

const accessLogRepository = AppDataSource.getRepository(AccessLog)

interface LogAccessJobProps {
  ipAddress: string
  accessedAt: string
}

export async function logAccess ({ ipAddress, accessedAt }: LogAccessJobProps): Promise<void> {
  try {
    await accessLogRepository.save({
      ipAddress,
      accessedAt
    })
  } catch (error) {
    throw new AppError(500, 'Internal server error', { isOperational: false, cause: error })
  }
}

interface GetAccessLogsParams {
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

interface AccessLogEntry {
  ipAddress: string
  accessedAt: Date
}

export async function getAccessLogs ({
  startDate,
  endDate,
  limit = 100,
  offset = 0
}: GetAccessLogsParams): Promise<AccessLogEntry[]> {
  const MAX_LIMIT = 1000
  const DEFAULT_START_DATE = new Date(0)
  const DEFAULT_END_DATE = new Date()

  try {
    // Validate and normalize pagination parameters
    const pageSize = Math.min(limit, MAX_LIMIT)
    const skipRecords = offset * pageSize

    // Build date range filter
    const dateFilter = {
      accessedAt: Between(
        startDate ?? DEFAULT_START_DATE,
        endDate ?? DEFAULT_END_DATE
      )
    }

    // Query access logs with pagination
    const accessLogs = await accessLogRepository.find({
      select: ['ipAddress', 'accessedAt'],
      where: dateFilter,
      take: pageSize,
      skip: skipRecords,
      order: { accessedAt: 'DESC' },
      cache: true
    })

    return accessLogs
  } catch (error) {
    throw new AppError(500, 'Failed to retrieve access logs', {
      isOperational: false,
      cause: error
    })
  }
}
