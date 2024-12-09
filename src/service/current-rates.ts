import { currencyProvider } from '../provider/currency-exchange-rates.js'
import { AppDataSource } from '../data-source.js'
import { CurrencyRate } from '../entity/currency-rates.js'
import { AppError } from '../middleware/error-handler.js'
import { logger } from '../util/logger.js'
import { backgroundWorker } from '../background-job/queue.js'

const currencyRateRepository = AppDataSource.getRepository(CurrencyRate)

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

    if (!storedRates) {
      return await synchronizeWithStorage()
    }

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
  void backgroundWorker.addTask({
    type: 'LOG_ACCESS',
    payload: {
      ipAddress: ip,
      accessedAt: new Date().toISOString()
    }
  })

  return await getCurrentRates()
}
