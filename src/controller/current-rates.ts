import { type Request, type Response } from 'express'
import { getCurrentRatesAndLogAccess } from '../service/current-rates.js'
import { catchAsync } from '../middleware/error-handler.js'

export const getCurrentExchangeRates = catchAsync(async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown'

  const rates = await getCurrentRatesAndLogAccess(ip)

  res.status(200).json(rates)
})
