import { logAccess } from '../../service/access-logs.js'
import { logger } from '../../util/logger.js'

interface LogAccessJobProps {
  ipAddress: string
  accessedAt: string
}

export async function logAccessJob (accessInfo: LogAccessJobProps): Promise<void> {
  try {
    await logAccess(accessInfo)
  } catch (error) {
    logger.error('Error logging access:', error)
    throw error
  }
}
