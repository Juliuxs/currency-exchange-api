import { describe, it, expect, vi } from 'vitest'
import { logAccessJob } from '../log-access.js'
import { logAccess } from '../../../service/access-logs.js'

vi.mock('../../../service/access-logs.js')
vi.mock('../../../utils/logger.js')

describe('logAccessJob', () => {
  it('successfully logs access information', async () => {
    const accessInfo = {
      ipAddress: '127.0.0.1',
      accessedAt: '2023-01-01T00:00:00.000Z'
    }

    await logAccessJob(accessInfo)

    expect(logAccess).toHaveBeenCalledWith(accessInfo)
  })
})
