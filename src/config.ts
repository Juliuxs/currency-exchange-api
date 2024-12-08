import { z } from 'zod'

const configSchema = z.object({
  port: z.number(),
  openExchangeRates: z.object({
    apiKey: z.string(),
    baseUrl: z.string()
  }),
  rateCacheDurationInMs: z.number(),
  database: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    password: z.string()
  })
})

type Config = z.infer<typeof configSchema>

export function getConfig (): Config {
  const config = {
    port: Number(process.env.PORT),
    openExchangeRates: {
      apiKey: process.env.OPEN_EXCHANGE_RATES_API_KEY,
      baseUrl: process.env.OPEN_EXCHANGE_RATES_BASE_URL
    },
    rateCacheDurationInMs: Number(process.env.CURRENCY_RATE_CACHE_DURATION),
    database: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    }
  }

  return process.env.NODE_ENV === 'TEST' ? config : configSchema.parse(config)
}

export const config = getConfig()
