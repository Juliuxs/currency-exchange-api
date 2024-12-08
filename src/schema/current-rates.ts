import { z } from 'zod'

export const CurrentExchangeRatesSchema = z.object({
  ip: z.string().ip().optional()
})
