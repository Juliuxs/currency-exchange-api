import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/error-handler.js'
import { getAccessLogs } from '../service/access-logs.js'
import { type AccessLogsQuery } from '../schema/access-logs.js'

export const getAccessLogsController = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate, limit, offset } = req.query as AccessLogsQuery['query']

  const params = {
    startDate: startDate && new Date(startDate),
    endDate: endDate && new Date(endDate),
    limit: limit ?? 100,
    offset: offset ?? 0
  }
  const logs = await getAccessLogs(params)

  res.status(200).json({
    data: logs,
    pagination: {
      limit: params.limit,
      offset: params.offset
    }
  })
})
