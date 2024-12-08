import { currencyProvider } from '../provider/currency-exchange-rates.js'
import { AppDataSource } from '../data-source.js'
import { CurrencyRate } from '../entity/currency-rates.js'
import { checkTTL } from '../util/check-ttl.js'
import { createRevalidationLock } from '../background-job/revalidation-lock.js'
import { AppError } from '../middleware/error-handler.js'
import { logger } from '../util/logger.js'
import { backgroundWorker } from '../background-job/queue.js'

const currencyRateRepository = AppDataSource.getRepository(CurrencyRate)
const revalidator = createRevalidationLock()

export async function synchronizeWithStorage (): Promise<ExchangeRates> {
  try {
    const latestRates = await currencyProvider.getLatestRates()
    if (!latestRates) {
      throw new AppError(503, 'Unable to fetch latest currency rates from provider', { isOperational: false })
    }

    const savedRate = await currencyRateRepository.save({
      base: latestRates.base,
      rates: latestRates.rates,
      ratesChangedAt: new Date(latestRates.timestamp * 1000)
    })

    return {
      base: savedRate.base,
      rates: savedRate.rates,
      timestamp: savedRate.ratesChangedAt.toISOString()
    }
  } catch (error) {
    logger.error('Error synchronizing with storage:', error)
    throw new AppError(500, 'Internal server error', { isOperational: false, cause: error })
  }
}

export async function getCurrentRates (): Promise<ExchangeRates> {
  try {
    const storedRates = await currencyRateRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' }
    })

    // If no rates exist yet, we must initially populate them
    if (!storedRates) {
      return await synchronizeWithStorage()
    }

    // Check if rates need refreshing
    const needsRefresh = checkTTL(storedRates.createdAt.getTime())

    if (needsRefresh) {
      // Start background revalidation if needed
      await revalidator.startRevalidation(async () => {
        await backgroundWorker.addTask({
          type: 'SYNCHRONIZE_WITH_STORAGE'
        })
      })
    }

    // Always return the latest stored rates immediately
    return {
      base: storedRates.base,
      rates: storedRates.rates,
      timestamp: storedRates.createdAt.toISOString()
    }
  } catch (error) {
    throw new AppError(500, 'Internal server error', { isOperational: false, cause: error })
  }
}

interface ExchangeRates {
  base: string
  rates: Record<string, number>
  timestamp: string
}

export async function getCurrentRatesAndLogAccess (ip: string): Promise<ExchangeRates> {
  backgroundWorker.addTask({
    type: 'LOG_ACCESS',
    payload: {
      ipAddress: ip,
      accessedAt: new Date().toISOString()
    }
  })

  return await getCurrentRates()
}
