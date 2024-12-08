import { logger } from '../../util/logger.js'

interface LogAccessJobProps {
  ipAddress: string
  accessedAt: string
}

export async function logAccessJob (accessInfo: LogAccessJobProps): Promise<void> {
  try {

  } catch (error) {
    logger.error('Error logging access:', error)
    throw error
  }
}
